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
import type { InvoiceRecord } from "@/lib/admin/invoices-store";
import type { QuoteRecord } from "@/lib/admin/quotes-store";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useAdminI18n } from "@/components/admin/LocaleProvider";
import { invoiceStatusLabel, quoteStatusLabel } from "@/lib/admin/i18n";

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
      <div className="admin-card">
        <h2 className="admin-card-title">Create from quote (demo)</h2>
        <p className="mt-1 text-xs text-muted">
          Generates a draft invoice with a <strong>synthetic demo amount</strong>.
          Not a real bid. No PDF/email yet.
        </p>
        <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-end">
          <div className="min-w-0 flex-1">
            <label htmlFor="from-quote" className="text-xs font-semibold text-muted">
              Quote
            </label>
            <select
              id="from-quote"
              className="field-input mt-1 text-sm"
              value={quoteId}
              onChange={(e) => setQuoteId(e.target.value)}
            >
              <option value="">Select…</option>
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
            Search invoices
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
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={exportCsv}
            disabled={filtered.length === 0}
            className="admin-chip disabled:opacity-40"
            title={t("invoices.exportTitle")}
          >
            {t("common.exportCsv")}
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter("all")}
            className={`admin-chip ${statusFilter === "all" ? "admin-chip-active" : ""}`}
          >
            All ({invoices.length})
          </button>
          {INVOICE_STATUSES.map((s) => {
            const count = invoices.filter((i) => i.status === s).length;
            return (
              <button
                key={s}
                type="button"
                onClick={() => setStatusFilter(s)}
                className={`admin-chip capitalize ${statusFilter === s ? "admin-chip-active" : ""}`}
              >
                {s} ({count})
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
                        {inv.demo && " · Demo"}
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
                    <span className="text-muted">Total</span>
                    <span className="font-semibold tabular-nums text-ink">
                      {formatMoney(total)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted">Balance</span>
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
                    <th className="px-3 py-2.5 font-semibold sm:px-4">Invoice</th>
                    <th className="px-3 py-2.5 font-semibold sm:px-4">Customer</th>
                    <th className="px-3 py-2.5 font-semibold sm:px-4">Total</th>
                    <th className="hidden px-3 py-2.5 font-semibold sm:table-cell sm:px-4">
                      Balance
                    </th>
                    <th className="px-3 py-2.5 font-semibold sm:px-4">Status</th>
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
                              <span className="ml-1.5 rounded bg-amber-500/15 px-1 py-0.5 text-[0.5625rem] font-bold uppercase tracking-wide text-amber-900 dark:text-amber-100">
                                Demo
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
