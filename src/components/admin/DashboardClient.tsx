"use client";

import Link from "next/link";
import EmptyState from "@/components/admin/EmptyState";
import { useAdminI18n } from "@/components/admin/LocaleProvider";
import { Sparkline } from "@/components/admin/MiniCharts";
import PageHeader from "@/components/admin/PageHeader";
import StatusBadge from "@/components/admin/StatusBadge";
import { formatMoney, formatShortDate } from "@/lib/admin/format";
import {
  invoiceStatusLabel,
  quoteStatusLabel,
} from "@/lib/admin/i18n";
import { quoteStatusTone, type QuoteStatus, type InvoiceStatus } from "@/lib/admin/status";
import type { LaunchBlocker } from "@/lib/admin/launch-blockers";

export type DashQuote = {
  id: string;
  name: string;
  serviceType: string;
  address: string;
  status: QuoteStatus;
  createdAt: string;
};

export type DashInvoice = {
  id: string;
  number: string;
  status: InvoiceStatus;
  customerName: string;
};

export type DashPayment = {
  id: string;
  invoiceNumber: string;
  amountCents: number;
};

export type DashAttention = {
  id: string;
  href: string;
  label: string;
  metaKey: "newQuote" | "invoice";
  serviceOrStatus: string;
  customer?: string;
};

export type DashQuietQuote = {
  id: string;
  name: string;
  serviceType: string;
  status: QuoteStatus;
  updatedAt: string;
  quietDays: number;
};

/** Unknown (null) renders as em dash — never a silent fake 0. */
function displayCount(value: number | null): string {
  return value === null ? "—" : String(value);
}

function displayMoney(cents: number | null): string {
  return cents === null ? "—" : formatMoney(cents);
}

