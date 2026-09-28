"use client";

import { formatMoney } from "@/lib/admin/format";
import type { InvoiceRecord } from "@/lib/db/types";
import type { PaymentReceiptStub } from "@/lib/pay/receipt";
import {
  getPayMessages,
  type PayLocale,
} from "@/lib/pay/messages";
import { siteConfig } from "@/lib/site";
import { useMemo, useState } from "react";

export type PayPageContact = {
  phone: string;
  phoneHref: string;
  email: string;
  emailHref: string;
};

export default function PayPageClient({
  token,
  invoice,
  paidCents,
  depositCents,
  stripeCheckoutReady,
  checkoutState,
  receipt,
  contact = {
    phone: siteConfig.phone,
    phoneHref: siteConfig.phoneHref,
    email: siteConfig.email,
    emailHref: siteConfig.emailHref,
  },
}: {
  token: string;
  invoice: InvoiceRecord;
  paidCents: number;
  depositCents: number;
  stripeCheckoutReady: boolean;
  checkoutState: "idle" | "success" | "cancel";
  receipt: PaymentReceiptStub | null;
  contact?: PayPageContact;
}) {
  const [locale, setLocale] = useState<PayLocale>("en");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const m = useMemo(() => getPayMessages(locale), [locale]);

  const total = invoice.lines.reduce(
    (s, l) => s + l.quantity * l.unitCents,
    0,
  );
  const balance = Math.max(0, total - paidCents);
  const canPay =
    stripeCheckoutReady &&
    balance > 0 &&
    invoice.status !== "void" &&
    invoice.status !== "paid";

  async function startCheckout() {
    if (!canPay || busy) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`/api/pay/${encodeURIComponent(token)}/checkout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      const data = (await res.json()) as { error?: string; url?: string | null };
      if (!res.ok || !data.url) {
        setError(data.error || m.checkoutFailed);
        return;
      }
      window.location.href = data.url;
    } catch {
      setError(m.checkoutFailed);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-[0.625rem] font-bold uppercase tracking-[0.14em] text-bronze-dark dark:text-bronze-light">
            {m.brandPay}
          </p>
          <h1 className="mt-1 font-display text-2xl font-semibold tracking-tight text-ink">
            {m.invoiceLabel} {invoice.number}
          </h1>
          <p className="mt-1 text-sm text-muted">
            {m.forCustomer}{" "}
            <span className="font-medium text-ink">{invoice.customerName}</span>
            {invoice.address ? ` · ${invoice.address}` : null}
          </p>
          <p className="mt-2 text-[0.6875rem] text-muted">{m.secureNote}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {invoice.demo && (
            <span className="rounded bg-amber-500/15 px-1.5 py-0.5 text-[0.5625rem] font-bold uppercase tracking-wide text-amber-900 dark:text-amber-100">
              {m.demoBadge}
            </span>
          )}
          <div
            className="inline-flex rounded-full border border-ink/12 p-0.5 text-[0.6875rem] font-semibold"
            role="group"
            aria-label="Language"
          >
            <button
              type="button"
              className={`rounded-full px-2.5 py-1 ${locale === "en" ? "bg-navy text-ivory" : "text-muted hover:text-ink"}`}
              onClick={() => setLocale("en")}
            >
              {m.langEn}
            </button>
            <button
              type="button"
              className={`rounded-full px-2.5 py-1 ${locale === "es" ? "bg-navy text-ivory" : "text-muted hover:text-ink"}`}
              onClick={() => setLocale("es")}
            >
              {m.langEs}
            </button>
          </div>
        </div>
      </div>

      {checkoutState === "success" && (
        <div
          className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-ink"
          role="status"
        >
          <p className="font-semibold">{m.successTitle}</p>
          <p className="mt-1 text-muted">{m.successBody}</p>
        </div>
      )}
      {checkoutState === "cancel" && (
        <div
          className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-ink"
          role="status"
        >
          <p className="font-semibold">{m.cancelTitle}</p>
          <p className="mt-1 text-muted">{m.cancelBody}</p>
        </div>
      )}

      {receipt && (
        <section className="rounded-xl border border-ink/10 bg-ivory-muted/40 px-4 py-4 dark:bg-ivory-muted/10">
          <h2 className="font-display text-base font-semibold text-ink">
            {m.receiptTitle}
          </h2>
          <p className="mt-1 text-[0.6875rem] text-muted">{m.receiptStubNote}</p>
          <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-[0.625rem] uppercase tracking-wider text-muted">
                #
              </dt>
              <dd className="font-mono text-ink">{receipt.receiptNumber}</dd>
            </div>
            <div>
              <dt className="text-[0.625rem] uppercase tracking-wider text-muted">
                {m.receiptAmount}
              </dt>
              <dd className="font-semibold tabular-nums text-ink">
                {formatMoney(receipt.amountCents)}
              </dd>
            </div>
            <div>
              <dt className="text-[0.625rem] uppercase tracking-wider text-muted">
                {m.receiptMethod}
              </dt>
              <dd className="capitalize text-ink">{receipt.method}</dd>
            </div>
            <div>
              <dt className="text-[0.625rem] uppercase tracking-wider text-muted">
                {m.receiptRef}
              </dt>
              <dd className="font-mono text-xs text-ink">{receipt.reference}</dd>
            </div>
          </dl>
        </section>
      )}

      <div className="grid gap-2 sm:grid-cols-3">
        <div className="rounded-xl border border-ink/10 bg-white/60 px-4 py-3 dark:bg-ink/20">
          <p className="text-[0.625rem] font-bold uppercase tracking-wider text-muted">
            {m.total}
          </p>
          <p className="mt-1 font-display text-xl font-semibold tabular-nums text-ink">
            {formatMoney(total)}
          </p>
        </div>
        <div className="rounded-xl border border-ink/10 bg-white/60 px-4 py-3 dark:bg-ink/20">
          <p className="text-[0.625rem] font-bold uppercase tracking-wider text-muted">
            {m.paid}
          </p>
          <p className="mt-1 font-display text-xl font-semibold tabular-nums text-ink">
            {formatMoney(paidCents)}
          </p>
        </div>
        <div className="rounded-xl border border-bronze/25 bg-bronze/5 px-4 py-3">
          <p className="text-[0.625rem] font-bold uppercase tracking-wider text-muted">
            {m.balance}
          </p>
          <p className="mt-1 font-display text-xl font-semibold tabular-nums text-ink">
            {formatMoney(balance)}
          </p>
        </div>
      </div>

      <section className="overflow-hidden rounded-xl border border-ink/10 bg-white/70 dark:bg-ink/20">
        <div className="border-b border-ink/8 px-4 py-3">
          <h2 className="text-sm font-semibold text-ink">{m.lineItems}</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="border-b border-ink/8 text-[0.625rem] uppercase tracking-wider text-muted">
                <th className="px-4 py-2 font-semibold">{m.description}</th>
                <th className="px-4 py-2 font-semibold">{m.qty}</th>
                <th className="px-4 py-2 font-semibold">{m.amount}</th>
              </tr>
            </thead>
            <tbody>
              {invoice.lines.map((l) => (
                <tr key={l.id} className="border-b border-ink/5 last:border-0">
                  <td className="px-4 py-2.5 text-ink">{l.description}</td>
                  <td className="px-4 py-2.5 tabular-nums text-muted">
                    {l.quantity}
                  </td>
                  <td className="px-4 py-2.5 font-medium tabular-nums text-ink">
                    {formatMoney(l.quantity * l.unitCents)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="rounded-xl border border-ink/10 px-4 py-4 sm:px-5">
        {invoice.status === "void" ? (
          <div>
            <p className="font-semibold text-ink">{m.voidTitle}</p>
            <p className="mt-1 text-sm text-muted">{m.voidBody}</p>
          </div>
        ) : invoice.status === "paid" || balance <= 0 ? (
          <p className="font-semibold text-ink">
            {balance <= 0 ? m.paidInFull : m.noBalance}
          </p>
        ) : stripeCheckoutReady ? (
          <div className="space-y-3">
            <p className="text-sm text-muted">
              {m.depositSuggested}:{" "}
              <strong className="tabular-nums text-ink">
                {formatMoney(depositCents)}
              </strong>
            </p>
            <button
              type="button"
              disabled={busy || !canPay}
              onClick={() => void startCheckout()}
              className="inline-flex w-full items-center justify-center rounded-full bg-bronze px-5 py-3 text-sm font-semibold text-navy shadow-sm transition hover:bg-bronze-light disabled:opacity-60 sm:w-auto"
            >
              {busy ? m.paying : m.payDeposit}
            </button>
            {error && (
              <p className="text-sm text-red-700 dark:text-red-300" role="alert">
                {error}
              </p>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            <p className="font-semibold text-ink">{m.offlineTitle}</p>
            <p className="text-sm leading-relaxed text-muted">{m.offlineBody}</p>
            <div className="flex flex-wrap gap-2 text-sm">
              <a
                href={contact.phoneHref}
                className="rounded-full border border-ink/15 px-3 py-1.5 font-semibold text-ink hover:border-bronze"
              >
                {contact.phone}
              </a>
              <a
                href={contact.emailHref}
                className="rounded-full border border-ink/15 px-3 py-1.5 font-semibold text-ink hover:border-bronze"
              >
                {m.contactUs}
              </a>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

