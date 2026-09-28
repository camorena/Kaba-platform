/**
 * In-memory PaymentsRepo — stub ledger + Stripe webhook idempotency.
 */

import { memoryInvoicesRepo } from "@/lib/db/memory/invoices";
import type { PaymentsRepo } from "@/lib/db/repos/types";
import type { PaymentRecord } from "@/lib/db/types";

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
      stripeEventId: null,
      stripeCheckoutSessionId: null,
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
      stripeEventId: null,
      stripeCheckoutSessionId: null,
    },
  ];
}

async function syncInvoiceStatus(invoiceId: string): Promise<void> {
  const inv = await memoryInvoicesRepo.get(invoiceId);
  if (!inv) return;
  const paid = await memoryPaymentsRepo.paidCentsForInvoice(invoiceId);
  const total = memoryInvoicesRepo.subtotalCents(inv);
  if (paid >= total && total > 0) {
    await memoryInvoicesRepo.updateStatus(inv.id, "paid");
  } else if (paid > 0 && inv.status !== "void") {
    await memoryInvoicesRepo.updateStatus(inv.id, "partial");
  }
}

export const memoryPaymentsRepo: PaymentsRepo = {
  async list() {
    return [...store()].sort(
      (a, b) => +new Date(b.createdAt) - +new Date(a.createdAt),
    );
  },

  async listForInvoice(invoiceId) {
    return (await memoryPaymentsRepo.list()).filter(
      (p) => p.invoiceId === invoiceId,
    );
  },

  async get(id) {
    return store().find((p) => p.id === id);
  },

  async getByStripeEventId(eventId) {
    const id = eventId.trim();
    if (!id) return undefined;
    return store().find((p) => p.stripeEventId === id);
  },

  async getByStripeCheckoutSessionId(sessionId) {
    const id = sessionId.trim();
    if (!id) return undefined;
    return store().find((p) => p.stripeCheckoutSessionId === id);
  },

  async paidCentsForInvoice(invoiceId) {
    return (await memoryPaymentsRepo.listForInvoice(invoiceId))
      .filter((p) => p.status === "recorded")
      .reduce((sum, p) => sum + p.amountCents, 0);
  },

  async paidCentsMap() {
    const map = new Map<string, number>();
    for (const p of await memoryPaymentsRepo.list()) {
      if (p.status !== "recorded") continue;
      map.set(p.invoiceId, (map.get(p.invoiceId) ?? 0) + p.amountCents);
    }
    return map;
  },

  async record(input) {
    const inv = await memoryInvoicesRepo.get(input.invoiceId);
    if (!inv) return null;
    if (input.amountCents <= 0) return null;

    const stripeEventId = input.stripeEventId?.trim() || null;
    if (stripeEventId) {
      const existing = await memoryPaymentsRepo.getByStripeEventId(stripeEventId);
      if (existing) return existing;
    }

    const sessionId = input.stripeCheckoutSessionId?.trim() || null;
    if (sessionId) {
      const existingSession =
        await memoryPaymentsRepo.getByStripeCheckoutSessionId(sessionId);
      if (existingSession) return existingSession;
    }

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
      demo: input.demo ?? true,
      stripeEventId,
      stripeCheckoutSessionId: sessionId,
    };
    store().unshift(record);
    await syncInvoiceStatus(inv.id);
    return record;
  },

  async stats() {
    const all = await memoryPaymentsRepo.list();
    const recorded = all.filter((p) => p.status === "recorded");
    return {
      total: all.length,
      recordedCents: recorded.reduce((s, p) => s + p.amountCents, 0),
    };
  },
};