export default function DashboardClient({
  qStats,
  iStats,
  pStats,
  quietCount,
  quietDays,
  quietQuotes,
  launchBlockers,
  needsAction,
  funnel,
  recent,
  recentInvoices,
  recentPayments,
}: {
  qStats: {
    new: number | null;
    total: number | null;
    won: number | null;
    scheduled: number | null;
  };
  iStats: { open: number | null; totalOpenCents: number | null };
  pStats: { recordedCents: number | null; total: number | null };
  quietCount: number | null;
  quietDays: number;
  quietQuotes: DashQuietQuote[];
  launchBlockers: LaunchBlocker[];
  needsAction: DashAttention[];
  funnel: { status: QuoteStatus; count: number }[];
  recent: DashQuote[];
  recentInvoices: DashInvoice[];
  recentPayments: DashPayment[];
}) {
  const { t, locale } = useAdminI18n();
  const funnelMax = Math.max(1, ...funnel.map((f) => f.count));
  const outstandingBlockers = launchBlockers.filter((b) => !b.clear).length;
  const quietAttention = (quietCount ?? 0) > 0;

  const cards = [
    {
      label: t("pages.dashboard.newQuotes"),
      value: displayCount(qStats.new),
      href: "/admin/quotes",
      hint:
        qStats.total === null
          ? t("pages.dashboard.unknownHint")
          : t("pages.dashboard.totalHint", { count: qStats.total }),
      spark: [1, 1, 2, 2, 3, qStats.new || 1],
      attention: (qStats.new ?? 0) > 0,
    },
    {
      label: t("pages.dashboard.goneQuiet"),
      value: displayCount(quietCount),
      href: "/admin/quotes#gone-quiet",
      hint:
        quietCount === null
          ? t("pages.dashboard.unknownHint")
          : t("pages.dashboard.goneQuietHint", { days: quietDays }),
      spark: [0, 1, 1, 2, 2, quietCount || 1],
      attention: quietAttention,
    },
    {
      label: t("pages.dashboard.openInvoices"),
      value: displayCount(iStats.open),
      href: "/admin/invoices",
      hint:
        iStats.totalOpenCents === null
          ? t("pages.dashboard.unknownHint")
          : `${formatMoney(iStats.totalOpenCents)} ${t("common.due")}`,
      spark: [2, 2, 3, 2, 3, iStats.open || 1],
      attention: false,
    },
    {
      label: t("pages.dashboard.collected"),
      value: displayMoney(pStats.recordedCents),
      href: "/admin/payments",
      hint:
        pStats.total === null
          ? t("pages.dashboard.unknownHint")
          : t("pages.dashboard.stubPayments", { count: pStats.total }),
      spark: [1, 2, 2, 3, 4, Math.max(1, pStats.total ?? 1)],
      attention: false,
    },
  ];

  const chips = [
    { href: "/admin/quotes", label: t("nav.quotes") },
    { href: "/admin/pipeline", label: t("nav.pipeline") },
    { href: "/admin/invoices", label: t("nav.invoices") },
    { href: "/admin/templates", label: t("nav.templates") },
    { href: "/admin/calendar", label: t("nav.schedule") },
    { href: "/admin/reports", label: t("nav.reports") },
  ];

  return (
    <>
      <PageHeader
        title={t("pages.dashboard.title")}
        crumbs={[{ label: t("pages.dashboard.title") }]}
        description={t("pages.dashboard.description")}
        actions={
          <div className="flex flex-wrap gap-2">
            <Link href="/admin/pipeline" className="btn-primary admin-btn-sm">
              {t("nav.pipeline")}
            </Link>
            <Link href="/admin/pricebook" className="btn-secondary-light admin-btn-sm">
              {t("nav.pricebook")}
            </Link>
          </div>
        }
      />

      <div className="mb-3.5 flex flex-wrap items-center gap-1.5">
        {chips.map((x) => (
          <Link key={x.href} href={x.href} className="admin-chip hover:border-bronze/40">
            {x.label} →
          </Link>
        ))}
      </div>

      {quietQuotes.length > 0 && (
        <section
          id="gone-quiet"
          className="admin-attention mb-4 overflow-hidden rounded-xl border border-amber-500/30 bg-[var(--admin-panel)] shadow-[var(--shadow-xs)]"
          aria-labelledby="gone-quiet-heading"
        >
          <div className="flex items-center justify-between gap-2 border-b border-ink/8 bg-gradient-to-r from-amber-500/15 to-transparent px-3 py-2 sm:px-4">
            <h2 id="gone-quiet-heading" className="admin-section-label">
              {t("pages.dashboard.goneQuiet")}
            </h2>
            <span className="text-[0.625rem] tabular-nums text-muted">
              {t(
                quietQuotes.length === 1 ? "common.items" : "common.items_plural",
                { count: quietQuotes.length },
              )}
            </span>
          </div>
          <p className="border-b border-ink/6 px-3 py-2 text-xs leading-relaxed text-muted sm:px-4">
            {t("pages.dashboard.goneQuietIntro", { days: quietDays })}
          </p>
          <ul className="divide-y divide-ink/6">
            {quietQuotes.map((q) => (
              <li key={q.id}>
                <Link
                  href={`/admin/quotes/${q.id}`}
                  className="flex items-center justify-between gap-3 px-3 py-2 text-sm transition hover:bg-[var(--admin-row-hover)] sm:px-4"
                >
                  <div className="min-w-0">
                    <span className="font-semibold text-ink">{q.name}</span>
                    <span className="ml-2 text-xs text-muted">
                      {quoteStatusLabel(locale, q.status)} · {q.serviceType}
                    </span>
                    <div className="text-[0.6875rem] text-amber-800 dark:text-amber-200/90">
                      {t("pages.dashboard.quietForDays", { count: q.quietDays })}
                    </div>
                  </div>
                  <StatusBadge
                    label={quoteStatusLabel(locale, q.status)}
                    tone={quoteStatusTone[q.status]}
                  />
                </Link>
              </li>
            ))}
          </ul>
          <div className="border-t border-ink/6 px-3 py-2 sm:px-4">
            <Link href="/admin/quotes#gone-quiet" className="admin-label-link">
              {t("pages.dashboard.viewQuietQuotes")}
            </Link>
          </div>
        </section>
      )}

      {needsAction.length > 0 && (
        <section className="admin-attention mb-4 overflow-hidden rounded-xl border border-bronze/25 bg-[var(--admin-panel)] shadow-[var(--shadow-xs)]">
          <div className="flex items-center justify-between gap-2 border-b border-ink/8 bg-gradient-to-r from-bronze/12 to-transparent px-3 py-2 sm:px-4">
            <h2 className="admin-section-label">
              {t("pages.dashboard.needsAttention")}
            </h2>
            <span className="text-[0.625rem] tabular-nums text-muted">
              {t(
                needsAction.length === 1 ? "common.items" : "common.items_plural",
                { count: needsAction.length },
              )}
            </span>
          </div>
          <ul className="divide-y divide-ink/6">
            {needsAction.map((item) => {
              const meta =
                item.metaKey === "newQuote"
                  ? t("pages.dashboard.newQuoteMeta", {
                      service: item.serviceOrStatus,
                    })
                  : t("pages.dashboard.invoiceMeta", {
                      status: invoiceStatusLabel(locale, item.serviceOrStatus),
                      customer: item.customer ?? "",
                    });
              return (
                <li key={item.id}>
                  <Link
                    href={item.href}
                    className="flex items-center justify-between gap-3 px-3 py-2 text-sm transition hover:bg-[var(--admin-row-hover)] sm:px-4"
                  >
                    <div className="min-w-0">
                      <span className="font-semibold text-ink">{item.label}</span>
                      <span className="ml-2 text-xs text-muted">{meta}</span>
                    </div>
                    <span className="shrink-0 text-bronze" aria-hidden>
                      →
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      <ul className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((c) => (
          <li key={c.label}>
            <Link
              href={c.href}
              className={`admin-stat admin-stat-lift admin-stat-dense block transition hover:border-bronze/35 ${
                c.attention ? "border-amber-500/35" : ""
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <p className="admin-stat-label">{c.label}</p>
                <Sparkline values={c.spark} width={64} height={22} />
              </div>
              <p
                className={`admin-stat-value mt-0.5 ${
                  c.attention ? "text-amber-800 dark:text-amber-200" : ""
                }`}
              >
                {c.value}
              </p>
              <p className="mt-0.5 text-[0.6875rem] text-muted">{c.hint}</p>
            </Link>
          </li>
        ))}
      </ul>

      <section
        className="admin-glass-panel admin-gold-rail mt-4 p-3.5 sm:p-4"
        aria-labelledby="before-launch-heading"
      >
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <h2 id="before-launch-heading" className="admin-section-label">
            {t("pages.dashboard.beforeLaunch")}
          </h2>
          {outstandingBlockers > 0 ? (
            <span className="rounded-full border border-amber-500/35 bg-amber-500/10 px-2 py-0.5 text-[0.625rem] font-bold uppercase tracking-wide text-amber-900 dark:text-amber-100">
              {t("pages.dashboard.outstandingCount", {
                count: outstandingBlockers,
              })}
            </span>
          ) : (
            <span className="rounded-full border border-emerald-500/35 bg-emerald-500/10 px-2 py-0.5 text-[0.625rem] font-bold uppercase tracking-wide text-emerald-900 dark:text-emerald-100">
              {t("pages.dashboard.blockersClear")}
            </span>
          )}
        </div>
        <ul className="space-y-2">
          {launchBlockers.map((b) => (
            <li
              key={b.id}
              className={`flex gap-3 rounded-lg border px-3 py-2.5 ${
                b.clear
                  ? "border-[var(--admin-border)] bg-[var(--admin-row-hover)]/30"
                  : "border-amber-500/25 bg-amber-500/5"
              }`}
            >
              <span
                className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${
                  b.clear
                    ? "bg-emerald-500"
                    : "bg-amber-500 ring-2 ring-amber-500/30"
                }`}
                aria-hidden
              />
              <div className="min-w-0 flex-1">
                <Link
                  href={b.href}
                  className="text-sm font-semibold text-ink underline-offset-2 hover:text-bronze hover:underline"
                >
                  {t(b.labelKey)}
                </Link>
                <span className="sr-only">
                  {b.clear
                    ? t("pages.dashboard.blockerDone")
                    : t("pages.dashboard.blockerOutstanding")}
                </span>
                <p className="mt-0.5 text-xs leading-relaxed text-muted">
                  {t(b.detailKey, b.detailVars)}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="admin-glass-panel admin-gold-rail mt-4 p-3.5 sm:p-4">
        <div className="mb-3 flex items-center justify-between gap-2">
          <h2 className="admin-section-label">
            {t("pages.dashboard.pipelineFunnel")}
          </h2>
          <Link href="/admin/pipeline" className="admin-label-link">
            {t("common.board")}
          </Link>
        </div>
        <div className="admin-funnel flex flex-wrap items-end gap-1.5 sm:gap-2">
          {funnel.map((f) => (
            <Link
              key={f.status}
              href="/admin/pipeline"
              className="admin-funnel-step group min-w-0 flex-1"
              title={`${quoteStatusLabel(locale, f.status)}: ${f.count}`}
            >
              <div
                className="admin-funnel-bar mx-auto rounded-t-md bg-gradient-to-t from-bronze-dark to-bronze-light transition group-hover:brightness-110"
                style={{
                  height: `${Math.max(12, Math.round((f.count / funnelMax) * 56))}px`,
                  width: "100%",
                  maxWidth: "4.5rem",
                }}
              />
              <p className="mt-1.5 text-center text-[0.625rem] font-bold uppercase tracking-wide text-muted">
                {quoteStatusLabel(locale, f.status)}
              </p>
              <p className="text-center text-xs font-semibold tabular-nums text-ink">
                {f.count}
              </p>
            </Link>
          ))}
        </div>
      </section>

      <div className="mt-4 grid gap-3 lg:grid-cols-5">
        <section className="lg:col-span-3">
          <div className="mb-2 flex items-center justify-between gap-3">
            <h2 className="admin-section-label">
              {t("pages.dashboard.recentQuotes")}
            </h2>
            <Link href="/admin/quotes" className="admin-label-link">
              {t("common.viewAll")}
            </Link>
          </div>
          {recent.length === 0 ? (
            <EmptyState
              title={t("pages.dashboard.emptyTitle")}
              description={t("pages.dashboard.emptyDesc")}
              action={
                <Link href="/quote" className="btn-primary text-sm">
                  {t("common.openQuoteForm")}
                </Link>
              }
            />
          ) : (
            <ul className="divide-y divide-[color:var(--admin-border)] overflow-hidden rounded-xl border border-[color:var(--admin-border)] bg-[var(--admin-panel)] shadow-[var(--admin-shadow)]">
              {recent.map((q) => (
                <li key={q.id}>
                  <Link
                    href={`/admin/quotes/${q.id}`}
                    className="flex flex-wrap items-center justify-between gap-2 px-3 py-2 text-sm transition hover:bg-[var(--admin-row-hover)] sm:px-3.5"
                  >
                    <div className="min-w-0">
                      <span className="font-semibold text-ink">{q.name}</span>
                      <span className="text-muted"> · {q.serviceType}</span>
                      <div className="text-[0.6875rem] text-muted-light">
                        {formatShortDate(q.createdAt)} · {q.address}
                      </div>
                    </div>
                    <StatusBadge
                      label={quoteStatusLabel(locale, q.status)}
                      tone={quoteStatusTone[q.status]}
                    />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="space-y-3 lg:col-span-2">
          <div>
            <div className="mb-2 flex items-center justify-between">
              <h2 className="admin-section-label">
                {t("pages.dashboard.invoices")}
              </h2>
              <Link href="/admin/invoices" className="admin-label-link">
                {t("common.all")}
              </Link>
            </div>
            <ul className="divide-y divide-[color:var(--admin-border)] overflow-hidden rounded-xl border border-[color:var(--admin-border)] bg-[var(--admin-panel)] shadow-[var(--admin-shadow)]">
              {recentInvoices.map((inv) => (
                <li key={inv.id}>
                  <Link
                    href={`/admin/invoices/${inv.id}`}
                    className="flex items-center justify-between gap-2 px-3 py-2 text-sm hover:bg-[var(--admin-row-hover)]"
                  >
                    <span className="font-semibold text-ink">{inv.number}</span>
                    <span className="text-xs text-muted">
                      {invoiceStatusLabel(locale, inv.status)}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <div className="mb-2 flex items-center justify-between">
              <h2 className="admin-section-label">
                {t("pages.dashboard.payments")}
              </h2>
              <Link href="/admin/payments" className="admin-label-link">
                {t("common.all")}
              </Link>
            </div>
            <ul className="divide-y divide-[color:var(--admin-border)] overflow-hidden rounded-xl border border-[color:var(--admin-border)] bg-[var(--admin-panel)] shadow-[var(--admin-shadow)]">
              {recentPayments.map((p) => (
                <li
                  key={p.id}
                  className="flex items-center justify-between gap-2 px-3 py-2 text-sm"
                >
                  <span className="text-ink">{p.invoiceNumber}</span>
                  <span className="font-medium tabular-nums text-ink">
                    {formatMoney(p.amountCents)}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Link
              href="/admin/templates"
              className="admin-card admin-card-interactive !p-3 text-center"
            >
              <p className="text-[0.625rem] font-bold uppercase tracking-wider text-bronze">
                {t("nav.templates")}
              </p>
              <p className="mt-1 text-xs text-muted">
                {t("pages.dashboard.templatesHint")}
              </p>
            </Link>
            <Link
              href="/admin/pricebook"
              className="admin-card admin-card-interactive !p-3 text-center"
            >
              <p className="text-[0.625rem] font-bold uppercase tracking-wider text-bronze">
                {t("nav.pricebook")}
              </p>
              <p className="mt-1 text-xs text-muted">
                {t("pages.dashboard.pricebookHint")}
              </p>
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
