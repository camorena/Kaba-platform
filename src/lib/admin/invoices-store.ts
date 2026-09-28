/**
 * Invoice store facade — memory adapter by default (demo amounts).
 * See db/migrations/0001_ops_foundation.sql + src/lib/db/.
 */

import "server-only";

import { getRepos } from "@/lib/db/adapter";
import type {
  InvoiceLine,
  InvoiceRecord,
  InvoiceStatus,
} from "@/lib/db/types";

export type { InvoiceLine, InvoiceRecord, InvoiceStatus };

export function invoiceSubtotalCents(inv: InvoiceRecord): number {
  return getRepos().invoices.subtotalCents(inv);
}

export async function listInvoices(): Promise<InvoiceRecord[]> {
  return getRepos().invoices.list();
}

export async function getInvoice(
  id: string,
): Promise<InvoiceRecord | undefined> {
  return getRepos().invoices.get(id);
}

export async function createInvoiceFromQuote(
  quoteId: string,
): Promise<InvoiceRecord | null> {
  return getRepos().invoices.createFromQuote(quoteId);
}

export async function updateInvoiceStatus(
  id: string,
  status: InvoiceStatus,
): Promise<InvoiceRecord | undefined> {
  return getRepos().invoices.updateStatus(id, status);
}

export async function invoiceStats(paidByInvoiceId?: Map<string, number>) {
  return getRepos().invoices.stats(paidByInvoiceId);
}
