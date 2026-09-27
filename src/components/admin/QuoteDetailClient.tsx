"use client";

import StatusBadge from "@/components/admin/StatusBadge";
import { formatDateTime } from "@/lib/admin/format";
import {
  QUOTE_STATUSES,
  quoteStatusTone,
  type QuoteStatus,
} from "@/lib/admin/status";
import type { QuoteRecord } from "@/lib/admin/quotes-store";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function QuoteDetailClient({
  quote,
  relatedInvoiceId,
}: {
  quote: QuoteRecord;
  relatedInvoiceId?: string | null;
}) {
  const router = useRouter();
  const [status, setStatus] = useState<QuoteStatus>(quote.status);
  const [notes, setNotes] = useState(quote.notes);
  const [busy, setBusy] = useState(false);
  const [creatingInv, setCreatingInv] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function save(patch: { status?: QuoteStatus; notes?: string }) {
    setBusy(true);
    setMsg(null);
    try {
      const res = await fetch(`/api/quotes/${quote.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      });
      if (!res.ok) {
        setMsg("Save failed.");
        return;
      }
      setMsg("Saved.");
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  async function createInvoice() {
    setCreatingInv(true);
    setMsg(null);
    try {
      const res = await fetch("/api/invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quoteId: quote.id }),
      });
      const data = (await res.json()) as { invoice?: { id: string }; error?: string };
      if (!res.ok || !data.invoice) {
        setMsg(data.error || "Could not create invoice.");
        return;
      }
      router.push(`/admin/invoices/${data.invoice.id}`);
      router.refresh();
    } finally {
      setCreatingInv(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2 text-xs text-muted">
        <Link href="/admin/quotes" className="font-semibold hover:underline">
          ← Quotes
        </Link>
        <span aria-hidden>·</span>
        <span className="font-mono text-[0.6875rem]">{quote.id}</span>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="font-display text-xl font-semibold tracking-tight text-ink sm:text-2xl">
              {quote.name}
            </h1>
            <StatusBadge label={status} tone={quoteStatusTone[status]} />
          </div>
          <p className="mt-1 text-sm text-muted">
            {quote.serviceType} · {quote.address}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {relatedInvoiceId ? (
            <Link
              href={`/admin/invoices/${relatedInvoiceId}`}
              className="btn-secondary text-sm"
            >
              View invoice
            </Link>
          ) : (
            <button
              type="button"
              disabled={creatingInv}
              onClick={() => void createInvoice()}
              className="btn-primary text-sm disabled:opacity-60"
            >
              {creatingInv ? "Creating…" : "Create invoice (demo)"}
            </button>
          )}
        </div>
      </div>

      <div className="grid gap-3 lg:grid-cols-3">
        <section className="admin-card lg:col-span-2">
          <h2 className="admin-card-title">Request</h2>
          <dl className="admin-dl mt-3">
            <div>
              <dt>Phone</dt>
              <dd>
                <a href={`tel:${quote.phone}`} className="hover:underline">
                  {quote.phone}
                </a>
              </dd>
            </div>
            <div>
              <dt>Email</dt>
              <dd>
                <a href={`mailto:${quote.email}`} className="hover:underline">
                  {quote.email}
                </a>
              </dd>
            </div>
            <div>
              <dt>Prefer</dt>
              <dd className="capitalize">{quote.preferredContact}</dd>
            </div>
            <div>
              <dt>Source</dt>
              <dd className="capitalize">{quote.source}</dd>
            </div>
            <div>
              <dt>Received</dt>
              <dd>{formatDateTime(quote.createdAt)}</dd>
            </div>
            <div>
              <dt>Updated</dt>
              <dd>{formatDateTime(quote.updatedAt)}</dd>
            </div>
          </dl>
          <div className="mt-4 rounded-lg bg-ivory-muted/60 p-3 text-sm leading-relaxed text-ink dark:bg-ivory-muted/30">
            {quote.description}
          </div>
        </section>

        <section className="admin-card space-y-4">
          <div>
            <h2 className="admin-card-title">Status</h2>
            <label htmlFor="detail-status" className="sr-only">
              Quote status
            </label>
            <select
              id="detail-status"
              className="field-input mt-2 text-sm"
              value={status}
              disabled={busy}
              onChange={(e) => {
                const next = e.target.value as QuoteStatus;
                setStatus(next);
                void save({ status: next });
              }}
            >
              {QUOTE_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              htmlFor="quote-notes"
              className="admin-card-title block"
            >
              Internal notes
            </label>
            <textarea
              id="quote-notes"
              rows={6}
              className="field-input mt-2 resize-y text-sm"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Call notes, site access, HOA caveats…"
            />
            <button
              type="button"
              disabled={busy}
              onClick={() => void save({ notes })}
              className="btn-secondary mt-2 w-full text-sm disabled:opacity-60"
            >
              {busy ? "Saving…" : "Save notes"}
            </button>
          </div>
          {msg && (
            <p className="text-xs font-medium text-muted" role="status">
              {msg}
            </p>
          )}
        </section>
      </div>
    </div>
  );
}
