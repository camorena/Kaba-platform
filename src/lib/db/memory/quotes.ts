/**
 * In-memory QuotesRepo — default adapter (no cloud credentials required).
 */

import type { QuotesRepo } from "@/lib/db/repos/types";
import type {
  NewQuoteInput,
  QuoteNoteRecord,
  QuotePatch,
  QuoteRecord,
  QuoteStatus,
} from "@/lib/db/types";

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
    notifiedAt: null,
    notifyAttempts: 0,
    customerId: null,
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
    notifiedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 8).toISOString(),
    notifyAttempts: 1,
    customerId: null,
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
    notifiedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    notifyAttempts: 1,
    customerId: null,
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
    notifiedAt: new Date(Date.now() - 1000 * 60 * 60 * 140).toISOString(),
    notifyAttempts: 1,
    customerId: null,
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
    notifiedAt: null,
    notifyAttempts: 0,
    customerId: null,
  },
];

declare global {
  // eslint-disable-next-line no-var
  var __kabaQuotes: QuoteRecord[] | undefined;
  // eslint-disable-next-line no-var
  var __kabaQuoteNotes: QuoteNoteRecord[] | undefined;
}

function store(): QuoteRecord[] {
  if (!globalThis.__kabaQuotes) {
    globalThis.__kabaQuotes = seed.map((q) => ({ ...q }));
  }
  return globalThis.__kabaQuotes;
}

function notesStore(): QuoteNoteRecord[] {
  if (!globalThis.__kabaQuoteNotes) {
    globalThis.__kabaQuoteNotes = [
      {
        id: "qn_seed_1",
        quoteId: "q_seed_2",
        authorId: null,
        authorLabel: "ops",
        body: "Left voicemail. Prefers Saturday morning. No reply since.",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 6).toISOString(),
      },
      {
        id: "qn_seed_2",
        quoteId: "q_seed_3",
        authorId: null,
        authorLabel: "ops",
        body: "Site visit Tue 10am. HOA guidelines attached in email.",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 20).toISOString(),
      },
    ];
  }
  return globalThis.__kabaQuoteNotes;
}

export const QUIET_QUOTE_STATUSES: readonly QuoteStatus[] = [
  "new",
  "contacted",
  "scheduled",
];

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

export const memoryQuotesRepo: QuotesRepo = {
  list() {
    return [...store()].sort(
      (a, b) => +new Date(b.createdAt) - +new Date(a.createdAt),
    );
  },

  get(id) {
    return store().find((q) => q.id === id);
  },

  add(input: NewQuoteInput) {
    const now = new Date().toISOString();
    const record: QuoteRecord = {
      id: `q_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`,
      createdAt: now,
      updatedAt: now,
      status: input.status ?? "new",
      notes: input.notes ?? "",
      notifiedAt: null,
      notifyAttempts: 0,
      customerId: input.customerId ?? null,
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
  },

  update(id, patch: QuotePatch) {
    const q = store().find((item) => item.id === id);
    if (!q) return undefined;
    if (patch.status !== undefined) q.status = patch.status;
    if (patch.notes !== undefined) q.notes = patch.notes;
    if (patch.notifiedAt !== undefined) q.notifiedAt = patch.notifiedAt;
    if (patch.notifyAttempts !== undefined) {
      q.notifyAttempts = patch.notifyAttempts;
    }
    q.updatedAt = new Date().toISOString();
    return q;
  },

  bulkUpdateStatus(ids, status) {
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
  },

  stats() {
    const all = memoryQuotesRepo.list();
    return {
      total: all.length,
      new: all.filter((q) => q.status === "new").length,
      contacted: all.filter((q) => q.status === "contacted").length,
      scheduled: all.filter((q) => q.status === "scheduled").length,
      won: all.filter((q) => q.status === "won").length,
      lost: all.filter((q) => q.status === "lost").length,
    };
  },

  listQuiet(thresholdDays = QUIET_DAYS_THRESHOLD) {
    const now = Date.now();
    return memoryQuotesRepo
      .list()
      .filter((q) => isQuietQuote(q, thresholdDays, now))
      .sort((a, b) => +new Date(a.updatedAt) - +new Date(b.updatedAt));
  },

  quietCount(thresholdDays = QUIET_DAYS_THRESHOLD) {
    return memoryQuotesRepo.listQuiet(thresholdDays).length;
  },

  listNotes(quoteId) {
    return notesStore()
      .filter((n) => n.quoteId === quoteId)
      .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
  },

  addNote(quoteId, body, author) {
    const quote = store().find((q) => q.id === quoteId);
    if (!quote) return null;
    const trimmed = body.trim();
    if (!trimmed) return null;
    const note: QuoteNoteRecord = {
      id: `qn_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`,
      quoteId,
      authorId: author?.id ?? null,
      authorLabel: author?.label ?? "ops",
      body: trimmed,
      createdAt: new Date().toISOString(),
    };
    notesStore().unshift(note);
    quote.updatedAt = note.createdAt;
    return note;
  },
};
