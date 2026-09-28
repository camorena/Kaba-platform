"use client";

import ConfirmDialog from "@/components/admin/ConfirmDialog";
import CopyChip from "@/components/admin/CopyChip";
import StatusBadge from "@/components/admin/StatusBadge";
import { QuoteStatusTimeline } from "@/components/admin/StatusTimeline";
import { useToast } from "@/components/admin/Toast";
import { useAdminI18n } from "@/components/admin/LocaleProvider";
import { quoteStatusLabel } from "@/lib/admin/i18n";
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
  const toast = useToast();
  const { t, locale } = useAdminI18n();
  const [status, setStatus] = useState<QuoteStatus>(quote.status);
  const [notes, setNotes] = useState(quote.notes);
  const [busy, setBusy] = useState(false);
  const [creatingInv, setCreatingInv] = useState(false);
  const [confirmLost, setConfirmLost] = useState(false);
  const [pendingStatus, setPendingStatus] = useState<QuoteStatus | null>(null);

  async function save(patch: { status?: QuoteStatus; notes?: string }) {
    if (patch.status === "lost" && status !== "lost") {
      setPendingStatus("lost");
      setConfirmLost(true);
      return;
    }
    await applySave(patch);
  }

  async function applySave(patch: { status?: QuoteStatus; notes?: string }) {
    setBusy(true);
    try {
      const res = await fetch(`/api/quotes/${quote.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      });
      if (!res.ok) {
        toast.push({ title: t("detail.saveFailed"), tone: "error" });
        return;
      }
      if (patch.status) setStatus(patch.status);
      toast.push({
        title: patch.status
          ? t("common.statusArrow", { status: quoteStatusLabel(locale, patch.status) })
          : t("detail.notesSaved"),
        tone: "success",
      });
      router.refresh();
    } finally {
      setBusy(false);
      setConfirmLost(false);
      setPendingStatus(null);
    }
  }

  async function createInvoice() {
    setCreatingInv(true);
    try {
      const res = await fetch("/api/invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quoteId: quote.id }),
      });
      const data = (await res.json()) as {
        invoice?: { id: string };
        error?: string;
      };
      if (!res.ok || !data.invoice) {
        toast.push({
          title: t("detail.createInvoiceFailed"),
          description: data.error,
          tone: "error",
        });
        return;
      }
      toast.push({ title: t("detail.invoiceCreated"), tone: "success" });
      router.push(`/admin/invoices/${data.invoice.id}`);
      router.refresh();
    } finally {
      setCreatingInv(false);
    }
  }

  function printQuote() {
    window.print();
  }

  return (
    <div className="quote-print-root space-y-4">
      <div className="flex flex-wrap items-center gap-2 text-xs text-muted print:hidden">
        <Link href="/admin/quotes" className="font-semibold hover:underline">
          ← {t("detail.backQuotes")}
        </Link>
        <span aria-hidden>·</span>
        <Link href="/admin/pipeline" className="hover:underline">
          {t("nav.pipeline")}
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
            <StatusBadge label={quoteStatusLabel(locale, status)} tone={quoteStatusTone[status]} />
          </div>
          <p className="mt-1 text-sm text-muted">
            {quote.serviceType} · {quote.address}
          </p>
        </div>
        <div className="flex flex-wrap gap-2 print:hidden">
          <a href={`tel:${quote.phone}`} className="btn-secondary-light text-sm">
            {t("detail.call")}
          </a>
          <a
            href={`mailto:${quote.email}?subject=${encodeURIComponent(`Kaba Fence — ${quote.serviceType}`)}`}
            className="btn-secondary-light text-sm"
          >
            {t("detail.email")}
          </a>
          <button
            type="button"
            onClick={printQuote}
            className="btn-secondary-light text-sm"
          >
            {t("detail.print")}
          </button>
          {relatedInvoiceId ? (
            <Link
              href={`/admin/invoices/${relatedInvoiceId}`}
              className="btn-secondary text-sm"
            >
              {t("detail.viewInvoice")}
            </Link>
          ) : (
            <button
              type="button"
              disabled={creatingInv}
              onClick={() => void createInvoice()}
              className="btn-primary text-sm disabled:opacity-60"
            >
              {creatingInv ? t("common.creating") : t("detail.createInvoice")}
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5 print:hidden">
        <CopyChip value={quote.phone} label={t("common.copyPhone")} />
        <CopyChip value={quote.email} label={t("common.copyEmail")} />
        <CopyChip
          value={`${quote.name} · ${quote.serviceType} · ${quote.address}`}
          label={t("common.copySummary")}
        />
        <Link href="/admin/templates" className="admin-chip">
          {t("detail.followUpTemplates")}
        </Link>
        <Link href="/admin/pricebook" className="admin-chip">
          {t("detail.pricebookLink")}
        </Link>
      </div>

      {!relatedInvoiceId && (
        <div className="admin-flow-hint rounded-xl border border-bronze/20 bg-bronze/5 px-3 py-2.5 text-xs leading-relaxed text-muted print:hidden sm:px-4">
          <strong className="font-semibold text-ink">{t("detail.nextStepTitle")}</strong>{" "}
          {t("detail.nextStepBody")}
        </div>
      )}

      <section className="admin-glass-panel admin-gold-rail px-4 py-3 sm:px-5 print:hidden">
        <h2 className="admin-card-title mb-3">{t("detail.progress")}</h2>
        <QuoteStatusTimeline status={status} />
      </section>

      <div className="grid gap-3 lg:grid-cols-3">
        <section className="admin-card quote-print-sheet lg:col-span-2">
          <h2 className="admin-card-title">{t("detail.request")}</h2>
          <dl className="admin-dl mt-3">
            <div>
              <dt>{t("detail.phone")}</dt>
              <dd>
                <a href={`tel:${quote.phone}`} className="hover:underline">
                  {quote.phone}
                </a>
              </dd>
            </div>
            <div>
              <dt>{t("detail.email")}</dt>
              <dd>
                <a href={`mailto:${quote.email}`} className="hover:underline">
                  {quote.email}
                </a>
              </dd>
            </div>
            <div>
              <dt>{t("detail.prefer")}</dt>
              <dd className="capitalize">{quote.preferredContact}</dd>
            </div>
            <div>
              <dt>{t("detail.source")}</dt>
              <dd className="capitalize">{quote.source}</dd>
            </div>
            <div>
              <dt>{t("detail.received")}</dt>
              <dd>{formatDateTime(quote.createdAt)}</dd>
            </div>
            <div>
              <dt>{t("detail.updated")}</dt>
              <dd>{formatDateTime(quote.updatedAt)}</dd>
            </div>
          </dl>
          <div className="mt-4 rounded-lg bg-ivory-muted/60 p-3 text-sm leading-relaxed text-ink dark:bg-ivory-muted/30">
            {quote.description}
          </div>
        </section>

        <section className="admin-card space-y-4 print:hidden">
          <div>
            <h2 className="admin-card-title">{t("detail.status")}</h2>
            <label htmlFor="detail-status" className="sr-only">
              {t("detail.quoteStatus")}
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
                  {quoteStatusLabel(locale, s)}
                </option>
              ))}
            </select>
            <div className="mt-2 flex flex-wrap gap-1">
              {QUOTE_STATUSES.filter((s) => s !== status).map((s) => (
                <button
                  key={s}
                  type="button"
                  disabled={busy}
                  className="admin-chip capitalize disabled:opacity-50"
                  onClick={() => {
                    setStatus(s);
                    void save({ status: s });
                  }}
                >
                  → {quoteStatusLabel(locale, s)}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label htmlFor="quote-notes" className="admin-card-title block">
              {t("detail.internalNotes")}
            </label>
            <textarea
              id="quote-notes"
              rows={6}
              className="field-input mt-2 resize-y text-sm"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={t("detail.notesPlaceholder")}
            />
            <button
              type="button"
              disabled={busy}
              onClick={() => void save({ notes })}
              className="btn-secondary mt-2 w-full text-sm disabled:opacity-60"
            >
              {busy ? t("common.saving") : t("detail.saveNotes")}
            </button>
          </div>
        </section>
      </div>
      <ConfirmDialog
        open={confirmLost}
        title={t("quotes.markLostTitle")}
        description={t("quotes.markLostDesc", { count: 1 })}
        confirmLabel={t("detail.markLost")}
        tone="danger"
        busy={busy}
        onCancel={() => {
          setConfirmLost(false);
          setPendingStatus(null);
        }}
        onConfirm={() => void applySave({ status: pendingStatus ?? "lost" })}
      />
    </div>
  );
}
