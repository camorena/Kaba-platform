/**
 * Payment store facade — stub ledger, no Stripe.
 * See db/migrations/0001_ops_foundation.sql + src/lib/db/.
 */

import { memoryPaymentsRepo } from "@/lib/db/memory/payments";
import type { PaymentMethod, PaymentRecord } from "@/lib/db/types";

export type { PaymentRecord };

export function listPayments(): PaymentRecord[] {
  return memoryPaymentsRepo.list();
}

export function listPaymentsForInvoice(invoiceId: string): PaymentRecord[] {
  return memoryPaymentsRepo.listForInvoice(invoiceId);
}

export function paidCentsForInvoice(invoiceId: string): number {
  return memoryPaymentsRepo.paidCentsForInvoice(invoiceId);
}

export function paidCentsMap(): Map<string, number> {
  return memoryPaymentsRepo.paidCentsMap();
}

export function getPayment(id: string): PaymentRecord | undefined {
  return memoryPaymentsRepo.get(id);
}

export function recordPayment(input: {
  invoiceId: string;
  amountCents: number;
  method: PaymentMethod;
  reference?: string;
  notes?: string;
}): PaymentRecord | null {
  return memoryPaymentsRepo.record(input);
}

export function paymentStats() {
  return memoryPaymentsRepo.stats();
}
