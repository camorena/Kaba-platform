/**
 * In-memory + optional file-backed quote store for the admin scaffold.
 * Replace with a real DB (Postgres/SQLite) before production.
 *
 * Persistence: when process is long-lived (dev / single Node server), the
 * module singleton keeps quotes. On serverless (Vercel), each invocation may
 * start cold — the API also accepts POSTs from the public form and returns
 * whatever the current instance has. Seed data keeps the UI usable.
 */

import type { QuoteStatus } from "@/lib/admin/status";

export type { QuoteStatus };

export type QuoteRecord = {
  id: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  phone: string;
  email: string;
  serviceType: string;
  address: string;
  description: string;
  preferredContact: string;
  source: string;
  status: QuoteStatus;
  /** Internal staff notes (not shown to customer). */
  notes: string;
};

const seed: QuoteRecord[] = [
  {
    id: "q_seed_1",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(),
    name: "Jordan Miles",
    phone: "(919) 555-0188",
    email: "jordan.miles@example.com",
    serviceType: "Wood Fence",
    address: "Angier, NC",
    description: "Replace leaning backyard privacy fence (~120 ft) with cedar.",
    preferredContact: "phone",
    source: "seed",
    status: "new",
    notes: "",
  },
  {
    id: "q_seed_2",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 50).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 40).toISOString(),
    name: "Priya Shah",
    phone: "(919) 555-0133",
    email: "priya.shah@example.com",
    serviceType: "Deck Repair",
    address: "Raleigh, NC",
    description: "Loose railing and two soft boards near stairs.",
    preferredContact: "email",
    source: "seed",
    status: "contacted",
    notes: "Left voicemail 9/25. Prefers Saturday morning.",
  },
  {
    id: "q_seed_3",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 90).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 70).toISOString(),
    name: "Chris Nguyen",
    phone: "(919) 555-0172",
    email: "chris.n@example.com",
    serviceType: "Vinyl Fence",
    address: "Fuquay-Varina, NC",
    description: "New white vinyl privacy fence for HOA lot.",
    preferredContact: "text",
    source: "seed",
    status: "scheduled",
    notes: "Site visit Tue 10am. HOA guidelines attached in email.",
  },
  {
    id: "q_seed_4",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 140).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 100).toISOString(),
    name: "Alicia Brooks",
    phone: "(919) 555-0199",
    email: "alicia.b@example.com",
    serviceType: "Aluminum Fence",
    address: "Cary, NC",
    description: "Pool-code aluminum fence, ~90 ft, black.",
    preferredContact: "phone",
    source: "seed",
    status: "won",
    notes: "Approved $8,400. Ready to invoice deposit.",
  },
];

declare global {
  // eslint-disable-next-line no-var
  var __kabaQuotes: QuoteRecord[] | undefined;
}

function store(): QuoteRecord[] {
  if (!globalThis.__kabaQuotes) {
    globalThis.__kabaQuotes = [...seed];
  }
  return globalThis.__kabaQuotes;
}

export function listQuotes(): QuoteRecord[] {
  return [...store()].sort(
    (a, b) => +new Date(b.createdAt) - +new Date(a.createdAt),
  );
}

export function getQuote(id: string): QuoteRecord | undefined {
  return store().find((q) => q.id === id);
}

export function addQuote(
  input: Omit<QuoteRecord, "id" | "createdAt" | "updatedAt" | "status" | "notes"> & {
    status?: QuoteStatus;
    notes?: string;
  },
): QuoteRecord {
  const now = new Date().toISOString();
  const record: QuoteRecord = {
    id: `q_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`,
    createdAt: now,
    updatedAt: now,
    status: input.status ?? "new",
    notes: input.notes ?? "",
    name: input.name,
    phone: input.phone,
    email: input.email,
    serviceType: input.serviceType,
    address: input.address,
    description: input.description,
    preferredContact: input.preferredContact,
    source: input.source,
  };
  store().unshift(record);
  return record;
}

export function updateQuote(
  id: string,
  patch: Partial<Pick<QuoteRecord, "status" | "notes">>,
): QuoteRecord | undefined {
  const q = store().find((item) => item.id === id);
  if (!q) return undefined;
  if (patch.status !== undefined) q.status = patch.status;
  if (patch.notes !== undefined) q.notes = patch.notes;
  q.updatedAt = new Date().toISOString();
  return q;
}

/** @deprecated prefer updateQuote */
export function updateQuoteStatus(
  id: string,
  status: QuoteStatus,
): QuoteRecord | undefined {
  return updateQuote(id, { status });
}

export function quoteStats() {
  const all = listQuotes();
  return {
    total: all.length,
    new: all.filter((q) => q.status === "new").length,
    contacted: all.filter((q) => q.status === "contacted").length,
    scheduled: all.filter((q) => q.status === "scheduled").length,
    won: all.filter((q) => q.status === "won").length,
    lost: all.filter((q) => q.status === "lost").length,
  };
}

/** Unique customers derived from quote contact fields. */
export function listCustomers() {
  const map = new Map<
    string,
    {
      key: string;
      name: string;
      email: string;
      phone: string;
      quoteCount: number;
      latestQuoteAt: string;
      addresses: string[];
      statuses: QuoteStatus[];
    }
  >();

  for (const q of listQuotes()) {
    const key = q.email.toLowerCase().trim() || q.phone.trim();
    const existing = map.get(key);
    if (!existing) {
      map.set(key, {
        key,
        name: q.name,
        email: q.email,
        phone: q.phone,
        quoteCount: 1,
        latestQuoteAt: q.createdAt,
        addresses: [q.address],
        statuses: [q.status],
      });
    } else {
      existing.quoteCount += 1;
      if (+new Date(q.createdAt) > +new Date(existing.latestQuoteAt)) {
        existing.latestQuoteAt = q.createdAt;
        existing.name = q.name;
      }
      if (!existing.addresses.includes(q.address)) {
        existing.addresses.push(q.address);
      }
      existing.statuses.push(q.status);
    }
  }

  return [...map.values()].sort(
    (a, b) => +new Date(b.latestQuoteAt) - +new Date(a.latestQuoteAt),
  );
}
