"use client";

import EmptyState from "@/components/admin/EmptyState";
import StatusBadge from "@/components/admin/StatusBadge";
import { formatMoney, formatShortDate } from "@/lib/admin/format";
import {
  PAYMENT_METHODS,
  paymentStatusTone,
  type PaymentMethod,
  type PaymentStatus,
} from "@/lib/admin/status";
import type { InvoiceRecord, PaymentRecord } from "@/lib/db/types";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAdminI18n } from "@/components/admin/LocaleProvider";
import {
  invoiceStatusLabel,
  paymentMethodLabel,
  paymentStatusLabel,
} from "@/lib/admin/i18n";
import { useMemo, useState } from "react";

const PAYMENT_STATUSES: PaymentStatus[] = ["recorded", "pending", "failed"];

function filterClass(active: boolean): string {
  return `admin-touch rounded-md px-2.5 py-1.5 text-xs font-medium transition ${
    active
      ? "bg-bronze/12 text-bronze-dark dark:text-bronze-light"
      : "text-muted hover:bg-[var(--admin-panel)] hover:text-ink"
  }`;
}

export default function PaymentsPanel({
  payments,
  invoices,
  preselectInvoiceId,
  stripeCheckoutReady = false,
}: {
  payments: PaymentRecord[];
  invoices: InvoiceRecord[];
  preselectInvoiceId?: string | null;
  stripeCheckoutReady?: boolean;
}) {
  const router = useRouter();
  const { t, locale } = useAdminI18n();
  const openInvoices = useMemo(
    () => invoices.filter((i) => i.status !== "void" && i.status !== "paid"),
    [invoices],
  );

  const [invoiceId, setInvoiceId] = useState(
    preselectInvoiceId && invoices.some((i) => i.id === preselectInvoiceId)
      ? preselectInvoiceId
      : "",
  );
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState<PaymentMethod>("check");
  const [reference, setReference] = useState("");
  const [notes, setNotes] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{
    invoiceId?: string;
    amount?: string;
  }>({});
  const [touched, setTouched] = useState<{ invoiceId?: boolean; amount?: boolean }>(
    {},
  );
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<PaymentStatus | "all">("all");

  const statusCounts = useMemo(() => {
    const counts: Record<PaymentStatus | "all", number> = {
      all: payments.length,
      recorded: 0,
      pending: 0,
      failed: 0,
    };
    for (const p of payments) counts[p.status] += 1;
    return counts;
  }, [payments]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return payments.filter((p) => {
      if (statusFilter !== "all" && p.status !== statusFilter) return false;
      if (!q) return true;
      const hay = [
        p.invoiceNumber,
        p.customerName,
        p.reference,
        p.method,
        paymentMethodLabel(locale, p.method),
      ]
        .join(" ")
        .toLowerCase();
      return hay.includes(q);
    });
  }, [payments, query, statusFilter, locale]);

  function validate(vals = { invoiceId, amount }) {
    const next: { invoiceId?: string; amount?: string } = {};
    if (!vals.invoiceId) next.invoiceId = t("payments.selectInvoice");
    const dollars = Number.parseFloat(vals.amount);
    if (!Number.isFinite(dollars) || dollars <= 0) {
      next.amount = t("payments.amountInvalid");
    }
    return next;
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setOk(null);
    setTouched({ invoiceId: true, amount: true });
    const next = validate();
    setFieldErrors(next);
    if (Object.keys(next).length) {
      setError(t("payments.fixFields"));
      return;
    }
    const dollars = Number.parseFloat(amount);
    setBusy(true);
    try {
      const res = await fetch("/api/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          invoiceId,
          amountCents: Math.round(dollars * 100),
          method,
          reference,
          notes,
        }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) {
        setError(data.error || t("payments.recordFailed"));
        return;
      }
      setOk(t("payments.recordedOk"));
      setAmount("");
      setReference("");
      setNotes("");
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  async function startCheckout() {
    setError(null);
    setOk(null);
    setTouched({ invoiceId: true, amount: true });
    const next = validate();
    setFieldErrors(next);
    if (Object.keys(next).length) {
      setError(t("payments.fixFields"));
      return;
    }
    if (!stripeCheckoutReady) {
      setError(t("payments.stripeNotReady"));
      return;
    }
    const dollars = Number.parseFloat(amount);
    setBusy(true);
    try {
      const res = await fetch("/api/payments/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          invoiceId,
          amountCents: Math.round(dollars * 100),
        }),
      });
      const data = (await res.json()) as {
        error?: string;
        url?: string | null;
      };
      if (!res.ok) {
        setError(data.error || t("payments.checkoutFailed"));
        return;
      }
      if (!data.url) {
        setError(t("payments.checkoutFailed"));
        return;
      }
      window.location.href = data.url;
    } finally {
      setBusy(false);
    }
  }

  function clearFilters() {
    setQuery("");
    setStatusFilter("all");
  }

  return (
    <div className="space-y-4">
      <p className="text-[0.6875rem] leading-relaxed text-muted">
        <span
          className={`admin-settings-chip mr-1.5 ${
            stripeCheckoutReady
              ? "admin-settings-chip-ok"
              : "admin-settings-chip-info"
          }`}
        >
          {stripeCheckoutReady
            ? t("payments.stripeChipReady")
            : t("payments.stripeChipOff")}
        </span>
        {stripeCheckoutReady
          ? t("payments.stripeConnectedBody")
          : t("payments.stripeNotConnectedBody")}{" "}
        <Link
          href="/admin/settings#settings-platform"
          className="font-medium text-ink underline-offset-2 hover:underline"
        >
          {t("nav.settings")}
        </Link>
        .
      </p>

      <form
        onSubmit={submit}
        className="admin-glass-panel space-y-3 p-4 sm:p-5"
        noValidate
      >
        <h2 className="admin-card-title">{t("payments.recordTitle")}</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label htmlFor="pay-invoice" className="text-xs font-medium text-muted">
              {t("payments.invoice")}
            </label>
            <select
              id="pay-invoice"
              className={`field-input mt-1 text-sm ${
                touched.invoiceId && fieldErrors.invoiceId
                  ? "admin-field-invalid"
                  : ""
              }`}
              value={invoiceId}
              onChange={(e) => {
                setInvoiceId(e.target.value);
                setFieldErrors((f) => ({ ...f, invoiceId: undefined }));
              }}
              onBlur={() => {
                setTouched((prev) => ({ ...prev, invoiceId: true }));
                setFieldErrors((f) => ({ ...f, ...validate() }));
              }}
              aria-invalid={Boolean(touched.invoiceId && fieldErrors.invoiceId)}
              aria-describedby={
                touched.invoiceId && fieldErrors.invoiceId
                  ? "pay-invoice-err"
                  : undefined
              }
            >
              <option value="">{t("common.selectEllipsis")}</option>
              {(openInvoices.length ? openInvoices : invoices).map((inv) => (
                <option key={inv.id} value={inv.id}>
                  {inv.number} — {inv.customerName} (
                  {invoiceStatusLabel(locale, inv.status)})
                </option>
              ))}
            </select>
            {touched.invoiceId && fieldErrors.invoiceId && (
              <p id="pay-invoice-err" className="admin-field-error">
                {fieldErrors.invoiceId}
              </p>
            )}
          </div>
          <div>
            <label htmlFor="pay-amount" className="text-xs font-medium text-muted">
              {t("payments.amountUsd")}
            </label>
            <input
              id="pay-amount"
              type="number"
              min="0.01"
              step="0.01"
              inputMode="decimal"
              className={`field-input mt-1 text-sm ${
                touched.amount && fieldErrors.amount ? "admin-field-invalid" : ""
              }`}
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value);
                setFieldErrors((f) => ({ ...f, amount: undefined }));
              }}
              onBlur={() => {
                setTouched((prev) => ({ ...prev, amount: true }));
                setFieldErrors((f) => ({ ...f, ...validate() }));
              }}
              placeholder="0.00"
              aria-invalid={Boolean(touched.amount && fieldErrors.amount)}
              aria-describedby={
                touched.amount && fieldErrors.amount ? "pay-amount-err" : undefined
              }
              required
            />
            {touched.amount && fieldErrors.amount && (
              <p id="pay-amount-err" className="admin-field-error">
                {fieldErrors.amount}
              </p>
            )}
          </div>
          <div>
            <label htmlFor="pay-method" className="text-xs font-medium text-muted">
              {t("payments.method")}
            </label>
            <select
              id="pay-method"
              className="field-input mt-1 text-sm"
              value={method}
              onChange={(e) => setMethod(e.target.value as PaymentMethod)}
            >
              {PAYMENT_METHODS.map((m) => (
                <option key={m} value={m}>
                  {paymentMethodLabel(locale, m)}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="pay-ref" className="text-xs font-medium text-muted">
              {t("payments.reference")}
            </label>
            <input
              id="pay-ref"
              className="field-input mt-1 text-sm"
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              placeholder={t("payments.referencePh")}
            />
          </div>
          <div>
            <label htmlFor="pay-notes" className="text-xs font-medium text-muted">
              {t("payments.notes")}
            </label>
            <input
              id="pay-notes"
              className="field-input mt-1 text-sm"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={t("payments.notesPh")}
            />
          </div>
        </div>
        {error && (
          <p role="alert" className="text-xs font-medium text-danger">
            {error}
          </p>
        )}
        {ok && (
          <p
            role="status"
            className="text-xs font-medium text-emerald-700 dark:text-emerald-300"
          >
            {ok}
          </p>
        )}
        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
          <button
            type="submit"
            disabled={busy}
            className="admin-touch btn-primary w-full text-sm disabled:opacity-60 sm:w-auto"
          >
            {busy ? t("common.saving") : t("payments.recordPayment")}
          </button>
          {stripeCheckoutReady ? (
            <button
              type="button"
              disabled={busy}
              onClick={() => void startCheckout()}
              className="admin-touch btn-secondary w-full text-sm disabled:opacity-60 sm:w-auto"
            >
              {busy ? t("common.saving") : t("payments.collectDeposit")}
            </button>
          ) : null}
        </div>
      </form>

      {payments.length === 0 ? (
        <EmptyState
          title={t("payments.emptyTitle")}
          description={t("payments.emptyDesc")}
        />
      ) : (
        <>
          <div className="admin-toolbar flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-1">
              <button
                type="button"
                onClick={() => setStatusFilter("all")}
                className={filterClass(statusFilter === "all")}
                aria-pressed={statusFilter === "all"}
              >
                {t("common.all")} ({statusCounts.all})
              </button>
              {PAYMENT_STATUSES.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setStatusFilter(s)}
                  className={filterClass(statusFilter === s)}
                  aria-pressed={statusFilter === s}
                >
                  {paymentStatusLabel(locale, s)} ({statusCounts[s]})
                </button>
              ))}
            </div>
            <div className="relative min-w-0 flex-1 sm:max-w-xs">
              <label htmlFor="pay-search" className="sr-only">
                {t("payments.searchLabel")}
              </label>
              <input
                id="pay-search"
                type="search"
                placeholder={t("payments.searchPlaceholder")}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="field-input !mt-0 w-full py-2 text-sm"
              />
            </div>
          </div>

          {filtered.length === 0 ? (
            <EmptyState
              title={t("common.noMatches")}
              description={t("common.noMatchesDesc")}
              action={
                <button
                  type="button"
                  className="btn-secondary-light admin-touch text-sm"
                  onClick={clearFilters}
                >
                  {t("common.clearFilters")}
                </button>
              }
            />
          ) : (
            <>
              <ul className="admin-card-list space-y-2.5 md:hidden">
                {filtered.map((p) => (
                  <li key={p.id}>
                    <Link
                      href={`/admin/invoices/${p.invoiceId}`}
                      className="admin-mobile-card admin-touch block"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="font-semibold text-ink">{p.invoiceNumber}</p>
                          <p className="truncate text-sm text-muted">
                            {p.customerName}
                          </p>
                        </div>
                        <StatusBadge
                          label={paymentStatusLabel(locale, p.status)}
                          tone={paymentStatusTone[p.status]}
                        />
                      </div>
                      <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-sm">
                        <span className="font-medium tabular-nums text-ink">
                          {formatMoney(p.amountCents)}
                        </span>
                        <span className="text-xs text-muted">
                          {paymentMethodLabel(locale, p.method)}
                          <span className="text-ink/25"> · </span>
                          {formatShortDate(p.createdAt)}
                        </span>
                      </div>
                      {p.demo ? (
                        <span className="admin-settings-chip admin-settings-chip-warn mt-2">
                          {t("common.demoData")}
                        </span>
                      ) : null}
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="admin-table-wrap hidden overflow-hidden rounded-xl border border-[color:var(--admin-border)] bg-[var(--admin-panel)] md:block">
                <div className="overflow-x-auto">
                  <table className="admin-table min-w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-ink/10 text-[0.625rem] uppercase tracking-wider text-muted">
                        <th className="px-3 py-2.5 font-semibold sm:px-4">
                          {t("payments.colDate")}
                        </th>
                        <th className="px-3 py-2.5 font-semibold sm:px-4">
                          {t("payments.colInvoice")}
                        </th>
                        <th className="px-3 py-2.5 font-semibold sm:px-4">
                          {t("payments.colCustomer")}
                        </th>
                        <th className="px-3 py-2.5 font-semibold sm:px-4">
                          {t("payments.colAmount")}
                        </th>
                        <th className="hidden px-3 py-2.5 font-semibold lg:table-cell sm:px-4">
                          {t("payments.colMethod")}
                        </th>
                        <th className="px-3 py-2.5 font-semibold sm:px-4">
                          {t("payments.colStatus")}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map((p) => (
                        <tr
                          key={p.id}
                          className="border-b border-ink/5 align-top transition-colors last:border-0 hover:bg-[var(--admin-row-hover)]"
                        >
                          <td className="whitespace-nowrap px-3 py-3 text-muted sm:px-4">
                            {formatShortDate(p.createdAt)}
                            {p.demo && (
                              <div className="mt-1">
                                <span className="admin-settings-chip admin-settings-chip-warn">
                                  {t("common.demoData")}
                                </span>
                              </div>
                            )}
                          </td>
                          <td className="px-3 py-3 sm:px-4">
                            <Link
                              href={`/admin/invoices/${p.invoiceId}`}
                              className="font-semibold text-ink hover:underline"
                            >
                              {p.invoiceNumber}
                            </Link>
                            {p.reference && (
                              <div className="text-xs text-muted">{p.reference}</div>
                            )}
                          </td>
                          <td className="px-3 py-3 text-ink sm:px-4">
                            {p.customerName}
                          </td>
                          <td className="whitespace-nowrap px-3 py-3 font-medium tabular-nums text-ink sm:px-4">
                            {formatMoney(p.amountCents)}
                          </td>
                          <td className="hidden px-3 py-3 text-muted lg:table-cell sm:px-4">
                            {paymentMethodLabel(locale, p.method)}
                          </td>
                          <td className="px-3 py-3 sm:px-4">
                            <StatusBadge
                              label={paymentStatusLabel(locale, p.status)}
                              tone={paymentStatusTone[p.status]}
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}
