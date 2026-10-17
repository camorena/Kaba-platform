"use client";

import Link from "next/link";
import { useAdminI18n } from "@/components/admin/LocaleProvider";
import {
  CHART_COLORS,
  ChartCard,
  ChartEmpty,
  ColumnSeries,
  formatMonthKey,
  HBarList,
  KpiTile,
} from "@/components/admin/StatsCharts";
import { formatMoney } from "@/lib/admin/format";
import { quoteStatusLabel } from "@/lib/admin/i18n";
import { STATS_RANGES, type BusinessStats, type StatsRange } from "@/lib/stats/business";

const RANGE_KEY: Record<StatsRange, string> = {
  "30d": "stats.r30d",
  "90d": "stats.r90d",
  "12m": "stats.r12m",
  all: "stats.rall",
};

const STATUS_COLOR: Record<string, string> = {
  new: CHART_COLORS.bronze,
  contacted: CHART_COLORS.sand,
  scheduled: CHART_COLORS.navy,
  won: CHART_COLORS.emerald,
  lost: CHART_COLORS.slate,
};

/** Compact USD for axis ticks ($0, $1.2k, $15k). */
function axisMoney(cents: number): string {
  const d = cents / 100;
  if (d >= 1000) return `$${(d / 1000).toFixed(d >= 10000 ? 0 : 1)}k`;
  return `$${Math.round(d)}`;
}

