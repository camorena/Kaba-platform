/**
 * Domain types aligned with db/migrations/0001_ops_foundation.sql.
 * In-memory adapters and (later) Postgres repos share these shapes.
 */

import type {
  InvoiceStatus,
  PaymentMethod,
  PaymentStatus,
  QuoteStatus,
} from "@/lib/admin/status";

export type { InvoiceStatus, PaymentMethod, PaymentStatus, QuoteStatus };

/** Stable string ids today (q_… / inv_…); UUID strings once Postgres lands. */
export type QuoteRecord = {
  id: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  phone: string;
  email: string;
  serviceType: string;
  address: string;
  description: string;
  preferredContact: string;
  source: string;
  status: QuoteStatus;
  /** Denormalized scratch pad (Settings/detail textarea). */
  notes: string;
  /** Null until owner notification succeeds (persist-then-notify). */
  notifiedAt: string | null;
  notifyAttempts: number;
  /** Optional FK when customers table is populated. */
  customerId: string | null;
};

export type QuoteNoteRecord = {
  id: string;
  quoteId: string;
  authorId: string | null;
  authorLabel: string;
  body: string;
  createdAt: string;
};

export type InvoiceLine = {
  id: string;
  description: string;
  quantity: number;
  /** Unit price in cents */
  unitCents: number;
};

export type InvoiceRecord = {
  id: string;
  number: string;
  createdAt: string;
  updatedAt: string;
  quoteId: string | null;
  customerId: string | null;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  address: string;
  status: InvoiceStatus;
  lines: InvoiceLine[];
  notes: string;
  /** Demo flag — seed/stub invoices are synthetic. */
  demo: boolean;
};

export type PaymentRecord = {
  id: string;
  createdAt: string;
  invoiceId: string;
  invoiceNumber: string;
  customerName: string;
  amountCents: number;
  method: PaymentMethod;
  status: PaymentStatus;
  reference: string;
  notes: string;
  demo: boolean;
};

export type CustomerRecord = {
  key: string;
  id: string | null;
  name: string;
  email: string;
  phone: string;
  quoteCount: number;
  latestQuoteAt: string;
  addresses: string[];
  statuses: QuoteStatus[];
};

export type TrustClaimsRecord = {
  claimFreeEstimates: boolean;
  claimLocallyOwned: boolean;
  updatedAt: string | null;
};

/** Staff profile — role is authoritative (credentials / future Auth.js). */
export type ProfileRecord = {
  id: string;
  email: string;
  fullName: string;
  role: "owner" | "editor" | "viewer";
  isActive: boolean;
  /** scrypt encoding; empty string = cannot sign in via credentials. */
  passwordHash: string;
  createdAt: string;
  updatedAt: string;
};


export type NewQuoteInput = Omit<
  QuoteRecord,
  | "id"
  | "createdAt"
  | "updatedAt"
  | "status"
  | "notes"
  | "notifiedAt"
  | "notifyAttempts"
  | "customerId"
> & {
  status?: QuoteStatus;
  notes?: string;
  customerId?: string | null;
};

export type QuotePatch = Partial<
  Pick<QuoteRecord, "status" | "notes" | "notifiedAt" | "notifyAttempts">
>;
