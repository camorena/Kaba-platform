/**
 * Repository interfaces — Memory* and Postgres* implement the same async contract.
 * Default adapter is memory (no DATABASE_URL required for build/demo).
 */

import type {
  CustomerRecord,
  InvoiceRecord,
  InvoiceStatus,
  NewQuoteInput,
  PaymentMethod,
  PaymentRecord,
  QuoteNoteRecord,
  QuotePatch,
  QuoteRecord,
  QuoteStatus,
  TrustClaimsRecord,
  ProfileRecord,
} from "@/lib/db/types";

export type QuotesRepo = {
  list(): Promise<QuoteRecord[]>;
  get(id: string): Promise<QuoteRecord | undefined>;
  add(input: NewQuoteInput): Promise<QuoteRecord>;
  update(id: string, patch: QuotePatch): Promise<QuoteRecord | undefined>;
  bulkUpdateStatus(
    ids: string[],
    status: QuoteStatus,
  ): Promise<{ updated: number; missing: string[] }>;
  stats(): Promise<{
    total: number;
    new: number;
    contacted: number;
    scheduled: number;
    won: number;
    lost: number;
  }>;
  listQuiet(thresholdDays?: number): Promise<QuoteRecord[]>;
  quietCount(thresholdDays?: number): Promise<number>;
  listNotes(quoteId: string): Promise<QuoteNoteRecord[]>;
  addNote(
    quoteId: string,
    body: string,
    author?: { id?: string | null; label?: string },
  ): Promise<QuoteNoteRecord | null>;
};

export type InvoicesRepo = {
  list(): Promise<InvoiceRecord[]>;
  get(id: string): Promise<InvoiceRecord | undefined>;
  /** Lookup by opaque public pay token. */
  getByPayToken(token: string): Promise<InvoiceRecord | undefined>;
  createFromQuote(quoteId: string): Promise<InvoiceRecord | null>;
  updateStatus(
    id: string,
    status: InvoiceStatus,
  ): Promise<InvoiceRecord | undefined>;
  /** Pure helper — sync on purpose. */
  subtotalCents(inv: InvoiceRecord): number;
  stats(paidByInvoiceId?: Map<string, number>): Promise<{
    total: number;
    draft: number;
    open: number;
    paid: number;
    totalOpenCents: number;
  }>;
};

export type PaymentsRepo = {
  list(): Promise<PaymentRecord[]>;
  listForInvoice(invoiceId: string): Promise<PaymentRecord[]>;
  get(id: string): Promise<PaymentRecord | undefined>;
  paidCentsForInvoice(invoiceId: string): Promise<number>;
  paidCentsMap(): Promise<Map<string, number>>;
  record(input: {
    invoiceId: string;
    amountCents: number;
    method: PaymentMethod;
    reference?: string;
    notes?: string;
    /** When set, inserts are idempotent by this Stripe event id. */
    stripeEventId?: string | null;
    stripeCheckoutSessionId?: string | null;
    demo?: boolean;
  }): Promise<PaymentRecord | null>;
  /** Lookup by Stripe event id (webhook idempotency). */
  getByStripeEventId(eventId: string): Promise<PaymentRecord | undefined>;
  /** Lookup by Checkout Session id (cs_…) — secondary idempotency. */
  getByStripeCheckoutSessionId(
    sessionId: string,
  ): Promise<PaymentRecord | undefined>;
  stats(): Promise<{ total: number; recordedCents: number }>;
};

export type CustomersRepo = {
  /** Derived from quotes (and optional customers table on Postgres). */
  list(): Promise<CustomerRecord[]>;
};


export type ProfilesRepo = {
  getById(id: string): Promise<ProfileRecord | undefined>;
  getByEmail(email: string): Promise<ProfileRecord | undefined>;
  list(): Promise<ProfileRecord[]>;
};

export type TrustClaimsRepo = {
  get(): Promise<TrustClaimsRecord>;
  save(
    patch: Pick<TrustClaimsRecord, "claimFreeEstimates" | "claimLocallyOwned">,
  ): Promise<TrustClaimsRecord>;
};

export type DataRepos = {
  readonly adapter: "memory" | "postgres";
  quotes: QuotesRepo;
  invoices: InvoicesRepo;
  payments: PaymentsRepo;
  customers: CustomersRepo;
  trustClaims: TrustClaimsRepo;
  profiles: ProfilesRepo;
};
