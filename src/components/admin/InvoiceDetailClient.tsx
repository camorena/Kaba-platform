"use client";

import StatusBadge from "@/components/admin/StatusBadge";
import { InvoiceStatusTimeline } from "@/components/admin/StatusTimeline";
import { useToast } from "@/components/admin/Toast";
import { formatDateTime, formatMoney } from "@/lib/admin/format";
import {
  INVOICE_STATUSES,
  invoiceStatusTone,
  type InvoiceStatus,
} from "@/lib/admin/status";
import type { InvoiceRecord } from "@/lib/admin/invoices-store";
import type { PaymentRecord } from "@/lib/admin/payments-store";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function InvoiceDetailClient({
  invoice,
  payments,
  paidCents,
}: {
  invoice: InvoiceRecord;
  payments: PaymentRecord[];
  paidCents: number;
}) {
  const router = useRouter();
  const toast = useToast();
  const [status, setStatus] = useState<InvoiceStatus>(invoice.status);
  const [busy, setBusy] = useState(false);
  const total = invoice.lines.reduce(
    (s, l) => s + l.quantity * l.unitCents,
    0,
  );
  const balance = Math.max(0, total - paidCents);

  async function changeStatus(next: InvoiceStatus) {
    setBusy(true);
    try {
      const res = await fetch(`/api/invoices/${invoice.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: next }),
      });
      if (!res.ok) {
        toast.push({ title: "Status update failed", tone: "error" });
        return;
      }
      setStatus(next);
      toast.push({ title: `Invoice → ${next}`, tone: "success" });
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  function printInvoice() {
    window.print();
  }

  return (
    <div className="invoice-print-root space-y-4">
      <div className="flex flex-wrap items-center gap-2 text-xs text-muted">
        <Link href="/admin/invoices" className="font-semibold hover:underline">
          ← Invoices
        </Link>
        <span aria-hidden>·</span>
        <span className="font-mono text-[0.6875rem]">{invoice.id}</span>
        {invoice.demo && (
          <span className="rounded bg-amber-500/15 px-1.5 py-0.5 text-[0.5625rem] font-bold uppercase tracking-wide text-amber-900 dark:text-amber-100">
            Demo data
          </span>
        )}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="font-display text-xl font-semibold tracking-tight text-ink sm:text-2xl">
              {invoice.number}
            </h1>
            <StatusBadge label={status} tone={invoiceStatusTone[status]} />
          </div>
          <p className="mt-1 text-sm text-muted">
            {invoice.customerName} · {invoice.address}
          </p>
        </div>
        <div className="flex flex-wrap gap-2 print:hidden">
          <button
            type="button"
            onClick={printInvoice}
            className="btn-secondary-light text-sm"
          >
            Print invoice
          </button>
          {invoice.quoteId && (
            <Link
              href={`/admin/quotes/${invoice.quoteId}`}
              className="btn-secondary-light text-sm"
            >
              Source quote
            </Link>
          )}
          <Link
            href={`/admin/payments?invoice=${invoice.id}`}
            className="btn-primary text-sm"
          >
            Record payment
          </Link>
        </div>
      </div>

      <section className="admin-glass-panel admin-gold-rail px-4 py-3 sm:px-5 print:hidden">
        <h2 className="admin-card-title mb-3">Progress</h2>
        <InvoiceStatusTimeline status={status} />
      </section>

      <div className="grid gap-3 sm:grid-cols-3">
        <div className="admin-stat">
          <p className="admin-stat-label">Total</p>
          <p className="admin-stat-value">{formatMoney(total)}</p>
        </div>
        <div className="admin-stat">
          <p className="admin-stat-label">Paid</p>
          <p className="admin-stat-value">{formatMoney(paidCents)}</p>
        </div>
        <div className="admin-stat">
          <p className="admin-stat-label">Balance</p>
          <p className="admin-stat-value">{formatMoney(balance)}</p>
        </div>
      </div>

      <div className="grid gap-3 lg:grid-cols-3">
        <section className="admin-card invoice-print-sheet lg:col-span-2">
          <h2 className="admin-card-title">Line items</h2>
          <div className="mt-3 overflow-x-auto">
            <table className="admin-table min-w-full text-left text-sm">
              <thead>
                <tr className="border-b border-ink/10 text-[0.625rem] uppercase tracking-wider text-muted">
                  <th className="py-2 pr-3 font-semibold">Description</th>
                  <th className="py-2 pr-3 font-semibold">Qty</th>
                  <th className="py-2 pr-3 font-semibold">Unit</th>
                  <th className="py-2 font-semibold">Amount</th>
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

        <section className="admin-card space-y-4">
          <div>
            <h2 className="admin-card-title">Status</h2>
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
                  {s}
                </option>
              ))}
            </select>
          </div>
          <dl className="admin-dl">
            <div>
              <dt>Email</dt>
              <dd>{invoice.customerEmail}</dd>
            </div>
            <div>
              <dt>Phone</dt>
              <dd>{invoice.customerPhone}</dd>
            </div>
            <div>
              <dt>Created</dt>
              <dd>{formatDateTime(invoice.createdAt)}</dd>
            </div>
          </dl>
          <div>
            <h2 className="admin-card-title">Payments</h2>
            {payments.length === 0 ? (
              <p className="mt-2 text-xs text-muted">None recorded yet.</p>
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
    </div>
  );
}
