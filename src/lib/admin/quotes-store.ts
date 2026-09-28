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
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
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
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 8).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 6).toISOString(),
    name: "Priya Shah",
    phone: "(919) 555-0133",
    email: "priya.shah@example.com",
    serviceType: "Deck Repair",
    address: "Raleigh, NC",
    description: "Loose railing and two soft boards near stairs.",
    preferredContact: "email",
    source: "seed",
    status: "contacted",
    notes: "Left voicemail. Prefers Saturday morning. No reply since.",
  },
  {
    id: "q_seed_3",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 20).toISOString(),
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
  {
    id: "q_seed_5",
    createdAt: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
    name: "Marcus Webb",
    phone: "(919) 555-0144",
    email: "marcus.webb@example.com",
    serviceType: "Chain Link",
    address: "Garner, NC",
    description: "Replace damaged chain-link along driveway (~60 ft).",
    preferredContact: "phone",
    source: "seed",
    status: "new",
    notes: "",
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

export function bulkUpdateQuoteStatus(
  ids: string[],
  status: QuoteStatus,
): { updated: number; missing: string[] } {
  const missing: string[] = [];
  let updated = 0;
  const now = new Date().toISOString();
  for (const id of ids) {
    const q = store().find((item) => item.id === id);
    if (!q) {
      missing.push(id);
      continue;
    }
    q.status = status;
    q.updatedAt = now;
    updated += 1;
  }
  return { updated, missing };
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

/** Open pipeline statuses that can "go quiet" (Estimate → Silence). */
export const QUIET_QUOTE_STATUSES: readonly QuoteStatus[] = [
  "new",
  "contacted",
  "scheduled",
];

/** Days without status/notes movement before a quote is "gone quiet". */
export const QUIET_DAYS_THRESHOLD = 3;

export function isQuietQuote(
  q: QuoteRecord,
  thresholdDays = QUIET_DAYS_THRESHOLD,
  now = Date.now(),
): boolean {
  if (!QUIET_QUOTE_STATUSES.includes(q.status)) return false;
  const ageMs = now - new Date(q.updatedAt).getTime();
  return ageMs >= thresholdDays * 86_400_000;
}

/** Quotes in new|contacted|scheduled with no movement for threshold days+. */
export function listQuietQuotes(
  thresholdDays = QUIET_DAYS_THRESHOLD,
): QuoteRecord[] {
  const now = Date.now();
  return listQuotes()
    .filter((q) => isQuietQuote(q, thresholdDays, now))
    .sort((a, b) => +new Date(a.updatedAt) - +new Date(b.updatedAt));
}

export function quietQuoteCount(thresholdDays = QUIET_DAYS_THRESHOLD): number {
  return listQuietQuotes(thresholdDays).length;
}
