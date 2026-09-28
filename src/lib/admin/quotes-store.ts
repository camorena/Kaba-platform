/**
 * Quote store facade — delegates to the selected data adapter (memory default).
 * Replace the adapter (KABA_DATA_ADAPTER + Postgres repos) before production.
 *
 * Persistence: memory adapter uses a module/global singleton. On serverless
 * cold starts the list resets; seed data keeps the UI usable. See
 * db/migrations/0001_ops_foundation.sql for the durable schema draft.
 */

import {
  isQuietQuote,
  memoryQuotesRepo,
  QUIET_DAYS_THRESHOLD,
  QUIET_QUOTE_STATUSES,
} from "@/lib/db/memory/quotes";
import { memoryCustomersRepo } from "@/lib/db/memory/customers";
import type {
  NewQuoteInput,
  QuoteNoteRecord,
  QuotePatch,
  QuoteRecord,
  QuoteStatus,
} from "@/lib/db/types";

export type { QuoteRecord, QuoteStatus, QuoteNoteRecord };

export {
  QUIET_DAYS_THRESHOLD,
  QUIET_QUOTE_STATUSES,
  isQuietQuote,
};

export function listQuotes(): QuoteRecord[] {
  return memoryQuotesRepo.list();
}

export function getQuote(id: string): QuoteRecord | undefined {
  return memoryQuotesRepo.get(id);
}

export function addQuote(input: NewQuoteInput): QuoteRecord {
  return memoryQuotesRepo.add(input);
}

export function updateQuote(
  id: string,
  patch: QuotePatch,
): QuoteRecord | undefined {
  return memoryQuotesRepo.update(id, patch);
}

export function bulkUpdateQuoteStatus(
  ids: string[],
  status: QuoteStatus,
): { updated: number; missing: string[] } {
  return memoryQuotesRepo.bulkUpdateStatus(ids, status);
}

/** @deprecated prefer updateQuote */
export function updateQuoteStatus(
  id: string,
  status: QuoteStatus,
): QuoteRecord | undefined {
  return updateQuote(id, { status });
}

export function quoteStats() {
  return memoryQuotesRepo.stats();
}

/** Unique customers derived from quote contact fields. */
export function listCustomers() {
  return memoryCustomersRepo.list();
}

export function listQuietQuotes(
  thresholdDays = QUIET_DAYS_THRESHOLD,
): QuoteRecord[] {
  return memoryQuotesRepo.listQuiet(thresholdDays);
}

export function quietQuoteCount(thresholdDays = QUIET_DAYS_THRESHOLD): number {
  return memoryQuotesRepo.quietCount(thresholdDays);
}

export function listQuoteNotes(quoteId: string): QuoteNoteRecord[] {
  return memoryQuotesRepo.listNotes(quoteId);
}

export function addQuoteNote(
  quoteId: string,
  body: string,
  author?: { id?: string | null; label?: string },
): QuoteNoteRecord | null {
  return memoryQuotesRepo.addNote(quoteId, body, author);
}
