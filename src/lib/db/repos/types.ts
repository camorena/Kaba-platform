/**
 * Repository interfaces — Memory* and Postgres* implement the same async contract.
 * Default adapter is memory (no DATABASE_URL required for build/demo).
 */

import type { InvoiceLineInput } from "@/lib/invoices/lines";
import type { ReviewInput, ReviewPatch, ReviewRecord } from "@/lib/reviews/model";
import type {
  HighlightStatInput,
  HighlightStatPatch,
  HighlightStatRecord,
} from "@/lib/stats/highlights";
import type {
  CustomerPatch,
  CustomerProfile,
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
  /** Quotes due for tomorrow visit reminder (scheduled/won + scheduled_for + email). */
  listDueVisitReminders(tomorrowYmd: string): Promise<QuoteRecord[]>;
  /** Stamp visit reminder delivery (idempotency). */
  markVisitReminderSent(
    id: string,
    at?: string | null,
  ): Promise<QuoteRecord | undefined>;
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
  /** Stamp pay-link email delivery (idempotency for auto-send). */
  markPayLinkNotified(
    id: string,
    at?: string | null,
  ): Promise<InvoiceRecord | undefined>;
  /**
   * Replace all line items atomically. Only while status is draft/sent
   * (EDITABLE_INVOICE_STATUSES); otherwise "locked".
   */
  replaceLines(
    id: string,
    lines: InvoiceLineInput[],
  ): Promise<
    | { ok: true; invoice: InvoiceRecord }
    | { ok: false; reason: "not_found" | "locked" }
  >;
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
  get(id: string): Promise<CustomerProfile | undefined>;
  /** Throws CustomerEmailTakenError when the email belongs to another customer. */
  update(id: string, patch: CustomerPatch): Promise<CustomerProfile | undefined>;
};


export type ProfilesRepo = {
  getById(id: string): Promise<ProfileRecord | undefined>;
  getByEmail(email: string): Promise<ProfileRecord | undefined>;
  list(): Promise<ProfileRecord[]>;
};

/** Per-admin read state for the derived notifications bell. */
export type NotificationReadState = {
  /** ISO instant of the last "mark all as read" (null = never). */
  clearedAt: string | null;
  readKeys: Set<string>;
};

export type NotificationReadsRepo = {
  getState(profileId: string): Promise<NotificationReadState>;
  markRead(profileId: string, keys: string[]): Promise<void>;
  /** Mark these keys read and stamp clearedAt = now. */
  markAll(profileId: string, keys: string[]): Promise<void>;
};

export type TrustClaimsRepo = {
  get(): Promise<TrustClaimsRecord>;
  save(
    patch: Pick<TrustClaimsRecord, "claimFreeEstimates" | "claimLocallyOwned">,
  ): Promise<TrustClaimsRecord>;
};

export type ReviewsRepo = {
  /** All reviews, newest review_date first (admin). */
  list(): Promise<ReviewRecord[]>;
  /** Published only (public). */
  listPublished(): Promise<ReviewRecord[]>;
  get(id: string): Promise<ReviewRecord | undefined>;
  create(input: ReviewInput): Promise<ReviewRecord>;
  update(id: string, patch: ReviewPatch): Promise<ReviewRecord | undefined>;
  remove(id: string): Promise<boolean>;
};

export type HighlightStatsRepo = {
  list(): Promise<HighlightStatRecord[]>;
  create(input: HighlightStatInput): Promise<HighlightStatRecord>;
  update(
    id: string,
    patch: HighlightStatPatch,
  ): Promise<HighlightStatRecord | undefined>;
  remove(id: string): Promise<boolean>;
};

export type DataRepos = {
  readonly adapter: "memory" | "postgres";
  quotes: QuotesRepo;
  invoices: InvoicesRepo;
  payments: PaymentsRepo;
  customers: CustomersRepo;
  trustClaims: TrustClaimsRepo;
  profiles: ProfilesRepo;
  notificationReads: NotificationReadsRepo;
  reviews: ReviewsRepo;
  highlightStats: HighlightStatsRepo;
};
