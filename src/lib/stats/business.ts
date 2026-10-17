/**
 * Business statistics — pure computation over real records.
 * Demo/seed rows are always excluded; empty data yields zeros/nulls, never
 * placeholder numbers.
 */

import type { InvoiceStatus, QuoteStatus } from "@/lib/admin/status";

export const STATS_RANGES = ["30d", "90d", "12m", "all"] as const;
export type StatsRange = (typeof STATS_RANGES)[number];

export function parseStatsRange(v: unknown): StatsRange {
  return (STATS_RANGES as readonly unknown[]).includes(v) ? (v as StatsRange) : "12m";
}

export type StatsInput = {
  customers: { city: string | null }[];
  quotes: { id: string; status: QuoteStatus; source: string; createdAt: string }[];
  invoices: {
    id: string;
    quoteId: string | null;
    status: InvoiceStatus;
    demo: boolean;
    totalCents: number;
    createdAt: string;
  }[];
  payments: {
    invoiceId: string;
    amountCents: number;
    status: string;
    demo: boolean;
    createdAt: string;
  }[];
  paidByInvoiceId: Map<string, number>;
};

export type MonthPoint = { month: string; value: number };

export type BusinessStats = {
  range: StatsRange;
  from: string | null;
  customers: {
    total: number;
    withCity: number;
    topCities: { label: string; count: number }[];
    otherCities: number;
  };
  quotes: {
    total: number;
    byStatus: { status: QuoteStatus; count: number }[];
    byMonth: MonthPoint[];
    sources: { source: "quote-form" | "chat-widget" | "other"; count: number }[];
  };
  conversion: { quotes: number; converted: number; rate: number | null };
  money: {
    byMonth: { month: string; invoicedCents: number; collectedCents: number }[];
    invoicedCents: number;
    collectedCents: number;
    invoiceCount: number;
    averageInvoiceCents: number | null;
    openBalanceCents: number;
    openInvoiceCount: number;
  };
};

const DAY = 86_400_000;

function rangeStart(range: StatsRange, now: Date): Date | null {
  if (range === "all") return null;
  if (range === "12m") {
    return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 11, 1));
  }
  return new Date(now.getTime() - (range === "30d" ? 30 : 90) * DAY);
}

