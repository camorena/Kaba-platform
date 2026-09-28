/**
 * Quote store facade — delegates to the selected data adapter (memory default).
 * Set KABA_DATA_ADAPTER=postgres + DATABASE_URL for durable Postgres.
 */

import "server-only";

import { getRepos } from "@/lib/db/adapter";
import {
  isQuietQuote,
  QUIET_DAYS_THRESHOLD,
  QUIET_QUOTE_STATUSES,
} from "@/lib/db/quiet";
import type {
  NewQuoteInput,
  QuoteNoteRecord,
  QuotePatch,
  QuoteRecord,
  QuoteStatus,
} from "@/lib/db/types";

export type { QuoteRecord, QuoteStatus, QuoteNoteRecord };

export { QUIET_DAYS_THRESHOLD, QUIET_QUOTE_STATUSES, isQuietQuote };

export async function listQuotes(): Promise<QuoteRecord[]> {
  return getRepos().quotes.list();
}

export async function getQuote(id: string): Promise<QuoteRecord | undefined> {
  return getRepos().quotes.get(id);
}

export async function addQuote(input: NewQuoteInput): Promise<QuoteRecord> {
  return getRepos().quotes.add(input);
}

export async function updateQuote(
  id: string,
  patch: QuotePatch,
): Promise<QuoteRecord | undefined> {
  return getRepos().quotes.update(id, patch);
}

export async function bulkUpdateQuoteStatus(
  ids: string[],
  status: QuoteStatus,
): Promise<{ updated: number; missing: string[] }> {
  return getRepos().quotes.bulkUpdateStatus(ids, status);
}

/** @deprecated prefer updateQuote */
export async function updateQuoteStatus(
  id: string,
  status: QuoteStatus,
): Promise<QuoteRecord | undefined> {
  return updateQuote(id, { status });
}

export async function quoteStats() {
  return getRepos().quotes.stats();
}

/** Unique customers derived from quote contact fields (or customers table). */
export async function listCustomers() {
  return getRepos().customers.list();
}

export async function listQuietQuotes(
  thresholdDays = QUIET_DAYS_THRESHOLD,
): Promise<QuoteRecord[]> {
  return getRepos().quotes.listQuiet(thresholdDays);
}

export async function quietQuoteCount(
  thresholdDays = QUIET_DAYS_THRESHOLD,
): Promise<number> {
  return getRepos().quotes.quietCount(thresholdDays);
}

export async function listQuoteNotes(
  quoteId: string,
): Promise<QuoteNoteRecord[]> {
  return getRepos().quotes.listNotes(quoteId);
}

export async function addQuoteNote(
  quoteId: string,
  body: string,
  author?: { id?: string | null; label?: string },
): Promise<QuoteNoteRecord | null> {
  return getRepos().quotes.addNote(quoteId, body, author);
}
