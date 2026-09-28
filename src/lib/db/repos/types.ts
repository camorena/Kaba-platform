/**
 * Repository interfaces — Memory* implements these today;
 * Postgres* (or Drizzle) implements them when KABA_DATA_ADAPTER flips.
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
} from "@/lib/db/types";

export type QuotesRepo = {
  list(): QuoteRecord[];
  get(id: string): QuoteRecord | undefined;
  add(input: NewQuoteInput): QuoteRecord;
  update(id: string, patch: QuotePatch): QuoteRecord | undefined;
  bulkUpdateStatus(
    ids: string[],
    status: QuoteStatus,
  ): { updated: number; missing: string[] };
  stats(): {
    total: number;
    new: number;
    contacted: number;
    scheduled: number;
    won: number;
    lost: number;
  };
  listQuiet(thresholdDays?: number): QuoteRecord[];
  quietCount(thresholdDays?: number): number;
  listNotes(quoteId: string): QuoteNoteRecord[];
  addNote(
    quoteId: string,
    body: string,
    author?: { id?: string | null; label?: string },
  ): QuoteNoteRecord | null;
};

export type InvoicesRepo = {
  list(): InvoiceRecord[];
  get(id: string): InvoiceRecord | undefined;
  createFromQuote(quoteId: string): InvoiceRecord | null;
  updateStatus(id: string, status: InvoiceStatus): InvoiceRecord | undefined;
  subtotalCents(inv: InvoiceRecord): number;
  stats(paidByInvoiceId?: Map<string, number>): {
    total: number;
    draft: number;
    open: number;
    paid: number;
    totalOpenCents: number;
  };
};

export type PaymentsRepo = {
  list(): PaymentRecord[];
  listForInvoice(invoiceId: string): PaymentRecord[];
  get(id: string): PaymentRecord | undefined;
  paidCentsForInvoice(invoiceId: string): number;
  paidCentsMap(): Map<string, number>;
  record(input: {
    invoiceId: string;
    amountCents: number;
    method: PaymentMethod;
    reference?: string;
    notes?: string;
  }): PaymentRecord | null;
  stats(): { total: number; recordedCents: number };
};

export type CustomersRepo = {
  /** Derived from quotes today; durable table optional later. */
  list(): CustomerRecord[];
};

export type TrustClaimsRepo = {
  get(): TrustClaimsRecord;
  /** Server-side write path (memory/Postgres). Client Settings may still use localStorage until an API exists. */
  save(
    patch: Pick<TrustClaimsRecord, "claimFreeEstimates" | "claimLocallyOwned">,
  ): TrustClaimsRecord;
};

export type DataRepos = {
  readonly adapter: "memory" | "postgres";
  quotes: QuotesRepo;
  invoices: InvoicesRepo;
  payments: PaymentsRepo;
  customers: CustomersRepo;
  trustClaims: TrustClaimsRepo;
};
