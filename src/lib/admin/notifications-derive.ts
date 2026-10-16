/**
 * Admin notifications — derived from real records at read time (no stored
 * feed, no demo rows). Pure + deterministic for a given `now` so it can be
 * tested without a database.
 */

import { isQuietQuote, QUIET_DAYS_THRESHOLD } from "@/lib/db/quiet";
import type {
  InvoiceRecord,
  PaymentRecord,
  QuoteRecord,
} from "@/lib/db/types";
import {
  addCalendarDaysYmd,
  chicagoYmd,
  VISIT_REMINDER_STATUSES,
} from "@/lib/db/visits";

export type NotificationKind =
  | "quote_new"
  | "quote_quiet"
  | "notify_failed"
  | "visit_upcoming"
  | "visit_reminder_missing"
  | "invoice_open"
  | "payment_received";

export type NotificationSeverity = "urgent" | "normal" | "info";

export type AdminNotification = {
  /** Stable key — read state attaches to it. */
  key: string;
  kind: NotificationKind;
  severity: NotificationSeverity;
  /** Instant shown as relative time (ISO). */
  at: string;
  /** Visit/install day (YYYY-MM-DD, America/Chicago) — shown as a calendar day. */
  day?: string;
  /** When the condition began; "mark all as read" clears items older than it. */
  since: string;
  href: string;
  vars: Record<string, string | number>;
  unread: boolean;
};

export type NotificationInputs = {
  quotes: QuoteRecord[];
  invoices: InvoiceRecord[];
  payments: PaymentRecord[];
  paidByInvoiceId: Map<string, number>;
};

const HOUR = 3_600_000;
const DAY = 24 * HOUR;
export const NEW_QUOTE_URGENT_HOURS = 24;
export const VISIT_WINDOW_DAYS = 2;
export const PAYMENT_LOOKBACK_DAYS = 7;
/** Visit-reminder cron runs 12:15 UTC; after this UTC hour a missing stamp means it didn't go out. */
const REMINDER_CHECK_AFTER_UTC_HOUR = 13;

const SEVERITY_ORDER: Record<NotificationSeverity, number> = {
  urgent: 0,
  normal: 1,
  info: 2,
};

/** Seed/demo quotes from the memory adapter never reach the bell. */
function isRealQuote(q: QuoteRecord): boolean {
  return q.source !== "seed" && !q.id.startsWith("q_seed_");
}

function cityFromAddress(address: string): string {
  const parts = address
    .split(",")
    .map((p) => p.trim())
    .filter(Boolean);
  if (parts.length >= 3) return parts[parts.length - 2];
  return parts[0] ?? "";
}

