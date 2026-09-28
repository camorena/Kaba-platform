/**
 * In-memory PaymentsRepo — stub ledger, no Stripe.
 */

import type { PaymentsRepo } from "@/lib/db/repos/types";
import type { PaymentRecord } from "@/lib/db/types";
import { memoryInvoicesRepo } from "@/lib/db/memory/invoices";

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

export const memoryPaymentsRepo: PaymentsRepo = {
  list() {
    return [...store()].sort(
      (a, b) => +new Date(b.createdAt) - +new Date(a.createdAt),
    );
  },

  listForInvoice(invoiceId) {
    return memoryPaymentsRepo.list().filter((p) => p.invoiceId === invoiceId);
  },

  get(id) {
    return store().find((p) => p.id === id);
  },

  paidCentsForInvoice(invoiceId) {
    return memoryPaymentsRepo
      .listForInvoice(invoiceId)
      .filter((p) => p.status === "recorded")
      .reduce((sum, p) => sum + p.amountCents, 0);
  },

  paidCentsMap() {
    const map = new Map<string, number>();
    for (const p of memoryPaymentsRepo.list()) {
      if (p.status !== "recorded") continue;
      map.set(p.invoiceId, (map.get(p.invoiceId) ?? 0) + p.amountCents);
    }
    return map;
  },

  record(input) {
    const inv = memoryInvoicesRepo.get(input.invoiceId);
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

    const paid = memoryPaymentsRepo.paidCentsForInvoice(inv.id);
    const total = memoryInvoicesRepo.subtotalCents(inv);
    if (paid >= total && total > 0) {
      memoryInvoicesRepo.updateStatus(inv.id, "paid");
    } else if (paid > 0 && inv.status !== "void") {
      memoryInvoicesRepo.updateStatus(inv.id, "partial");
    }

    return record;
  },

  stats() {
    const all = memoryPaymentsRepo.list();
    const recorded = all.filter((p) => p.status === "recorded");
    return {
      total: all.length,
      recordedCents: recorded.reduce((s, p) => s + p.amountCents, 0),
    };
  },
};
