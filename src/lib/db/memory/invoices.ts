/**
 * In-memory InvoicesRepo — demo amounts, clearly labeled.
 */

import { memoryQuotesRepo } from "@/lib/db/memory/quotes";
import type { InvoicesRepo } from "@/lib/db/repos/types";
import type { InvoiceRecord, InvoiceStatus } from "@/lib/db/types";
import {
  isInvoiceEditable,
  invoiceLinesTotalCents,
} from "@/lib/invoices/lines";
import { generatePayToken } from "@/lib/pay/token";

/**
 * Seed-only pay tokens for the memory adapter's demo invoices. Never used by
 * the Postgres adapter; /pay/kf_pay_demo_* 404s in production.
 */
export const MEMORY_DEMO_PAY_TOKENS = {
  inv_seed_1: "kf_pay_demo_1001_alicia",
  inv_seed_2: "kf_pay_demo_1002_chris",
  inv_seed_3: "kf_pay_demo_1003_sam",
} as const;

declare global {
  // eslint-disable-next-line no-var
  var __kabaInvoices: InvoiceRecord[] | undefined;
  // eslint-disable-next-line no-var
  var __kabaInvoiceSeq: number | undefined;
}

function store(): InvoiceRecord[] {
  if (!globalThis.__kabaInvoices) {
    globalThis.__kabaInvoices = seedInvoicesSync();
    globalThis.__kabaInvoiceSeq = 1004;
  }
  return globalThis.__kabaInvoices;
}

function nextNumber(): string {
  store(); // seed first so new numbers never collide with KF-1001…1003
  const n = (globalThis.__kabaInvoiceSeq ?? 1000) + 1;
  globalThis.__kabaInvoiceSeq = n;
  return `KF-${n}`;
}

function seedInvoicesSync(): InvoiceRecord[] {
  const now = Date.now();
  return [
    {
      id: "inv_seed_1",
      number: "KF-1001",
      createdAt: new Date(now - 1000 * 60 * 60 * 80).toISOString(),
      updatedAt: new Date(now - 1000 * 60 * 60 * 72).toISOString(),
      quoteId: "q_seed_4",
      customerId: null,
      customerName: "Alicia Brooks",
      customerEmail: "alicia.b@example.com",
      customerPhone: "(919) 555-0199",
      address: "Cary, NC",
      status: "partial",
      lines: [
        {
          id: "l1",
          description: "Aluminum pool fence — materials & labor (~90 ft)",
          quantity: 1,
          unitCents: 840000,
        },
        {
          id: "l2",
          description: "Gate hardware upgrade",
          quantity: 1,
          unitCents: 18500,
        },
      ],
      notes: "Demo invoice. 50% deposit recorded.",
      demo: true,
      payToken: MEMORY_DEMO_PAY_TOKENS.inv_seed_1,
      payLinkNotifiedAt: null,
    },
    {
      id: "inv_seed_2",
      number: "KF-1002",
      createdAt: new Date(now - 1000 * 60 * 60 * 48).toISOString(),
      updatedAt: new Date(now - 1000 * 60 * 60 * 48).toISOString(),
      quoteId: "q_seed_3",
      customerId: null,
      customerName: "Chris Nguyen",
      customerEmail: "chris.n@example.com",
      customerPhone: "(919) 555-0172",
      address: "Fuquay-Varina, NC",
      status: "draft",
      lines: [
        {
          id: "l1",
          description: "White vinyl privacy fence — estimate (demo)",
          quantity: 1,
          unitCents: 620000,
        },
      ],
      notes: "Draft from scheduled quote — not sent.",
      demo: true,
      payToken: MEMORY_DEMO_PAY_TOKENS.inv_seed_2,
      payLinkNotifiedAt: null,
    },
    {
      id: "inv_seed_3",
      number: "KF-1003",
      createdAt: new Date(now - 1000 * 60 * 60 * 200).toISOString(),
      updatedAt: new Date(now - 1000 * 60 * 60 * 160).toISOString(),
      quoteId: null,
      customerId: null,
      customerName: "Sam Ortega",
      customerEmail: "sam.o@example.com",
      customerPhone: "(919) 555-0144",
      address: "Holly Springs, NC",
      status: "paid",
      lines: [
        {
          id: "l1",
          description: "Deck board replacement (demo)",
          quantity: 1,
          unitCents: 245000,
        },
      ],
      notes: "Paid in full — demo seed.",
      demo: true,
      payToken: MEMORY_DEMO_PAY_TOKENS.inv_seed_3,
      payLinkNotifiedAt: null,
    },
  ];
}

export const memoryInvoicesRepo: InvoicesRepo = {
  subtotalCents(inv) {
    return invoiceLinesTotalCents(inv.lines);
  },

  async list() {
    return [...store()].sort(
      (a, b) => +new Date(b.createdAt) - +new Date(a.createdAt),
    );
  },

  async get(id) {
    return store().find((i) => i.id === id);
  },

  async getByPayToken(token) {
    const t = token.trim();
    if (!t) return undefined;
    return store().find((i) => i.payToken === t);
  },

  async createFromQuote(quoteId) {
    const quote = await memoryQuotesRepo.get(quoteId);
    if (!quote) return null;

    const now = new Date().toISOString();
    const record: InvoiceRecord = {
      id: `inv_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`,
      number: nextNumber(),
      createdAt: now,
      updatedAt: now,
      quoteId: quote.id,
      customerId: quote.customerId,
      customerName: quote.name,
      customerEmail: quote.email,
      customerPhone: quote.phone,
      address: quote.address,
      status: "draft",
      lines: [
        {
          id: `l_${Date.now().toString(36)}`,
          description: quote.serviceType?.trim() || "Servicio",
          quantity: 1,
          unitCents: 0,
        },
      ],
      notes: "",
      demo: false,
      payToken: generatePayToken(),
      payLinkNotifiedAt: null,
    };
    store().unshift(record);
    return record;
  },

  async replaceLines(id, lines) {
    const inv = store().find((i) => i.id === id);
    if (!inv) return { ok: false, reason: "not_found" };
    if (!isInvoiceEditable(inv.status)) return { ok: false, reason: "locked" };
    const stamp = Date.now().toString(36);
    inv.lines = lines.map((l, i) => ({
      id: `l_${stamp}_${i}`,
      description: l.description,
      quantity: l.quantity,
      unitCents: l.unitCents,
    }));
    inv.updatedAt = new Date().toISOString();
    return { ok: true, invoice: inv };
  },

  async updateStatus(id, status: InvoiceStatus) {
    const inv = store().find((i) => i.id === id);
    if (!inv) return undefined;
    inv.status = status;
    inv.updatedAt = new Date().toISOString();
    return inv;
  },

  async markPayLinkNotified(id, at) {
    const inv = store().find((i) => i.id === id);
    if (!inv) return undefined;
    inv.payLinkNotifiedAt =
      at === undefined ? new Date().toISOString() : at;
    inv.updatedAt = new Date().toISOString();
    return inv;
  },

  async stats(paidByInvoiceId) {
    const all = await memoryInvoicesRepo.list();
    const open = all.filter((i) =>
      ["draft", "sent", "partial"].includes(i.status),
    );
    const totalOpenCents = open.reduce((s, i) => {
      const paid = paidByInvoiceId?.get(i.id) ?? 0;
      return s + Math.max(0, memoryInvoicesRepo.subtotalCents(i) - paid);
    }, 0);
    return {
      total: all.length,
      draft: all.filter((i) => i.status === "draft").length,
      open: open.length,
      paid: all.filter((i) => i.status === "paid").length,
      totalOpenCents,
    };
  },
};
