"use client";

import { BarChart, DonutChart, Sparkline } from "@/components/admin/MiniCharts";
import { formatMoney } from "@/lib/admin/format";
import { QUOTE_STATUSES, type QuoteStatus } from "@/lib/admin/status";
import { useMemo, useState } from "react";
import { useAdminI18n } from "@/components/admin/LocaleProvider";
import { quoteStatusLabel, invoiceStatusLabel } from "@/lib/admin/i18n";

export type ReportQuote = {
  id: string;
  status: QuoteStatus;
  serviceType: string;
  createdAt: string;
};

export type ReportInvoice = {
  id: string;
  status: string;
  totalCents: number;
  createdAt: string;
};

type RangeKey = "7d" | "30d" | "90d" | "all";

const RANGE_KEYS: { key: RangeKey; labelKey: string; days: number | null }[] = [
  { key: "7d", labelKey: "reports.d7", days: 7 },
  { key: "30d", labelKey: "reports.d30", days: 30 },
  { key: "90d", labelKey: "reports.d90", days: 90 },
  { key: "all", labelKey: "reports.allTime", days: null },
];

function inRange(iso: string, days: number | null) {
  if (days == null) return true;
  const t = +new Date(iso);
  return t >= Date.now() - days * 86400000;
}

export default function ReportsPanel({
  quotes,
  invoices,
  paidCents,
  paymentCount,
}: {
  quotes: ReportQuote[];
  invoices: ReportInvoice[];
  paidCents: number;
  paymentCount: number;
}) {
  const { t, locale } = useAdminI18n();
  const [range, setRange] = useState<RangeKey>("all");
  const [service, setService] = useState<string>("all");
  const days = RANGE_KEYS.find((r) => r.key === range)?.days ?? null;

  const services = useMemo(() => {
    const set = new Set(quotes.map((q) => q.serviceType));
    return ["all", ...[...set].sort()];
  }, [quotes]);

  const filteredQuotes = useMemo(
    () =>
      quotes.filter((q) => {
        if (!inRange(q.createdAt, days)) return false;
        if (service !== "all" && q.serviceType !== service) return false;
        return true;
      }),
    [quotes, days, service],
  );

  const filteredInvoices = useMemo(
    () => invoices.filter((i) => inRange(i.createdAt, days)),
    [invoices, days],
  );

  const qStats = useMemo(() => {
    const total = filteredQuotes.length;
    const won = filteredQuotes.filter((q) => q.status === "won").length;
    const neu = filteredQuotes.filter((q) => q.status === "new").length;
    return { total, won, new: neu };
  }, [filteredQuotes]);

  const statusCounts = QUOTE_STATUSES.map(
    (s) => filteredQuotes.filter((q) => q.status === s).length,
  );

  const openInvoices = filteredInvoices.filter(
    (i) => i.status === "sent" || i.status === "partial" || i.status === "draft",
  );
  const openCents = openInvoices.reduce((s, i) => s + i.totalCents, 0);
  const paidInv = filteredInvoices.filter((i) => i.status === "paid").length;

  const invoiceSegs = [
    { label: t("reports.open"), value: openInvoices.length, color: "#c08b3a" },
    { label: t("reports.paid"), value: paidInv, color: "#10b981" },
    {
      label: t("reports.other"),
      value: Math.max(0, filteredInvoices.length - openInvoices.length - paidInv),
      color: "#64748b",
    },
  ].filter((s) => s.value > 0);

  const serviceMap = new Map<string, number>();
  for (const q of filteredQuotes) {
    serviceMap.set(q.serviceType, (serviceMap.get(q.serviceType) ?? 0) + 1);
  }
  const serviceRows = [...serviceMap.entries()].sort((a, b) => b[1] - a[1]);

  const trend = [1, 2, 2, 3, 4, filteredQuotes.length, Math.max(filteredQuotes.length, 4)];

  return (
    <div className="space-y-4">
      <div className="admin-toolbar flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-1.5" role="group" aria-label={t("reports.range")}>
          {RANGE_KEYS.map((r) => (
            <button
              key={r.key}
              type="button"
              className={`admin-chip admin-touch ${range === r.key ? "admin-chip-active" : ""}`}
              onClick={() => setRange(r.key)}
            >
              {t(r.labelKey)}
            </button>
          ))}
        </div>
        <div className="min-w-0 sm:max-w-xs sm:flex-1">
          <label htmlFor="report-service" className="sr-only">
            Filter by service
          </label>
          <select
            id="report-service"
            className="field-input !mt-0 py-2 text-sm"
            value={service}
            onChange={(e) => setService(e.target.value)}
          >
            {services.map((s) => (
              <option key={s} value={s}>
                {s === "all" ? t("reports.allServices") : s}
              </option>
            ))}
          </select>
        </div>
      </div>

      <ul className="grid gap-2.5 sm:grid-cols-2 xl:grid-cols-4">
        {[
          {
            label: t("reports.quotes"),
            value: String(qStats.total),
            hint: `${qStats.new} new in range`,
          },
          {
            label: t("reports.wonRate"),
            value:
              qStats.total === 0
                ? "—"
                : `${Math.round((qStats.won / qStats.total) * 100)}%`,
            hint: `${qStats.won} won`,
          },
          {
            label: t("reports.openAr"),
            value: formatMoney(openCents),
            hint: `${openInvoices.length} open invoices`,
          },
          {
            label: t("reports.collectedStub"),
            value: formatMoney(paidCents),
            hint: `${paymentCount} payments · not range-scoped`,
          },
        ].map((c) => (
          <li key={c.label} className="admin-stat admin-stat-lift">
            <p className="admin-stat-label">{c.label}</p>
            <p className="admin-stat-value mt-1">{c.value}</p>
            <p className="mt-1 text-[0.6875rem] text-muted">{c.hint}</p>
          </li>
        ))}
      </ul>

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="admin-glass-panel admin-gold-rail p-4 sm:p-5">
          <div className="mb-4 flex items-end justify-between gap-3">
            <div>
              <h2 className="admin-card-title">Pipeline by status</h2>
              <p className="mt-1 text-xs text-muted">Quote counts in each stage</p>
            </div>
            <Sparkline values={trend} />
          </div>
          <BarChart
            values={statusCounts}
            labels={QUOTE_STATUSES.map((s) => s.slice(0, 3))}
          />
        </section>

        <section className="admin-glass-panel admin-gold-rail p-4 sm:p-5">
          <h2 className="admin-card-title">Invoice mix</h2>
          <p className="mt-1 mb-4 text-xs text-muted">Open vs paid vs other</p>
          {invoiceSegs.length === 0 ? (
            <p className="text-sm text-muted">No invoices in range.</p>
          ) : (
            <DonutChart segments={invoiceSegs} />
          )}
        </section>

        <section className="admin-glass-panel admin-gold-rail p-4 sm:p-5 lg:col-span-2">
          <h2 className="admin-card-title">Demand by service</h2>
          <p className="mt-1 mb-4 text-xs text-muted">
            From quote service types (stub store)
          </p>
          {serviceRows.length === 0 ? (
            <p className="text-sm text-muted">No service data in range.</p>
          ) : (
            <ul className="space-y-2.5">
              {serviceRows.map(([name, count]) => {
                const pct = Math.round((count / filteredQuotes.length) * 100);
                return (
                  <li key={name}>
                    <div className="mb-1 flex justify-between text-sm">
                      <span className="font-medium text-ink">{name}</span>
                      <span className="tabular-nums text-muted">
                        {count} · {pct}%
                      </span>
                    </div>
                    <div className="admin-meter">
                      <div
                        className="admin-meter-fill"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
