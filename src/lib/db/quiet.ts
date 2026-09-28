/**
 * Gone-quiet helpers — shared by Memory* and Postgres* quote repos.
 */

import type { QuoteRecord, QuoteStatus } from "@/lib/db/types";

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
