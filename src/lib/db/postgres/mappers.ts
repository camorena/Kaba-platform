/**
 * Row → domain mappers for Postgres repos (snake_case → camelCase).
 */

import type {
  InvoiceLine,
  InvoiceRecord,
  InvoiceStatus,
  PaymentMethod,
  PaymentRecord,
  PaymentStatus,
  QuoteNoteRecord,
  QuoteRecord,
  QuoteStatus,
  TrustClaimsRecord,
  ProfileRecord,
} from "@/lib/db/types";

function iso(value: Date | string | null | undefined): string {
  if (value == null) return new Date(0).toISOString();
  if (value instanceof Date) return value.toISOString();
  return new Date(value).toISOString();
}

function isoOrNull(value: Date | string | null | undefined): string | null {
  if (value == null) return null;
  return iso(value);
}

export type QuoteRow = {
  id: string;
  customer_id: string | null;
  name: string;
  phone: string;
  email: string;
  service_type: string;
  address: string;
  description: string;
  preferred_contact: string;
  source: string;
  status: QuoteStatus;
  notes: string;
  notified_at: Date | string | null;
  notify_attempts: number;
  created_at: Date | string;
  updated_at: Date | string;
};

export function mapQuote(row: QuoteRow): QuoteRecord {
  return {
    id: row.id,
    customerId: row.customer_id,
    name: row.name,
    phone: row.phone,
    email: row.email,
    serviceType: row.service_type,
    address: row.address,
    description: row.description,
    preferredContact: row.preferred_contact,
    source: row.source,
    status: row.status,
    notes: row.notes,
    notifiedAt: isoOrNull(row.notified_at),
    notifyAttempts: Number(row.notify_attempts) || 0,
    createdAt: iso(row.created_at),
    updatedAt: iso(row.updated_at),
  };
}

export type QuoteNoteRow = {
  id: string;
  quote_id: string;
  author_id: string | null;
  author_label: string;
  body: string;
  created_at: Date | string;
};

export function mapQuoteNote(row: QuoteNoteRow): QuoteNoteRecord {
  return {
    id: row.id,
    quoteId: row.quote_id,
    authorId: row.author_id,
    authorLabel: row.author_label,
    body: row.body,
    createdAt: iso(row.created_at),
  };
}

export type InvoiceRow = {
  id: string;
  number: string;
  quote_id: string | null;
  customer_id: string | null;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  address: string;
  status: InvoiceStatus;
  notes: string;
  demo: boolean;
  created_at: Date | string;
  updated_at: Date | string;
};

export type InvoiceLineRow = {
  id: string;
  invoice_id: string;
  description: string;
  quantity: string | number;
  unit_cents: number;
  sort_order: number;
};

export function mapInvoiceLine(row: InvoiceLineRow): InvoiceLine {
  return {
    id: row.id,
    description: row.description,
    quantity: Number(row.quantity),
    unitCents: Number(row.unit_cents),
  };
}

export function mapInvoice(
  row: InvoiceRow,
  lines: InvoiceLine[] = [],
): InvoiceRecord {
  return {
    id: row.id,
    number: row.number,
    quoteId: row.quote_id,
    customerId: row.customer_id,
    customerName: row.customer_name,
    customerEmail: row.customer_email,
    customerPhone: row.customer_phone,
    address: row.address,
    status: row.status,
    notes: row.notes,
    demo: Boolean(row.demo),
    createdAt: iso(row.created_at),
    updatedAt: iso(row.updated_at),
    lines,
  };
}

export type PaymentRow = {
  id: string;
  invoice_id: string;
  invoice_number?: string;
  customer_name?: string;
  amount_cents: number;
  method: PaymentMethod;
  status: PaymentStatus;
  reference: string;
  notes: string;
  demo: boolean;
  created_at: Date | string;
};

export function mapPayment(row: PaymentRow): PaymentRecord {
  return {
    id: row.id,
    createdAt: iso(row.created_at),
    invoiceId: row.invoice_id,
    invoiceNumber: row.invoice_number ?? "",
    customerName: row.customer_name ?? "",
    amountCents: Number(row.amount_cents),
    method: row.method,
    status: row.status,
    reference: row.reference,
    notes: row.notes,
    demo: Boolean(row.demo),
  };
}

export type SiteSettingsRow = {
  claim_free_estimates: boolean;
  claim_locally_owned: boolean;
  updated_at: Date | string | null;
};

export function mapTrustClaims(row: SiteSettingsRow | undefined): TrustClaimsRecord {
  if (!row) {
    return {
      claimFreeEstimates: false,
      claimLocallyOwned: false,
      updatedAt: null,
    };
  }
  return {
    claimFreeEstimates: Boolean(row.claim_free_estimates),
    claimLocallyOwned: Boolean(row.claim_locally_owned),
    updatedAt: isoOrNull(row.updated_at),
  };
}

export type ProfileRow = {
  id: string;
  email: string;
  full_name: string;
  role: ProfileRecord["role"];
  is_active: boolean;
  password_hash: string;
  created_at: Date | string;
  updated_at: Date | string;
};

export function mapProfile(row: ProfileRow): ProfileRecord {
  return {
    id: row.id,
    email: row.email,
    fullName: row.full_name,
    role: row.role,
    isActive: Boolean(row.is_active),
    passwordHash: row.password_hash ?? "",
    createdAt: iso(row.created_at),
    updatedAt: iso(row.updated_at),
  };
}
