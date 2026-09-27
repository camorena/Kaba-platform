export type QuoteStatus = "new" | "contacted" | "scheduled" | "won" | "lost";
export type InvoiceStatus = "draft" | "sent" | "partial" | "paid" | "void";
export type PaymentMethod = "check" | "cash" | "ach" | "card" | "other";
export type PaymentStatus = "recorded" | "pending" | "failed";

export const QUOTE_STATUSES: QuoteStatus[] = [
  "new",
  "contacted",
  "scheduled",
  "won",
  "lost",
];

export const INVOICE_STATUSES: InvoiceStatus[] = [
  "draft",
  "sent",
  "partial",
  "paid",
  "void",
];

export const PAYMENT_METHODS: PaymentMethod[] = [
  "check",
  "cash",
  "ach",
  "card",
  "other",
];

/** Tailwind class tokens for status pills — works light + dark. */
export const quoteStatusTone: Record<QuoteStatus, string> = {
  new: "admin-badge-sky",
  contacted: "admin-badge-violet",
  scheduled: "admin-badge-amber",
  won: "admin-badge-emerald",
  lost: "admin-badge-muted",
};

export const invoiceStatusTone: Record<InvoiceStatus, string> = {
  draft: "admin-badge-muted",
  sent: "admin-badge-sky",
  partial: "admin-badge-amber",
  paid: "admin-badge-emerald",
  void: "admin-badge-rose",
};

export const paymentStatusTone: Record<PaymentStatus, string> = {
  recorded: "admin-badge-emerald",
  pending: "admin-badge-amber",
  failed: "admin-badge-rose",
};