export function deriveNotifications(
  input: NotificationInputs,
  now: Date = new Date(),
): Omit<AdminNotification, "unread">[] {
  const nowMs = now.getTime();
  const out: Omit<AdminNotification, "unread">[] = [];
  const today = chicagoYmd(now);
  const tomorrow = addCalendarDaysYmd(today, 1);
  const lastVisitDay = addCalendarDaysYmd(today, VISIT_WINDOW_DAYS);

  for (const q of input.quotes) {
    if (!isRealQuote(q)) continue;
    const ageMs = nowMs - new Date(q.createdAt).getTime();

    if (q.status === "new") {
      out.push({
        key: `quote-new:${q.id}`,
        kind: "quote_new",
        severity: ageMs >= NEW_QUOTE_URGENT_HOURS * HOUR ? "urgent" : "normal",
        at: q.createdAt,
        since: q.createdAt,
        href: `/admin/quotes/${q.id}`,
        vars: {
          name: q.name,
          service: q.serviceType,
          city: cityFromAddress(q.address),
          days: Math.floor(ageMs / DAY),
        },
      });
    } else if (isQuietQuote(q, QUIET_DAYS_THRESHOLD, nowMs)) {
      out.push({
        key: `quote-quiet:${q.id}:${q.updatedAt}`,
        kind: "quote_quiet",
        severity: "normal",
        at: q.updatedAt,
        since: q.updatedAt,
        href: `/admin/quotes/${q.id}`,
        vars: {
          name: q.name,
          days: Math.floor((nowMs - new Date(q.updatedAt).getTime()) / DAY),
        },
      });
    }

    if (!q.notifiedAt && q.notifyAttempts > 0) {
      out.push({
        key: `notify-failed:${q.id}:${q.notifyAttempts}`,
        kind: "notify_failed",
        severity: "urgent",
        at: q.updatedAt,
        since: q.updatedAt,
        href: `/admin/quotes/${q.id}`,
        vars: { name: q.name, attempts: q.notifyAttempts },
      });
    }

    if (
      VISIT_REMINDER_STATUSES.includes(q.status) &&
      q.scheduledFor &&
      q.scheduledFor >= today &&
      q.scheduledFor <= lastVisitDay
    ) {
      const install = q.status === "won";
      out.push({
        key: `visit:${q.id}:${q.scheduledFor}`,
        kind: "visit_upcoming",
        severity: q.scheduledFor === today ? "urgent" : "normal",
        at: q.updatedAt,
        day: q.scheduledFor,
        since: q.updatedAt,
        href: `/admin/quotes/${q.id}`,
        vars: {
          name: q.name,
          service: q.serviceType,
          city: cityFromAddress(q.address),
          install: install ? 1 : 0,
        },
      });

      if (
        q.scheduledFor === tomorrow &&
        !q.visitReminderSentAt &&
        q.email.trim() &&
        now.getUTCHours() >= REMINDER_CHECK_AFTER_UTC_HOUR
      ) {
        out.push({
          key: `visit-reminder:${q.id}:${q.scheduledFor}`,
          kind: "visit_reminder_missing",
          severity: "urgent",
          at: now.toISOString(),
          day: q.scheduledFor,
          since: `${today}T${String(REMINDER_CHECK_AFTER_UTC_HOUR).padStart(2, "0")}:00:00.000Z`,
          href: `/admin/quotes/${q.id}`,
          vars: { name: q.name },
        });
      }
    }
  }

  for (const inv of input.invoices) {
    if (inv.demo) continue;
    if (inv.status !== "sent" && inv.status !== "partial") continue;
    const total = inv.lines.reduce((s, l) => s + l.quantity * l.unitCents, 0);
    const paid = input.paidByInvoiceId.get(inv.id) ?? 0;
    const balance = total - paid;
    if (balance <= 0) continue;
    out.push({
      key: `invoice-open:${inv.id}:${balance}`,
      kind: "invoice_open",
      severity: "normal",
      at: inv.updatedAt,
      since: inv.updatedAt,
      href: `/admin/invoices/${inv.id}`,
      vars: { number: inv.number, name: inv.customerName, balanceCents: balance },
    });
  }

  for (const p of input.payments) {
    if (p.demo || p.status !== "recorded") continue;
    if (!p.stripeEventId && !p.stripeCheckoutSessionId) continue;
    if (nowMs - new Date(p.createdAt).getTime() > PAYMENT_LOOKBACK_DAYS * DAY) continue;
    out.push({
      key: `payment:${p.id}`,
      kind: "payment_received",
      severity: "info",
      at: p.createdAt,
      since: p.createdAt,
      href: `/admin/invoices/${p.invoiceId}`,
      vars: { number: p.invoiceNumber, name: p.customerName, amountCents: p.amountCents },
    });
  }

  return out.sort(
    (a, b) =>
      SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity] ||
      +new Date(b.since) - +new Date(a.since),
  );
}

export function applyReadState(
  items: Omit<AdminNotification, "unread">[],
  state: { clearedAt: string | null; readKeys: Set<string> },
): AdminNotification[] {
  const clearedMs = state.clearedAt ? new Date(state.clearedAt).getTime() : -Infinity;
  return items.map((n) => ({
    ...n,
    unread: !state.readKeys.has(n.key) && new Date(n.since).getTime() > clearedMs,
  }));
}
