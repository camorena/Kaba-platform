"use client";

import EmptyState from "@/components/admin/EmptyState";
import StatusBadge from "@/components/admin/StatusBadge";
import { useToast } from "@/components/admin/Toast";
import { formatShortDate } from "@/lib/admin/format";
import type { QuoteRecord } from "@/lib/admin/quotes-store";
import {
  QUOTE_STATUSES,
  quoteStatusTone,
  type QuoteStatus,
} from "@/lib/admin/status";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { useAdminI18n } from "@/components/admin/LocaleProvider";
import { quoteStatusLabel } from "@/lib/admin/i18n";

const COLUMN_HINT_KEYS: Record<QuoteStatus, string> = {
  new: "pipeline.hintNew",
  contacted: "pipeline.hintContacted",
  scheduled: "pipeline.hintScheduled",
  won: "pipeline.hintWon",
  lost: "pipeline.hintLost",
};

export default function PipelineBoard({ quotes }: { quotes: QuoteRecord[] }) {
  const router = useRouter();
  const toast = useToast();
  const { t, locale } = useAdminI18n();
  const COLUMNS = QUOTE_STATUSES.map((status) => ({
    status,
    hint: t(COLUMN_HINT_KEYS[status]),
  }));
  const [busyId, setBusyId] = useState<string | null>(null);
  const [dragging, setDragging] = useState<string | null>(null);
  const [overCol, setOverCol] = useState<QuoteStatus | null>(null);

  const byStatus = useMemo(() => {
    const map = Object.fromEntries(
      QUOTE_STATUSES.map((s) => [s, [] as QuoteRecord[]]),
    ) as Record<QuoteStatus, QuoteRecord[]>;
    for (const q of quotes) map[q.status].push(q);
    return map;
  }, [quotes]);

  async function setStatus(id: string, status: QuoteStatus) {
    const current = quotes.find((q) => q.id === id);
    if (!current || current.status === status) return;
    setBusyId(id);
    try {
      const res = await fetch(`/api/quotes/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) {
        toast.push({ title: t("pipeline.moveFailed"), tone: "error" });
        return;
      }
      toast.push({ title: t("pipeline.movedArrow", { status: quoteStatusLabel(locale, status) }), tone: "success" });
      router.refresh();
    } finally {
      setBusyId(null);
      setDragging(null);
      setOverCol(null);
    }
  }

  if (quotes.length === 0) {
    return (
      <EmptyState
        title={t("pipeline.emptyTitle")}
        description={t("pipeline.emptyDesc")}
        action={
          <Link href="/quote" className="btn-primary text-sm">
            {t("common.openPublicQuote")}
          </Link>
        }
      />
    );
  }

  return (
    <div className="admin-pipeline -mx-1 overflow-x-auto pb-2">
      <div className="flex min-w-[56rem] gap-2.5 px-1">
        {COLUMNS.map((col) => {
          const items = byStatus[col.status];
          const isOver = overCol === col.status;
          return (
            <section
              key={col.status}
              className={`admin-pipeline-col flex w-[12.5rem] shrink-0 flex-col rounded-xl border bg-[var(--admin-panel)] transition ${
                isOver
                  ? "border-bronze/50 shadow-[0_0_0_1px_color-mix(in_srgb,var(--bronze)_35%,transparent)]"
                  : "border-ink/10"
              }`}
              onDragOver={(e) => {
                e.preventDefault();
                setOverCol(col.status);
              }}
              onDragLeave={() => {
                if (overCol === col.status) setOverCol(null);
              }}
              onDrop={(e) => {
                e.preventDefault();
                const id = e.dataTransfer.getData("text/quote-id") || dragging;
                if (id) void setStatus(id, col.status);
              }}
            >
              <header className="flex items-center justify-between gap-2 border-b border-ink/8 px-2.5 py-2">
                <div className="min-w-0">
                  <StatusBadge
                    label={quoteStatusLabel(locale, col.status)}
                    tone={quoteStatusTone[col.status]}
                  />
                  <p className="mt-1 text-[0.625rem] text-muted">{col.hint}</p>
                </div>
                <span className="tabular-nums text-xs font-bold text-muted">
                  {items.length}
                </span>
              </header>
              <ul className="flex flex-1 flex-col gap-1.5 p-2 min-h-[8rem]">
                {items.length === 0 ? (
                  <li className="rounded-lg border border-dashed border-ink/10 px-2 py-6 text-center text-[0.6875rem] text-muted">
                    {t("pipeline.dropHere")}
                  </li>
                ) : (
                  items.map((q) => (
                    <li key={q.id}>
                      <article
                        draggable={busyId !== q.id}
                        onDragStart={(e) => {
                          setDragging(q.id);
                          e.dataTransfer.setData("text/quote-id", q.id);
                          e.dataTransfer.effectAllowed = "move";
                        }}
                        onDragEnd={() => {
                          setDragging(null);
                          setOverCol(null);
                        }}
                        className={`admin-pipeline-card group rounded-lg border border-ink/8 bg-[var(--admin-bg)] p-2.5 shadow-[var(--shadow-xs)] transition hover:border-bronze/35 hover:shadow-[var(--shadow-sm)] ${
                          dragging === q.id ? "opacity-50" : ""
                        } ${busyId === q.id ? "pointer-events-none opacity-60" : "cursor-grab active:cursor-grabbing"}`}
                      >
                        <Link
                          href={`/admin/quotes/${q.id}`}
                          className="block font-semibold text-ink hover:text-bronze-dark dark:hover:text-bronze-light"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {q.name}
                        </Link>
                        <p className="mt-0.5 text-[0.6875rem] text-muted line-clamp-1">
                          {q.serviceType}
                        </p>
                        <p className="mt-0.5 text-[0.625rem] text-muted-light line-clamp-1">
                          {q.address} · {formatShortDate(q.createdAt)}
                        </p>
                        <div className="mt-2 flex flex-wrap gap-1 opacity-0 transition group-hover:opacity-100 focus-within:opacity-100">
                          {QUOTE_STATUSES.filter((s) => s !== q.status)
                            .slice(0, 3)
                            .map((s) => (
                              <button
                                key={s}
                                type="button"
                                className="rounded px-1.5 py-0.5 text-[0.5625rem] font-bold uppercase tracking-wide text-muted hover:bg-bronze/15 hover:text-bronze-dark dark:hover:text-bronze-light"
                                onClick={() => void setStatus(q.id, s)}
                              >
                                → {quoteStatusLabel(locale, s)}
                              </button>
                            ))}
                        </div>
                      </article>
                    </li>
                  ))
                )}
              </ul>
            </section>
          );
        })}
      </div>
      <p className="mt-2 px-1 text-[0.6875rem] text-muted">
        {t("pipeline.footer")}
      </p>
    </div>
  );
}
