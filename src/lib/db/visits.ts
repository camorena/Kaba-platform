/**
 * Visit / install window helpers — quotes with status scheduled|won + scheduled_for.
 * Calendar already treats these as site visits / install windows (see schedule.ts).
 */

import type { QuoteRecord, QuoteStatus } from "@/lib/db/types";

export const VISIT_REMINDER_STATUSES: QuoteStatus[] = ["scheduled", "won"];

/** YYYY-MM-DD in America/Chicago for an instant. */
export function chicagoYmd(date = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Chicago",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

/** Add calendar days to a YYYY-MM-DD (UTC-noon arithmetic avoids DST skew). */
export function addCalendarDaysYmd(ymd: string, days: number): string {
  const [y, m, d] = ymd.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d + days, 12, 0, 0));
  const yy = dt.getUTCFullYear();
  const mm = String(dt.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(dt.getUTCDate()).padStart(2, "0");
  return `${yy}-${mm}-${dd}`;
}

/** Next calendar day in America/Chicago. */
export function chicagoTomorrowYmd(now = new Date()): string {
  return addCalendarDaysYmd(chicagoYmd(now), 1);
}

/** Default stub day when status becomes scheduled / won without a date. */
export function defaultScheduledFor(
  status: QuoteStatus,
  now = new Date(),
): string | null {
  if (status === "scheduled") return addCalendarDaysYmd(chicagoYmd(now), 2);
  if (status === "won") return addCalendarDaysYmd(chicagoYmd(now), 5);
  return null;
}

export function visitKindLabel(status: QuoteStatus): string {
  return status === "won" ? "Install window" : "Site visit";
}

export function visitTimeLabel(status: QuoteStatus): string {
  return status === "won" ? "8:00 AM" : "10:00 AM";
}

/** Format YYYY-MM-DD for customer-facing copy (America/Chicago locale). */
export function formatVisitDayLabel(ymd: string): string {
  const [y, m, d] = ymd.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d, 17, 0, 0)); // midday-ish US
  return dt.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

export function isVisitReminderCandidate(
  quote: QuoteRecord,
  tomorrowYmd: string,
): boolean {
  if (!VISIT_REMINDER_STATUSES.includes(quote.status)) return false;
  if (!quote.scheduledFor) return false;
  if (quote.scheduledFor !== tomorrowYmd) return false;
  if (quote.visitReminderSentAt) return false;
  if (!quote.email?.trim()) return false;
  return true;
}
