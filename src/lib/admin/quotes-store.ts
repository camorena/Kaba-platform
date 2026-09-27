/**
 * In-memory + optional file-backed quote store for the admin scaffold.
 * Replace with a real DB (Postgres/SQLite) before production.
 *
 * Persistence: when process is long-lived (dev / single Node server), the
 * module singleton keeps quotes. On serverless (Vercel), each invocation may
 * start cold — the API also accepts POSTs from the public form and returns
 * whatever the current instance has. Seed data keeps the UI usable.
 */

export type QuoteStatus = "new" | "contacted" | "scheduled" | "won" | "lost";

export type QuoteRecord = {
  id: string;
  createdAt: string;
  name: string;
  phone: string;
  email: string;
  serviceType: string;
  address: string;
  description: string;
  preferredContact: string;
  source: string;
  status: QuoteStatus;
};

const seed: QuoteRecord[] = [
  {
    id: "q_seed_1",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(),
    name: "Jordan Miles",
    phone: "(919) 555-0188",
    email: "jordan.miles@example.com",
    serviceType: "Wood Fence",
    address: "Angier, NC",
    description: "Replace leaning backyard privacy fence (~120 ft) with cedar.",
    preferredContact: "phone",
    source: "seed",
    status: "new",
  },
  {
    id: "q_seed_2",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 50).toISOString(),
    name: "Priya Shah",
    phone: "(919) 555-0133",
    email: "priya.shah@example.com",
    serviceType: "Deck Repair",
    address: "Raleigh, NC",
    description: "Loose railing and two soft boards near stairs.",
    preferredContact: "email",
    source: "seed",
    status: "contacted",
  },
  {
    id: "q_seed_3",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 90).toISOString(),
    name: "Chris Nguyen",
    phone: "(919) 555-0172",
    email: "chris.n@example.com",
    serviceType: "Vinyl Fence",
    address: "Fuquay-Varina, NC",
    description: "New white vinyl privacy fence for HOA lot.",
    preferredContact: "text",
    source: "seed",
    status: "scheduled",
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
  input: Omit<QuoteRecord, "id" | "createdAt" | "status"> & {
    status?: QuoteStatus;
  },
): QuoteRecord {
  const record: QuoteRecord = {
    id: `q_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`,
    createdAt: new Date().toISOString(),
    status: input.status ?? "new",
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

export function updateQuoteStatus(
  id: string,
  status: QuoteStatus,
): QuoteRecord | undefined {
  const q = store().find((item) => item.id === id);
  if (!q) return undefined;
  q.status = status;
  return q;
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
