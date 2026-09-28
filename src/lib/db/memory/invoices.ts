/**
 * In-memory InvoicesRepo — demo amounts, clearly labeled.
 */

import { demoUnitCentsForService } from "@/lib/db/demo-amounts";
import { memoryQuotesRepo } from "@/lib/db/memory/quotes";
import type { InvoicesRepo } from "@/lib/db/repos/types";
import type { InvoiceRecord, InvoiceStatus } from "@/lib/db/types";
import { DEMO_PAY_TOKENS, generatePayToken } from "@/lib/pay/token";

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
      payToken: DEMO_PAY_TOKENS.inv_seed_1,
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
      payToken: DEMO_PAY_TOKENS.inv_seed_2,
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
      payToken: DEMO_PAY_TOKENS.inv_seed_3,
    },
  ];
}

export const memoryInvoicesRepo: InvoicesRepo = {
  subtotalCents(inv) {
    return inv.lines.reduce((sum, l) => sum + l.quantity * l.unitCents, 0);
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

    const unit = demoUnitCentsForService(quote.serviceType);
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
          description: `${quote.serviceType} — demo estimate from quote`,
          quantity: 1,
          unitCents: unit,
        },
      ],
      notes: `Created from quote ${quote.id}. Synthetic demo amount — not a real bid.`,
      demo: true,
      payToken: generatePayToken(),
    };
    store().unshift(record);
    return record;
  },

  async updateStatus(id, status: InvoiceStatus) {
    const inv = store().find((i) => i.id === id);
    if (!inv) return undefined;
    inv.status = status;
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
