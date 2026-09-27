/**
 * In-memory payment records linked to invoices.
 * No Stripe / ACH — stub recording only. Documented on Settings.
 */

import type { PaymentMethod, PaymentStatus } from "@/lib/admin/status";
import {
  getInvoice,
  invoiceSubtotalCents,
  updateInvoiceStatus,
} from "@/lib/admin/invoices-store";

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
  /** All seed/stub payments are demo. */
  demo: boolean;
};

declare global {
  // eslint-disable-next-line no-var
  var __kabaPayments: PaymentRecord[] | undefined;
}

function store(): PaymentRecord[] {
  if (!globalThis.__kabaPayments) {
    globalThis.__kabaPayments = seedPayments();
  }
  return globalThis.__kabaPayments;
}

function seedPayments(): PaymentRecord[] {
  const now = Date.now();
  return [
    {
      id: "pay_seed_1",
      createdAt: new Date(now - 1000 * 60 * 60 * 70).toISOString(),
      invoiceId: "inv_seed_1",
      invoiceNumber: "KF-1001",
      customerName: "Alicia Brooks",
      amountCents: 429250,
      method: "check",
      status: "recorded",
      reference: "CHK-44821",
      notes: "50% deposit — demo",
      demo: true,
    },
    {
      id: "pay_seed_2",
      createdAt: new Date(now - 1000 * 60 * 60 * 155).toISOString(),
      invoiceId: "inv_seed_3",
      invoiceNumber: "KF-1003",
      customerName: "Sam Ortega",
      amountCents: 245000,
      method: "ach",
      status: "recorded",
      reference: "ACH-demo-991",
      notes: "Paid in full — demo",
      demo: true,
    },
  ];
}

export function listPayments(): PaymentRecord[] {
  return [...store()].sort(
    (a, b) => +new Date(b.createdAt) - +new Date(a.createdAt),
  );
}

export function listPaymentsForInvoice(invoiceId: string): PaymentRecord[] {
  return listPayments().filter((p) => p.invoiceId === invoiceId);
}

export function paidCentsForInvoice(invoiceId: string): number {
  return listPaymentsForInvoice(invoiceId)
    .filter((p) => p.status === "recorded")
    .reduce((sum, p) => sum + p.amountCents, 0);
}

export function paidCentsMap(): Map<string, number> {
  const map = new Map<string, number>();
  for (const p of listPayments()) {
    if (p.status !== "recorded") continue;
    map.set(p.invoiceId, (map.get(p.invoiceId) ?? 0) + p.amountCents);
  }
  return map;
}

export function getPayment(id: string): PaymentRecord | undefined {
  return store().find((p) => p.id === id);
}

export function recordPayment(input: {
  invoiceId: string;
  amountCents: number;
  method: PaymentMethod;
  reference?: string;
  notes?: string;
}): PaymentRecord | null {
  const inv = getInvoice(input.invoiceId);
  if (!inv) return null;
  if (input.amountCents <= 0) return null;

  const record: PaymentRecord = {
    id: `pay_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`,
    createdAt: new Date().toISOString(),
    invoiceId: inv.id,
    invoiceNumber: inv.number,
    customerName: inv.customerName,
    amountCents: input.amountCents,
    method: input.method,
    status: "recorded",
    reference: (input.reference ?? "").trim(),
    notes: (input.notes ?? "").trim(),
    demo: true,
  };
  store().unshift(record);

  const paid = paidCentsForInvoice(inv.id);
  const total = invoiceSubtotalCents(inv);
  if (paid >= total && total > 0) {
    updateInvoiceStatus(inv.id, "paid");
  } else if (paid > 0 && inv.status !== "void") {
    updateInvoiceStatus(inv.id, "partial");
  }

  return record;
}

export function paymentStats() {
  const all = listPayments();
  const recorded = all.filter((p) => p.status === "recorded");
  return {
    total: all.length,
    recordedCents: recorded.reduce((s, p) => s + p.amountCents, 0),
  };
}