export default function StatsDashboard({ stats }: { stats: BusinessStats }) {
  const { t, locale } = useAdminI18n();
  const months = stats.quotes.byMonth.map((p) => formatMonthKey(p.month, locale));
  const hasQuotes = stats.quotes.total > 0;
  const hasMoney = stats.money.byMonth.some((m) => m.invoicedCents > 0 || m.collectedCents > 0);
  const pct = (r: number) =>
    new Intl.NumberFormat(locale === "es" ? "es-CO" : "en-US", {
      style: "percent",
      maximumFractionDigits: 0,
    }).format(r);

  const cityItems = [
    ...stats.customers.topCities.map((c) => ({ label: c.label, value: c.count })),
    ...(stats.customers.otherCities > 0
      ? [{ label: t("stats.otherCities"), value: stats.customers.otherCities, color: CHART_COLORS.slate }]
      : []),
  ];

  const sourceLabel: Record<string, string> = {
    "quote-form": t("stats.sourceQuoteForm"),
    "chat-widget": t("stats.sourceChat"),
    other: t("stats.sourceOther"),
  };
  const sourceColor: Record<string, string> = {
    "quote-form": CHART_COLORS.bronze,
    "chat-widget": CHART_COLORS.navy,
    other: CHART_COLORS.slate,
  };

  return (
    <div className="space-y-4">
      <div className="admin-toolbar flex flex-wrap items-center gap-1.5" role="group" aria-label={t("stats.range")}>
        <span className="mr-1 text-[0.6875rem] font-bold uppercase tracking-[0.14em] text-muted">
          {t("stats.range")}
        </span>
        {STATS_RANGES.map((r) => (
          <Link
            key={r}
            href={`/admin/reports?range=${r}`}
            scroll={false}
            aria-current={stats.range === r ? "page" : undefined}
            className={`admin-chip admin-touch ${stats.range === r ? "admin-chip-active" : ""}`}
          >
            {t(RANGE_KEY[r])}
          </Link>
        ))}
      </div>

      <ul className="grid gap-2.5 sm:grid-cols-2 xl:grid-cols-4">
        <KpiTile
          label={t("stats.customers")}
          value={stats.customers.total.toLocaleString("en-US")}
          hint={t("stats.customersHint", { withCity: String(stats.customers.withCity) })}
        />
        <KpiTile
          label={t("stats.quotes")}
          value={String(stats.quotes.total)}
          hint={t("stats.quotesHint")}
        />
        <KpiTile
          label={t("stats.conversion")}
          value={stats.conversion.rate === null ? "—" : pct(stats.conversion.rate)}
          hint={
            stats.conversion.rate === null
              ? t("stats.conversionEmpty")
              : t("stats.conversionHint", {
                  converted: String(stats.conversion.converted),
                  total: String(stats.conversion.quotes),
                })
          }
        />
        <KpiTile
          label={t("stats.openBalance")}
          value={formatMoney(stats.money.openBalanceCents)}
          hint={t("stats.openBalanceHint", { count: String(stats.money.openInvoiceCount) })}
        />
        <KpiTile
          label={t("stats.invoiced")}
          value={formatMoney(stats.money.invoicedCents)}
          hint={t("stats.invoicedHint", { count: String(stats.money.invoiceCount) })}
        />
        <KpiTile
          label={t("stats.collected")}
          value={formatMoney(stats.money.collectedCents)}
          hint={t("stats.collectedHint")}
        />
        <KpiTile
          label={t("stats.avgInvoice")}
          value={stats.money.averageInvoiceCents === null ? "—" : formatMoney(stats.money.averageInvoiceCents)}
          hint={
            stats.money.averageInvoiceCents === null
              ? t("stats.avgInvoiceEmpty")
              : t("stats.avgInvoiceHint")
          }
        />
        <KpiTile
          label={t("stats.sources")}
          value={String(stats.quotes.sources.reduce((s, x) => s + x.count, 0))}
          hint={stats.quotes.sources
            .filter((s) => s.count > 0)
            .map((s) => `${sourceLabel[s.source]} ${s.count}`)
            .join(" · ") || t("stats.conversionEmpty")}
        />
      </ul>

      <div className="grid gap-4 lg:grid-cols-2">
        <ChartCard title={t("stats.moneyByMonth")} subtitle={t("stats.moneyByMonthSub")} className="lg:col-span-2">
          {hasMoney ? (
            <ColumnSeries
              labels={months}
              periodHead={t("stats.monthCol")}
              ariaLabel={t("stats.moneyByMonth")}
              format={axisMoney}
              size="wide"
              series={[
                {
                  name: t("stats.invoicedSeries"),
                  color: CHART_COLORS.navy,
                  values: stats.money.byMonth.map((m) => m.invoicedCents),
                },
                {
                  name: t("stats.collectedSeries"),
                  color: CHART_COLORS.bronze,
                  values: stats.money.byMonth.map((m) => m.collectedCents),
                },
              ]}
            />
          ) : (
            <ChartEmpty>{t("stats.noMoney")}</ChartEmpty>
          )}
        </ChartCard>

        <ChartCard title={t("stats.quotesByMonth")} subtitle={t("stats.quotesByMonthSub")}>
          {hasQuotes ? (
            <ColumnSeries
              labels={months}
              periodHead={t("stats.monthCol")}
              ariaLabel={t("stats.quotesByMonth")}
              series={[
                {
                  name: t("stats.quotesCol"),
                  color: CHART_COLORS.bronze,
                  values: stats.quotes.byMonth.map((p) => p.value),
                },
              ]}
            />
          ) : (
            <ChartEmpty>{t("stats.noQuotes")}</ChartEmpty>
          )}
        </ChartCard>

        <ChartCard title={t("stats.quotesByStatus")} subtitle={t("stats.quotesByStatusSub")}>
          {hasQuotes ? (
            <HBarList
              ariaLabel={t("stats.quotesByStatus")}
              labelHead={t("stats.statusCol")}
              valueHead={t("stats.quotesCol")}
              items={stats.quotes.byStatus.map((s) => ({
                label: quoteStatusLabel(locale, s.status),
                value: s.count,
                color: STATUS_COLOR[s.status],
              }))}
            />
          ) : (
            <ChartEmpty>{t("stats.noQuotes")}</ChartEmpty>
          )}
        </ChartCard>

        <ChartCard title={t("stats.topCities")} subtitle={t("stats.topCitiesSub")}>
          {cityItems.length ? (
            <HBarList
              ariaLabel={t("stats.topCities")}
              labelHead={t("stats.cityCol")}
              valueHead={t("stats.customersCol")}
              items={cityItems}
            />
          ) : (
            <ChartEmpty>{t("stats.noCities")}</ChartEmpty>
          )}
        </ChartCard>

        <ChartCard title={t("stats.sources")} subtitle={t("stats.sourcesSub")}>
          {hasQuotes ? (
            <HBarList
              ariaLabel={t("stats.sources")}
              labelHead={t("stats.sourceCol")}
              valueHead={t("stats.quotesCol")}
              items={stats.quotes.sources.map((s) => ({
                label: sourceLabel[s.source],
                value: s.count,
                color: sourceColor[s.source],
              }))}
            />
          ) : (
            <ChartEmpty>{t("stats.noQuotes")}</ChartEmpty>
          )}
        </ChartCard>
      </div>

      <p className="px-0.5 text-[0.6875rem] leading-relaxed text-muted">{t("stats.footnote")}</p>
    </div>
  );
}