export function monthKey(iso: string | Date): string {
  const d = typeof iso === "string" ? new Date(iso) : iso;
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`;
}

function monthSeries(from: Date, now: Date): string[] {
  const keys: string[] = [];
  let y = from.getUTCFullYear();
  let m = from.getUTCMonth();
  const endKey = monthKey(now);
  for (let i = 0; i < 48; i++) {
    const k = `${y}-${String(m + 1).padStart(2, "0")}`;
    keys.push(k);
    if (k === endKey) break;
    m += 1;
    if (m > 11) {
      m = 0;
      y += 1;
    }
  }
  return keys;
}

/** Grouping key for a city: case/space-insensitive, keeps the entered label. */
function cityKey(raw: string | null): { key: string; label: string } | null {
  const label = (raw ?? "").trim().replace(/\s+/g, " ");
  if (!label) return null;
  return { key: label.toLowerCase(), label };
}

export function isSeedQuote(q: { id: string; source: string }): boolean {
  return q.source === "seed" || q.id.startsWith("q_seed_");
}

export function computeBusinessStats(
  input: StatsInput,
  range: StatsRange,
  now: Date = new Date(),
  topN = 8,
): BusinessStats {
  const start = rangeStart(range, now);
  const inRange = (iso: string) => !start || +new Date(iso) >= +start;

  // Customers — cumulative (not range-scoped; import dates are not job dates).
  const cityCounts = new Map<string, { label: string; count: number }>();
  let withCity = 0;
  for (const c of input.customers) {
    const city = cityKey(c.city);
    if (!city) continue;
    withCity += 1;
    const cur = cityCounts.get(city.key) ?? { label: city.label, count: 0 };
    cur.count += 1;
    cityCounts.set(city.key, cur);
  }
  const sortedCities = [...cityCounts.values()]
    .map((v) => [v.label, v.count] as const)
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
  const topCities = sortedCities.slice(0, topN).map(([label, count]) => ({ label, count }));
  const otherCities = sortedCities.slice(topN).reduce((s, [, n]) => s + n, 0);

  const realQuotes = input.quotes.filter((q) => !isSeedQuote(q));
  const quotes = realQuotes.filter((q) => inRange(q.createdAt));
  const realInvoices = input.invoices.filter((i) => !i.demo);
  const billable = realInvoices.filter((i) => i.status !== "draft" && i.status !== "void");
  const invoicesInRange = billable.filter((i) => inRange(i.createdAt));
  const payments = input.payments.filter(
    (p) => !p.demo && p.status === "recorded" && inRange(p.createdAt),
  );

  // Month buckets: range start, or earliest real record (min 6 months) for "all".
  let seriesFrom = start;
  if (!seriesFrom) {
    const dates = [
      ...realQuotes.map((q) => q.createdAt),
      ...billable.map((i) => i.createdAt),
      ...input.payments.filter((p) => !p.demo).map((p) => p.createdAt),
    ].map((d) => +new Date(d));
    const sixAgo = Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 5, 1);
    seriesFrom = new Date(Math.min(sixAgo, ...dates));
  }
  const months = monthSeries(seriesFrom, now);

  const quotesByMonth = new Map(months.map((m) => [m, 0]));
  for (const q of quotes) {
    const k = monthKey(q.createdAt);
    if (quotesByMonth.has(k)) quotesByMonth.set(k, (quotesByMonth.get(k) ?? 0) + 1);
  }

  const statuses: QuoteStatus[] = ["new", "contacted", "scheduled", "won", "lost"];
  const byStatus = statuses.map((status) => ({
    status,
    count: quotes.filter((q) => q.status === status).length,
  }));

  const src = { "quote-form": 0, "chat-widget": 0, other: 0 };
  for (const q of quotes) {
    if (q.source === "quote-form" || q.source === "chat-widget") src[q.source] += 1;
    else src.other += 1;
  }

  const invoicedQuoteIds = new Set(
    billable.map((i) => i.quoteId).filter((id): id is string => Boolean(id)),
  );
  const converted = quotes.filter(
    (q) => q.status === "won" || invoicedQuoteIds.has(q.id),
  ).length;

  const money = new Map(months.map((m) => [m, { invoicedCents: 0, collectedCents: 0 }]));
  for (const i of invoicesInRange) {
    const b = money.get(monthKey(i.createdAt));
    if (b) b.invoicedCents += i.totalCents;
  }
  for (const p of payments) {
    const b = money.get(monthKey(p.createdAt));
    if (b) b.collectedCents += p.amountCents;
  }

  const invoicedCents = invoicesInRange.reduce((s, i) => s + i.totalCents, 0);
  const collectedCents = payments.reduce((s, p) => s + p.amountCents, 0);

  // Open balance is a current-state figure (not range-scoped).
  const open = realInvoices.filter((i) => i.status === "sent" || i.status === "partial");
  let openBalanceCents = 0;
  let openInvoiceCount = 0;
  for (const i of open) {
    const bal = Math.max(0, i.totalCents - (input.paidByInvoiceId.get(i.id) ?? 0));
    if (bal > 0) {
      openBalanceCents += bal;
      openInvoiceCount += 1;
    }
  }

  return {
    range,
    from: start ? start.toISOString() : null,
    customers: { total: input.customers.length, withCity, topCities, otherCities },
    quotes: {
      total: quotes.length,
      byStatus,
      byMonth: months.map((m) => ({ month: m, value: quotesByMonth.get(m) ?? 0 })),
      sources: [
        { source: "quote-form", count: src["quote-form"] },
        { source: "chat-widget", count: src["chat-widget"] },
        { source: "other", count: src.other },
      ],
    },
    conversion: {
      quotes: quotes.length,
      converted,
      rate: quotes.length ? converted / quotes.length : null,
    },
    money: {
      byMonth: months.map((m) => ({ month: m, ...(money.get(m) ?? { invoicedCents: 0, collectedCents: 0 }) })),
      invoicedCents,
      collectedCents,
      invoiceCount: invoicesInRange.length,
      averageInvoiceCents: invoicesInRange.length
        ? Math.round(invoicedCents / invoicesInRange.length)
        : null,
      openBalanceCents,
      openInvoiceCount,
    },
  };
}
