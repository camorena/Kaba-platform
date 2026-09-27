/**
 * In-memory invoice store (demo data). Synthetic amounts — clearly labeled.
 * No Stripe. Replace with DB + payment provider before production.
 */

import type { InvoiceStatus } from "@/lib/admin/status";
import { getQuote, listQuotes } from "@/lib/admin/quotes-store";

export type { InvoiceStatus };

export type InvoiceLine = {
  id: string;
  description: string;
  quantity: number;
  /** Unit price in cents */
  unitCents: number;
};

export type InvoiceRecord = {
  id: string;
  number: string;
  createdAt: string;
  updatedAt: string;
  quoteId: string | null;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  address: string;
  status: InvoiceStatus;
  lines: InvoiceLine[];
  notes: string;
  /** Demo flag — all seed/stub invoices are synthetic. */
  demo: boolean;
};

declare global {
  // eslint-disable-next-line no-var
  var __kabaInvoices: InvoiceRecord[] | undefined;
  // eslint-disable-next-line no-var
  var __kabaInvoiceSeq: number | undefined;
}

function store(): InvoiceRecord[] {
  if (!globalThis.__kabaInvoices) {
    globalThis.__kabaInvoices = seedInvoices();
    globalThis.__kabaInvoiceSeq = 1004;
  }
  return globalThis.__kabaInvoices;
}

function nextNumber(): string {
  const n = (globalThis.__kabaInvoiceSeq ?? 1000) + 1;
  globalThis.__kabaInvoiceSeq = n;
  return `KF-${n}`;
}

function seedInvoices(): InvoiceRecord[] {
  const won = listQuotes().find((q) => q.id === "q_seed_4");
  const scheduled = listQuotes().find((q) => q.id === "q_seed_3");
  const now = Date.now();
  return [
    {
      id: "inv_seed_1",
      number: "KF-1001",
      createdAt: new Date(now - 1000 * 60 * 60 * 80).toISOString(),
      updatedAt: new Date(now - 1000 * 60 * 60 * 72).toISOString(),
      quoteId: won?.id ?? null,
      customerName: won?.name ?? "Alicia Brooks",
      customerEmail: won?.email ?? "alicia.b@example.com",
      customerPhone: won?.phone ?? "(919) 555-0199",
      address: won?.address ?? "Cary, NC",
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
    },
    {
      id: "inv_seed_2",
      number: "KF-1002",
      createdAt: new Date(now - 1000 * 60 * 60 * 48).toISOString(),
      updatedAt: new Date(now - 1000 * 60 * 60 * 48).toISOString(),
      quoteId: scheduled?.id ?? null,
      customerName: scheduled?.name ?? "Chris Nguyen",
      customerEmail: scheduled?.email ?? "chris.n@example.com",
      customerPhone: scheduled?.phone ?? "(919) 555-0172",
      address: scheduled?.address ?? "Fuquay-Varina, NC",
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
    },
    {
      id: "inv_seed_3",
      number: "KF-1003",
      createdAt: new Date(now - 1000 * 60 * 60 * 200).toISOString(),
      updatedAt: new Date(now - 1000 * 60 * 60 * 160).toISOString(),
      quoteId: null,
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
    },
  ];
}

export function invoiceSubtotalCents(inv: InvoiceRecord): number {
  return inv.lines.reduce((sum, l) => sum + l.quantity * l.unitCents, 0);
}

export function listInvoices(): InvoiceRecord[] {
  return [...store()].sort(
    (a, b) => +new Date(b.createdAt) - +new Date(a.createdAt),
  );
}

export function getInvoice(id: string): InvoiceRecord | undefined {
  return store().find((i) => i.id === id);
}

export function createInvoiceFromQuote(quoteId: string): InvoiceRecord | null {
  const quote = getQuote(quoteId);
  if (!quote) return null;

  // Synthetic demo amount based on service type — clearly demo.
  const demoAmounts: Record<string, number> = {
    "Wood Fence": 485000,
    "Vinyl Fence": 620000,
    "Aluminum Fence": 840000,
    "Deck Repair": 245000,
    "Deck Install": 920000,
  };
  const unit =
    demoAmounts[quote.serviceType] ??
    350000 + (quote.serviceType.length % 7) * 25000;

  const now = new Date().toISOString();
  const record: InvoiceRecord = {
    id: `inv_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`,
    number: nextNumber(),
    createdAt: now,
    updatedAt: now,
    quoteId: quote.id,
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
  };
  store().unshift(record);
  return record;
}

export function updateInvoiceStatus(
  id: string,
  status: InvoiceStatus,
): InvoiceRecord | undefined {
  const inv = store().find((i) => i.id === id);
  if (!inv) return undefined;
  inv.status = status;
  inv.updatedAt = new Date().toISOString();
  return inv;
}

export function invoiceStats(paidByInvoiceId?: Map<string, number>) {
  const all = listInvoices();
  const open = all.filter((i) =>
    ["draft", "sent", "partial"].includes(i.status),
  );
  const totalOpenCents = open.reduce((s, i) => {
    const paid = paidByInvoiceId?.get(i.id) ?? 0;
    return s + Math.max(0, invoiceSubtotalCents(i) - paid);
  }, 0);
  return {
    total: all.length,
    draft: all.filter((i) => i.status === "draft").length,
    open: open.length,
    paid: all.filter((i) => i.status === "paid").length,
    totalOpenCents,
  };
}
