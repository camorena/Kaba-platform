"use client";

import ConfirmDialog from "@/components/admin/ConfirmDialog";
import CopyChip from "@/components/admin/CopyChip";
import StatusBadge from "@/components/admin/StatusBadge";
import { InvoiceStatusTimeline } from "@/components/admin/StatusTimeline";
import { useToast } from "@/components/admin/Toast";
import { useAdminI18n } from "@/components/admin/LocaleProvider";
import { invoiceStatusLabel } from "@/lib/admin/i18n";
import { formatDateTime, formatMoney } from "@/lib/admin/format";
import {
  INVOICE_STATUSES,
  invoiceStatusTone,
  type InvoiceStatus,
} from "@/lib/admin/status";
import type { InvoiceRecord, PaymentRecord } from "@/lib/db/types";
import { siteConfig } from "@/lib/site";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function InvoiceDetailClient({
  invoice,
  payments,
  paidCents,
  stripeCheckoutReady = false,
}: {
  invoice: InvoiceRecord;
  payments: PaymentRecord[];
  paidCents: number;
  stripeCheckoutReady?: boolean;
}) {
  const router = useRouter();
  const toast = useToast();
  const { t, locale } = useAdminI18n();
  const [status, setStatus] = useState<InvoiceStatus>(invoice.status);
  const [busy, setBusy] = useState(false);
  const [confirmVoid, setConfirmVoid] = useState(false);
  const [checkoutBusy, setCheckoutBusy] = useState(false);
  const [shareBusy, setShareBusy] = useState(false);

  const payPath = `/pay/${encodeURIComponent(invoice.payToken)}`;
  const total = invoice.lines.reduce(
    (s, l) => s + l.quantity * l.unitCents,
    0,
  );
  const balance = Math.max(0, total - paidCents);

  async function changeStatus(next: InvoiceStatus) {
    if (next === "void" && status !== "void") {
      setConfirmVoid(true);
      return;
    }
    await applyStatus(next);
  }

  async function applyStatus(next: InvoiceStatus) {
    setBusy(true);
    try {
      const res = await fetch(`/api/invoices/${invoice.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: next }),
      });
      if (!res.ok) {
        toast.push({ title: t("common.statusUpdateFailed"), tone: "error" });
        return;
      }
      setStatus(next);
      toast.push({ title: t("detail.invoiceArrow", { status: invoiceStatusLabel(locale, next) }), tone: "success" });
      router.refresh();
    } finally {
      setBusy(false);
      setConfirmVoid(false);
    }
  }

  function printInvoice() {
    window.print();
  }

  async function collectDeposit() {
    if (!stripeCheckoutReady || balance <= 0) return;
    setCheckoutBusy(true);
    try {
      const res = await fetch("/api/payments/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ invoiceId: invoice.id }),
      });
      const data = (await res.json()) as { error?: string; url?: string | null };
      if (!res.ok || !data.url) {
        toast.push({
          title: data.error || t("payments.checkoutFailed"),
          tone: "error",
        });
        return;
      }
      window.location.href = data.url;
    } finally {
      setCheckoutBusy(false);
    }
  }

  async function sharePayLink() {
    const url =
      typeof window !== "undefined"
        ? `${window.location.origin}${payPath}`
        : payPath;
    setShareBusy(true);
    try {
      if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
        await navigator.share({
          title: `${invoice.number} · ${t("detail.payLinkShareTitle")}`,
          text: t("detail.payLinkShareText", { number: invoice.number }),
          url,
        });
        toast.push({ title: t("detail.payLinkShared"), tone: "success" });
        return;
      }
      await navigator.clipboard.writeText(url);
      toast.push({ title: t("common.copied"), tone: "success" });
    } catch (err) {
      // User abort on share is fine
      if (err instanceof DOMException && err.name === "AbortError") return;
      try {
        await navigator.clipboard.writeText(url);
        toast.push({ title: t("common.copied"), tone: "success" });
      } catch {
        toast.push({ title: t("common.copyFailed"), tone: "error" });
      }
    } finally {
      setShareBusy(false);
    }
  }

  const summary = `${invoice.number} · ${invoice.customerName} · Total ${formatMoney(total)} · Paid ${formatMoney(paidCents)} · Balance ${formatMoney(balance)}`;

  return (
    <div className="invoice-print-root space-y-4">
      <div className="flex flex-wrap items-center gap-2 text-xs text-muted print:hidden">
        <Link href="/admin/invoices" className="font-semibold hover:underline">
          ← {t("detail.backInvoices")}
        </Link>
        <span aria-hidden>·</span>
        <span className="font-mono text-[0.6875rem]">{invoice.id}</span>
        {invoice.demo && (
          <span className="rounded bg-amber-500/15 px-1.5 py-0.5 text-[0.5625rem] font-bold uppercase tracking-wide text-amber-900 dark:text-amber-100">
            {t("common.demoData")}
          </span>
        )}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="font-display text-xl font-semibold tracking-tight text-ink sm:text-2xl">
              {invoice.number}
            </h1>
            <StatusBadge label={invoiceStatusLabel(locale, status)} tone={invoiceStatusTone[status]} />
          </div>
          <p className="mt-1 text-sm text-muted">
            {invoice.customerName} · {invoice.address}
          </p>
        </div>
        <div className="admin-detail-actions flex flex-wrap gap-2 print:hidden">
          <button
            type="button"
            onClick={printInvoice}
            className="btn-secondary-light text-sm"
          >
            {t("detail.printInvoice")}
          </button>
          {invoice.quoteId && (
            <Link
              href={`/admin/quotes/${invoice.quoteId}`}
              className="btn-secondary-light text-sm"
            >
              {t("detail.sourceQuote")}
            </Link>
          )}
          <Link
            href={`/admin/payments?invoice=${invoice.id}`}
            className="btn-primary text-sm"
          >
            {t("payments.recordPayment")}
          </Link>
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5 print:hidden">
        <CopyChip value={summary} label={t("common.copySummary")} />
        <CopyChip value={invoice.customerEmail} label={t("common.copyEmail")} />
        <CopyChip value={invoice.customerPhone} label={t("common.copyPhone")} />
        {invoice.payToken ? (
          <>
            <CopyChip
              value={
                typeof window !== "undefined"
                  ? `${window.location.origin}${payPath}`
                  : payPath
              }
              label={t("detail.copyPayLink")}
            />
            <button
              type="button"
              disabled={shareBusy}
              className="admin-chip"
              onClick={() => void sharePayLink()}
            >
              {t("detail.sharePayLink")}
            </button>
          </>
        ) : null}
        {balance > 0 && status !== "paid" && status !== "void" && (
          <button
            type="button"
            disabled={busy}
            className="admin-chip"
            onClick={() => void changeStatus("sent")}
          >
            {t("detail.sendInvoice")}
          </button>
        )}
      </div>

      {balance > 0 && (
        <div className="admin-flow-hint rounded-xl border border-bronze/20 bg-bronze/5 px-3 py-2.5 text-xs leading-relaxed text-muted print:hidden sm:px-4">
          <strong className="font-semibold text-ink">{t("detail.balanceDueTitle")}</strong>{" "}
          {formatMoney(balance)}. {t("detail.balanceDueBody")}
        </div>
      )}

      <section className="admin-glass-panel admin-gold-rail px-4 py-3 sm:px-5 print:hidden">
        <h2 className="admin-card-title mb-3">{t("detail.progress")}</h2>
        <InvoiceStatusTimeline status={status} />
      </section>

      <div className="grid gap-2 sm:grid-cols-3">
        <div className="admin-stat admin-stat-dense">
          <p className="admin-stat-label">{t("detail.total")}</p>
          <p className="admin-stat-value">{formatMoney(total)}</p>
        </div>
        <div className="admin-stat admin-stat-dense">
          <p className="admin-stat-label">{t("detail.paid")}</p>
          <p className="admin-stat-value">{formatMoney(paidCents)}</p>
        </div>
        <div className="admin-stat admin-stat-dense">
          <p className="admin-stat-label">{t("detail.balance")}</p>
          <p className="admin-stat-value">{formatMoney(balance)}</p>
        </div>
      </div>


      <section className="invoice-print-letterhead hidden print:block">
        <div className="flex items-start justify-between gap-4 border-b-2 border-[#c08b3a] pb-4">
          <div>
            <p className="font-display text-2xl font-semibold tracking-tight text-[#0b111a]">
              {siteConfig.name}
            </p>
            <p className="mt-1 text-xs text-[#5c6570]">{siteConfig.tagline}</p>
            <p className="mt-2 text-xs text-[#5c6570]">
              {siteConfig.address.region} · {siteConfig.phone}
            </p>
            <p className="text-xs text-[#5c6570]">{siteConfig.email}</p>
          </div>
          <div className="text-right">
            <p className="text-[0.625rem] font-bold uppercase tracking-[0.14em] text-[#c08b3a]">
              {t("pages.invoices.title")}
            </p>
            <p className="mt-1 font-display text-xl font-semibold text-[#0b111a]">
              {invoice.number}
            </p>
            <p className="mt-1 text-xs text-[#5c6570]">
              {t("detail.status")}: {invoiceStatusLabel(locale, status)}
            </p>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-4 text-xs text-[#0b111a]">
          <div>
            <p className="font-bold uppercase tracking-wider text-[#5c6570]">{t("detail.billTo")}</p>
            <p className="mt-1 font-semibold">{invoice.customerName}</p>
            <p>{invoice.address}</p>
            <p>{invoice.customerEmail}</p>
            <p>{invoice.customerPhone}</p>
          </div>
          <div className="text-right">
            <p><span className="text-[#5c6570]">{t("detail.total")}</span> · {formatMoney(total)}</p>
            <p><span className="text-[#5c6570]">{t("detail.paid")}</span> · {formatMoney(paidCents)}</p>
            <p className="font-semibold"><span className="text-[#5c6570]">{t("detail.balance")}</span> · {formatMoney(balance)}</p>
          </div>
        </div>
      </section>

      <div className="grid gap-3 lg:grid-cols-3">
        <section className="admin-card invoice-print-sheet lg:col-span-2">
          <h2 className="admin-card-title">{t("detail.lineItems")}</h2>
          <div className="mt-3 overflow-x-auto">
            <table className="admin-table min-w-full text-left text-sm">
              <thead>
                <tr className="border-b border-ink/10 text-[0.625rem] uppercase tracking-wider text-muted">
                  <th className="py-2 pr-3 font-semibold">{t("detail.descriptionCol")}</th>
                  <th className="py-2 pr-3 font-semibold">{t("detail.qty")}</th>
                  <th className="py-2 pr-3 font-semibold">{t("detail.unitPrice")}</th>
                  <th className="py-2 font-semibold">{t("detail.amount")}</th>
                </tr>
              </thead>
              <tbody>
                {invoice.lines.map((l) => (
                  <tr key={l.id} className="border-b border-ink/5 last:border-0">
                    <td className="py-2.5 pr-3 text-ink">{l.description}</td>
                    <td className="py-2.5 pr-3 tabular-nums text-muted">
                      {l.quantity}
                    </td>
                    <td className="py-2.5 pr-3 tabular-nums text-muted">
                      {formatMoney(l.unitCents)}
                    </td>
                    <td className="py-2.5 font-medium tabular-nums text-ink">
                      {formatMoney(l.quantity * l.unitCents)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {invoice.notes && (
            <p className="mt-3 rounded-lg bg-ivory-muted/60 p-3 text-xs leading-relaxed text-muted dark:bg-ivory-muted/30">
              {invoice.notes}
            </p>
          )}
        </section>

        <section className="admin-card space-y-4 print:hidden">
          <div>
            <h2 className="admin-card-title">{t("detail.status")}</h2>
            <select
              className="field-input mt-2 text-sm"
              value={status}
              disabled={busy}
              onChange={(e) =>
                void changeStatus(e.target.value as InvoiceStatus)
              }
            >
              {INVOICE_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {invoiceStatusLabel(locale, s)}
                </option>
              ))}
            </select>
          </div>
          <dl className="admin-dl">
            <div>
              <dt>{t("detail.email")}</dt>
              <dd>{invoice.customerEmail}</dd>
            </div>
            <div>
              <dt>{t("detail.phone")}</dt>
              <dd>{invoice.customerPhone}</dd>
            </div>
            <div>
              <dt>{t("detail.created")}</dt>
              <dd>{formatDateTime(invoice.createdAt)}</dd>
            </div>
          </dl>
          <div>
            <h2 className="admin-card-title">{t("detail.payments")}</h2>
            {invoice.payToken ? (
              <p className="mt-2 text-[0.6875rem] leading-relaxed text-muted">
                {t("detail.payLinkHint")}{" "}
                <a
                  href={payPath}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-bronze-dark hover:underline dark:text-bronze-light"
                >
                  {payPath}
                </a>
              </p>
            ) : null}
            {stripeCheckoutReady && balance > 0 && status !== "void" ? (
              <button
                type="button"
                disabled={checkoutBusy || busy}
                onClick={() => void collectDeposit()}
                className="btn-secondary mt-2 w-full text-sm disabled:opacity-60"
              >
                {checkoutBusy
                  ? t("common.saving")
                  : t("detail.collectDeposit")}
              </button>
            ) : !stripeCheckoutReady ? (
              <p className="mt-2 text-[0.6875rem] leading-relaxed text-muted">
                {t("detail.stripeNotConnected")}
              </p>
            ) : null}
            {payments.length === 0 ? (
              <div className="mt-2 rounded-lg border border-dashed border-ink/12 px-3 py-4 text-center">
                <p className="text-xs text-muted">{t("detail.noneRecorded")}</p>
                <Link
                  href={`/admin/payments?invoice=${invoice.id}`}
                  className="mt-2 inline-block text-xs font-semibold text-bronze-dark hover:underline dark:text-bronze-light"
                >
                  {t("detail.recordFirstPayment")}
                </Link>
              </div>
            ) : (
              <ul className="mt-2 divide-y divide-ink/8">
                {payments.map((p) => (
                  <li key={p.id} className="flex justify-between gap-2 py-2 text-xs">
                    <span className="text-muted">
                      {formatDateTime(p.createdAt)}
                      <span className="ml-1 capitalize">· {p.method}</span>
                    </span>
                    <span className="font-semibold tabular-nums text-ink">
                      {formatMoney(p.amountCents)}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      </div>
      <ConfirmDialog
        open={confirmVoid}
        title={t("detail.voidTitle")}
        description={t("detail.voidDesc")}
        confirmLabel={t("detail.voidConfirm")}
        tone="danger"
        busy={busy}
        onCancel={() => setConfirmVoid(false)}
        onConfirm={() => void applyStatus("void")}
      />
    </div>
  );
}
