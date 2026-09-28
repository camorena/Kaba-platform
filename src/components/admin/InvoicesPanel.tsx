"use client";

import EmptyState from "@/components/admin/EmptyState";
import StatusBadge from "@/components/admin/StatusBadge";
import { downloadCsv } from "@/lib/admin/csv";
import { formatMoney, formatShortDate } from "@/lib/admin/format";
import { useToast } from "@/components/admin/Toast";
import {
  INVOICE_STATUSES,
  invoiceStatusTone,
  type InvoiceStatus,
} from "@/lib/admin/status";
import type { InvoiceRecord, QuoteRecord } from "@/lib/db/types";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useAdminI18n } from "@/components/admin/LocaleProvider";
import { invoiceStatusLabel } from "@/lib/admin/i18n";

export default function InvoicesPanel({
  invoices,
  paidMap,
  quotesForCreate,
}: {
  invoices: InvoiceRecord[];
  paidMap: Record<string, number>;
  quotesForCreate: QuoteRecord[];
}) {
  const router = useRouter();
  const toast = useToast();
  const { t, locale } = useAdminI18n();
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<InvoiceStatus | "all">("all");
  const [quoteId, setQuoteId] = useState("");
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return invoices.filter((row) => {
      if (statusFilter !== "all" && row.status !== statusFilter) return false;
      if (!q) return true;
      const hay = [
        row.number,
        row.customerName,
        row.customerEmail,
        row.address,
        row.notes,
      ]
        .join(" ")
        .toLowerCase();
      return hay.includes(q);
    });
  }, [invoices, query, statusFilter, paidMap]);

  function exportCsv() {
    const rows: (string | number)[][] = [
      t("invoices.csvHeaders").split(","),
      ...filtered.map((inv) => {
        const total = inv.lines.reduce((s, l) => s + l.quantity * l.unitCents, 0);
        const paid = paidMap[inv.id] ?? 0;
        return [
          inv.number,
          inv.customerName,
          inv.customerEmail,
          inv.address,
          (total / 100).toFixed(2),
          (paid / 100).toFixed(2),
          (Math.max(0, total - paid) / 100).toFixed(2),
          inv.status,
          formatShortDate(inv.createdAt),
        ];
      }),
    ];
    downloadCsv(`kaba-invoices-${new Date().toISOString().slice(0, 10)}.csv`, rows);
    toast.push({
      title: t(filtered.length === 1 ? "common.csvExportedInvoices" : "common.csvExportedInvoices_plural", { count: filtered.length }),
      tone: "success",
    });
  }

  async function createFromQuote() {
    if (!quoteId) {
      setError(t("invoices.pickQuoteFirst"));
      return;
    }
    setCreating(true);
    setError(null);
    try {
      const res = await fetch("/api/invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quoteId }),
      });
      const data = (await res.json()) as {
        invoice?: { id: string };
        error?: string;
      };
      if (!res.ok || !data.invoice) {
        setError(data.error || t("invoices.createFailed"));
        return;
      }
      router.push(`/admin/invoices/${data.invoice.id}`);
      router.refresh();
    } finally {
      setCreating(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="admin-glass-panel p-4 sm:p-5">
        <h2 className="admin-card-title">{t("invoices.createFrom")}</h2>
        <p className="mt-1.5 text-xs leading-relaxed text-muted">
          {t("invoices.createFromHint")}
        </p>
        <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-end">
          <div className="min-w-0 flex-1">
            <label htmlFor="from-quote" className="text-xs font-semibold text-muted">
              {t("invoices.quoteLabel")}
            </label>
            <select
              id="from-quote"
              className="field-input mt-1 text-sm"
              value={quoteId}
              onChange={(e) => setQuoteId(e.target.value)}
            >
              <option value="">{t("common.selectEllipsis")}</option>
              {quotesForCreate.map((q) => (
                <option key={q.id} value={q.id}>
                  {q.name} — {q.serviceType} ({q.status})
                </option>
              ))}
            </select>
          </div>
          <button
            type="button"
            disabled={creating}
            onClick={() => void createFromQuote()}
            className="btn-primary shrink-0 text-sm disabled:opacity-60"
          >
            {creating ? t("common.creating") : t("invoices.createDraft")}
          </button>
        </div>
        {error && (
          <p role="alert" className="mt-2 text-xs font-medium text-danger">
            {error}
          </p>
        )}
      </div>

      <div className="admin-toolbar flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative min-w-0 flex-1 sm:max-w-xs">
          <label htmlFor="inv-search" className="sr-only">
            {t("invoices.searchLabel")}
          </label>
          <input
            id="inv-search"
            type="search"
            placeholder={t("invoices.searchPlaceholder")}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="field-input !mt-0 py-2 text-sm"
          />
        </div>
        <div className="flex flex-wrap items-center gap-1">
          <button
            type="button"
            onClick={exportCsv}
            disabled={filtered.length === 0}
            className="admin-touch rounded-md px-2.5 py-1.5 text-xs font-medium text-muted transition hover:bg-[var(--admin-panel)] hover:text-ink disabled:opacity-40"
            title={t("invoices.exportTitle")}
          >
            {t("common.exportCsv")}
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter("all")}
            className={`admin-touch rounded-md px-2.5 py-1.5 text-xs font-medium transition ${
              statusFilter === "all"
                ? "bg-bronze/12 text-bronze-dark dark:text-bronze-light"
                : "text-muted hover:bg-[var(--admin-panel)] hover:text-ink"
            }`}
          >
            {t("invoices.allCount", { count: invoices.length })}
          </button>
          {INVOICE_STATUSES.map((s) => {
            const count = invoices.filter((i) => i.status === s).length;
            return (
              <button
                key={s}
                type="button"
                onClick={() => setStatusFilter(s)}
                className={`admin-touch rounded-md px-2.5 py-1.5 text-xs font-medium transition ${
                  statusFilter === s
                    ? "bg-bronze/12 text-bronze-dark dark:text-bronze-light"
                    : "text-muted hover:bg-[var(--admin-panel)] hover:text-ink"
                }`}
              >
                {invoiceStatusLabel(locale, s)} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {invoices.length === 0 ? (
        <EmptyState
          title={t("invoices.emptyTitle")}
          description={t("invoices.emptyDesc")}
        />
      ) : filtered.length === 0 ? (
        <EmptyState
          title={t("common.noMatches")}
          description={t("common.noMatchesDesc")}
        />
      ) : (
        <>
          <ul className="admin-card-list space-y-2.5 md:hidden">
            {filtered.map((inv) => {
              const total = inv.lines.reduce(
                (s, l) => s + l.quantity * l.unitCents,
                0,
              );
              const paid = paidMap[inv.id] ?? 0;
              const balance = Math.max(0, total - paid);
              return (
                <li key={inv.id} className="admin-mobile-card">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div className="min-w-0">
                      <Link
                        href={`/admin/invoices/${inv.id}`}
                        className="font-semibold text-ink hover:text-bronze-dark hover:underline dark:hover:text-bronze-light"
                      >
                        {inv.number}
                      </Link>
                      <p className="mt-0.5 text-xs text-muted">
                        {formatShortDate(inv.createdAt)}
                        {inv.demo && ` · ${t("common.demoData")}`}
                      </p>
                    </div>
                    <StatusBadge
                      label={invoiceStatusLabel(locale, inv.status)}
                      tone={invoiceStatusTone[inv.status]}
                    />
                  </div>
                  <p className="mt-2 text-sm font-medium text-ink">
                    {inv.customerName}
                  </p>
                  <p className="text-xs text-muted">{inv.address}</p>
                  <div className="mt-2.5 flex justify-between text-sm">
                    <span className="text-muted">{t("invoices.colTotal")}</span>
                    <span className="font-semibold tabular-nums text-ink">
                      {formatMoney(total)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted">{t("invoices.colBalance")}</span>
                    <span className="tabular-nums text-muted">
                      {formatMoney(balance)}
                    </span>
                  </div>
                </li>
              );
            })}
          </ul>

          <div className="admin-table-wrap hidden overflow-hidden rounded-xl border border-[color:var(--admin-border)] bg-[var(--admin-panel)] shadow-[var(--admin-shadow)] md:block">
            <div className="overflow-x-auto">
              <table className="admin-table min-w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-[color:var(--admin-border)]">
                    <th className="px-3 py-2.5 font-semibold sm:px-4">{t("invoices.colNumber")}</th>
                    <th className="px-3 py-2.5 font-semibold sm:px-4">{t("invoices.colCustomer")}</th>
                    <th className="px-3 py-2.5 font-semibold sm:px-4">{t("invoices.colTotal")}</th>
                    <th className="hidden px-3 py-2.5 font-semibold sm:table-cell sm:px-4">
                      {t("invoices.colBalance")}
                    </th>
                    <th className="px-3 py-2.5 font-semibold sm:px-4">{t("invoices.colStatus")}</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((inv) => {
                    const total = inv.lines.reduce(
                      (s, l) => s + l.quantity * l.unitCents,
                      0,
                    );
                    const paid = paidMap[inv.id] ?? 0;
                    const balance = Math.max(0, total - paid);
                    return (
                      <tr
                        key={inv.id}
                        className="border-b border-[color:var(--admin-border)]/60 align-top transition-colors last:border-0 hover:bg-[var(--admin-row-hover)]"
                      >
                        <td className="px-3 py-3 sm:px-4">
                          <Link
                            href={`/admin/invoices/${inv.id}`}
                            className="font-semibold text-ink hover:text-bronze-dark hover:underline dark:hover:text-bronze-light"
                          >
                            {inv.number}
                          </Link>
                          <div className="mt-0.5 text-xs text-muted">
                            {formatShortDate(inv.createdAt)}
                            {inv.demo && (
                              <span className="ml-1.5 admin-settings-chip admin-settings-chip-warn">
                                {t("common.demoData")}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-3 py-3 sm:px-4">
                          <div className="font-medium text-ink">
                            {inv.customerName}
                          </div>
                          <div className="text-xs text-muted">{inv.address}</div>
                        </td>
                        <td className="whitespace-nowrap px-3 py-3 font-medium tabular-nums text-ink sm:px-4">
                          {formatMoney(total)}
                        </td>
                        <td className="hidden whitespace-nowrap px-3 py-3 tabular-nums text-muted sm:table-cell sm:px-4">
                          {formatMoney(balance)}
                        </td>
                        <td className="px-3 py-3 sm:px-4">
                          <StatusBadge
                            label={invoiceStatusLabel(locale, inv.status)}
                            tone={invoiceStatusTone[inv.status]}
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
