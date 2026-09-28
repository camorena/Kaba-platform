/**
 * Payment store facade — stub ledger, no Stripe.
 * See db/migrations/0001_ops_foundation.sql + src/lib/db/.
 */

import "server-only";

import { getRepos } from "@/lib/db/adapter";
import type { PaymentMethod, PaymentRecord } from "@/lib/db/types";

export type { PaymentRecord };

export async function listPayments(): Promise<PaymentRecord[]> {
  return getRepos().payments.list();
}

export async function listPaymentsForInvoice(
  invoiceId: string,
): Promise<PaymentRecord[]> {
  return getRepos().payments.listForInvoice(invoiceId);
}

export async function paidCentsForInvoice(
  invoiceId: string,
): Promise<number> {
  return getRepos().payments.paidCentsForInvoice(invoiceId);
}

export async function paidCentsMap(): Promise<Map<string, number>> {
  return getRepos().payments.paidCentsMap();
}

export async function getPayment(
  id: string,
): Promise<PaymentRecord | undefined> {
  return getRepos().payments.get(id);
}

export async function recordPayment(input: {
  invoiceId: string;
  amountCents: number;
  method: PaymentMethod;
  reference?: string;
  notes?: string;
}): Promise<PaymentRecord | null> {
  return getRepos().payments.record(input);
}

export async function paymentStats() {
  return getRepos().payments.stats();
}
