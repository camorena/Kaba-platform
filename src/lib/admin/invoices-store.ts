/**
 * Invoice store facade — memory adapter by default (demo amounts).
 * See db/migrations/0001_ops_foundation.sql + src/lib/db/.
 */

import { memoryInvoicesRepo } from "@/lib/db/memory/invoices";
import type {
  InvoiceLine,
  InvoiceRecord,
  InvoiceStatus,
} from "@/lib/db/types";

export type { InvoiceLine, InvoiceRecord, InvoiceStatus };

export function invoiceSubtotalCents(inv: InvoiceRecord): number {
  return memoryInvoicesRepo.subtotalCents(inv);
}

export function listInvoices(): InvoiceRecord[] {
  return memoryInvoicesRepo.list();
}

export function getInvoice(id: string): InvoiceRecord | undefined {
  return memoryInvoicesRepo.get(id);
}

export function createInvoiceFromQuote(quoteId: string): InvoiceRecord | null {
  return memoryInvoicesRepo.createFromQuote(quoteId);
}

export function updateInvoiceStatus(
  id: string,
  status: InvoiceStatus,
): InvoiceRecord | undefined {
  return memoryInvoicesRepo.updateStatus(id, status);
}

export function invoiceStats(paidByInvoiceId?: Map<string, number>) {
  return memoryInvoicesRepo.stats(paidByInvoiceId);
}
