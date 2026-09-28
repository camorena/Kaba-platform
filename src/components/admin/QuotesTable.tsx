"use client";

import ConfirmDialog from "@/components/admin/ConfirmDialog";
import EmptyState from "@/components/admin/EmptyState";
import { useToast } from "@/components/admin/Toast";
import StatusBadge from "@/components/admin/StatusBadge";
import { downloadCsv } from "@/lib/admin/csv";
import { formatShortDate } from "@/lib/admin/format";
import {
  QUOTE_STATUSES,
  quoteStatusTone,
  type QuoteStatus,
} from "@/lib/admin/status";
import type { QuoteRecord } from "@/lib/admin/quotes-store";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

export default function QuotesTable({ quotes }: { quotes: QuoteRecord[] }) {
  const router = useRouter();
  const toast = useToast();
  const [busyId, setBusyId] = useState<string | null>(null);
  const [bulkBusy, setBulkBusy] = useState(false);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<QuoteStatus | "all">("all");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [bulkStatus, setBulkStatus] = useState<QuoteStatus>("contacted");
  const [confirm, setConfirm] = useState<{
    ids: string[];
    status: QuoteStatus;
  } | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return quotes.filter((row) => {
      if (statusFilter !== "all" && row.status !== statusFilter) return false;
      if (!q) return true;
      const hay = [
        row.name,
        row.email,
        row.phone,
        row.serviceType,
        row.address,
        row.description,
        row.notes,
        row.source,
      ]
        .join(" ")
        .toLowerCase();
      return hay.includes(q);
    });
  }, [quotes, query, statusFilter]);

  const allFilteredSelected =
    filtered.length > 0 && filtered.every((q) => selected.has(q.id));

  function toggleAll() {
    if (allFilteredSelected) {
      setSelected((prev) => {
        const next = new Set(prev);
        filtered.forEach((q) => next.delete(q.id));
        return next;
      });
    } else {
      setSelected((prev) => {
        const next = new Set(prev);
        filtered.forEach((q) => next.add(q.id));
        return next;
      });
    }
  }

  function toggleOne(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function exportCsv() {
    const rows: (string | number)[][] = [
      ["Received", "Name", "Phone", "Email", "Service", "Address", "Status", "Source"],
      ...filtered.map((q) => [
        formatShortDate(q.createdAt),
        q.name,
        q.phone,
        q.email,
        q.serviceType,
        q.address,
        q.status,
        q.source,
      ]),
    ];
    downloadCsv(`kaba-quotes-${new Date().toISOString().slice(0, 10)}.csv`, rows);
    toast.push({
      title: `CSV exported · ${filtered.length} quote${filtered.length === 1 ? "" : "s"}`,
      tone: "success",
    });
  }

  async function setStatus(id: string, status: QuoteStatus) {
    if (status === "lost") {
      setConfirm({ ids: [id], status });
      return;
    }
    await applyStatus([id], status);
  }

  function requestBulk() {
    const ids = [...selected];
    if (!ids.length) return;
    if (bulkStatus === "lost") {
      setConfirm({ ids, status: bulkStatus });
      return;
    }
    void applyStatus(ids, bulkStatus);
  }

  async function applyStatus(ids: string[], status: QuoteStatus) {
    if (ids.length === 1) {
      setBusyId(ids[0]);
    } else {
      setBulkBusy(true);
    }
    try {
      if (ids.length === 1) {
        const res = await fetch(`/api/quotes/${ids[0]}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status }),
        });
        if (!res.ok) {
          toast.push({ title: "Status update failed", tone: "error" });
          return;
        }
        toast.push({ title: `Status → ${status}`, tone: "success" });
      } else {
        const res = await fetch("/api/quotes", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ids, status }),
        });
        const data = (await res.json()) as { updated?: number; error?: string };
        if (!res.ok) {
          toast.push({
            title: "Bulk update failed",
            description: data.error,
            tone: "error",
          });
          return;
        }
        toast.push({
          title: `Updated ${data.updated ?? ids.length} → ${status}`,
          tone: "success",
        });
        setSelected(new Set());
      }
      router.refresh();
    } finally {
      setBusyId(null);
      setBulkBusy(false);
      setConfirm(null);
    }
  }

  return (
    <div className="space-y-3">
      <div className="admin-toolbar flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative min-w-0 flex-1 sm:max-w-xs">
          <label htmlFor="quote-search" className="sr-only">
            Search quotes
          </label>
          <input
            id="quote-search"
            type="search"
            placeholder="Search name, phone, service…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="field-input admin-touch !mt-0 py-2.5 text-sm"
          />
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={exportCsv}
            disabled={filtered.length === 0}
            className="admin-chip admin-touch disabled:opacity-40"
            title="Download filtered quotes as CSV"
          >
            Export CSV
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter("all")}
            className={`admin-chip admin-touch ${statusFilter === "all" ? "admin-chip-active" : ""}`}
          >
            All ({quotes.length})
          </button>
          {QUOTE_STATUSES.map((s) => {
            const count = quotes.filter((q) => q.status === s).length;
            return (
              <button
                key={s}
                type="button"
                onClick={() => setStatusFilter(s)}
                className={`admin-chip admin-touch capitalize ${statusFilter === s ? "admin-chip-active" : ""}`}
              >
                {s} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {selected.size > 0 && (
        <div className="admin-bulk-bar flex flex-col gap-2 rounded-xl border px-3 py-2.5 sm:flex-row sm:items-center sm:justify-between sm:px-4">
          <p className="text-sm font-semibold text-ink">
            {selected.size} selected
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <label htmlFor="bulk-status" className="sr-only">
              Bulk status
            </label>
            <select
              id="bulk-status"
              className="field-input !mt-0 max-w-[10rem] py-2 text-xs capitalize"
              value={bulkStatus}
              onChange={(e) => setBulkStatus(e.target.value as QuoteStatus)}
            >
              {QUOTE_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <button
              type="button"
              className="admin-touch btn-primary text-xs"
              disabled={bulkBusy}
              onClick={requestBulk}
            >
              {bulkBusy ? "Updating…" : "Apply status"}
            </button>
            <button
              type="button"
              className="admin-touch admin-chip text-xs"
              onClick={() => setSelected(new Set())}
            >
              Clear
            </button>
          </div>
        </div>
      )}

      {quotes.length === 0 ? (
        <EmptyState
          title="No quotes yet"
          description="Submissions from /quote will appear here. This demo uses an in-memory store—it resets on cold starts until a database is wired."
          action={
            <Link href="/quote" className="btn-primary text-sm">
              Open public quote form
            </Link>
          }
        />
      ) : filtered.length === 0 ? (
        <EmptyState
          title="No matches"
          description="Try a different search or clear the status filter."
          action={
            <button
              type="button"
              className="btn-secondary text-sm"
              onClick={() => {
                setQuery("");
                setStatusFilter("all");
              }}
            >
              Clear filters
            </button>
          }
        />
      ) : (
        <>
          {/* Mobile cards */}
          <ul className="admin-card-list space-y-2.5 md:hidden">
            {filtered.map((q) => (
              <li key={q.id} className="admin-mobile-card">
                <div className="flex items-start gap-3">
                  <label className="admin-touch flex shrink-0 pt-0.5">
                    <span className="sr-only">Select {q.name}</span>
                    <input
                      type="checkbox"
                      className="admin-check"
                      checked={selected.has(q.id)}
                      onChange={() => toggleOne(q.id)}
                    />
                  </label>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <Link
                        href={`/admin/quotes/${q.id}`}
                        className="font-semibold text-ink hover:text-bronze-dark hover:underline dark:hover:text-bronze-light"
                      >
                        {q.name}
                      </Link>
                      <StatusBadge
                        label={q.status}
                        tone={quoteStatusTone[q.status]}
                      />
                    </div>
                    <p className="mt-0.5 text-xs text-muted">
                      {formatShortDate(q.createdAt)} · {q.source}
                    </p>
                    <p className="mt-1.5 text-sm text-ink">{q.serviceType}</p>
                    <p className="mt-0.5 text-xs text-muted">{q.address}</p>
                    <p className="mt-0.5 truncate text-xs text-muted">{q.phone}</p>
                    <div className="mt-2.5">
                      <label className="sr-only" htmlFor={`m-status-${q.id}`}>
                        Status for {q.name}
                      </label>
                      <select
                        id={`m-status-${q.id}`}
                        className="field-input !mt-0 w-full py-2 text-xs capitalize"
                        value={q.status}
                        disabled={busyId === q.id}
                        onChange={(e) =>
                          void setStatus(q.id, e.target.value as QuoteStatus)
                        }
                      >
                        {QUOTE_STATUSES.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          {/* Desktop table */}
          <div className="admin-table-wrap admin-gold-rail hidden overflow-hidden rounded-xl border border-[color:var(--admin-border)] bg-[var(--admin-panel)] md:block">
            <div className="overflow-x-auto">
              <table className="admin-table min-w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-[color:var(--admin-border)]">
                    <th className="w-10 px-3 py-2.5 sm:px-4">
                      <label className="admin-touch inline-flex">
                        <span className="sr-only">Select all filtered</span>
                        <input
                          type="checkbox"
                          className="admin-check"
                          checked={allFilteredSelected}
                          onChange={toggleAll}
                        />
                      </label>
                    </th>
                    <th className="px-3 py-2.5 font-semibold sm:px-4">Received</th>
                    <th className="px-3 py-2.5 font-semibold sm:px-4">Contact</th>
                    <th className="hidden px-3 py-2.5 font-semibold md:table-cell sm:px-4">
                      Service
                    </th>
                    <th className="hidden px-3 py-2.5 font-semibold lg:table-cell sm:px-4">
                      Location
                    </th>
                    <th className="px-3 py-2.5 font-semibold sm:px-4">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((q) => (
                    <tr
                      key={q.id}
                      className="border-b border-ink/5 align-top transition-colors last:border-0 hover:bg-[var(--admin-row-hover)]"
                    >
                      <td className="px-3 py-3 sm:px-4">
                        <label className="admin-touch inline-flex">
                          <span className="sr-only">Select {q.name}</span>
                          <input
                            type="checkbox"
                            className="admin-check"
                            checked={selected.has(q.id)}
                            onChange={() => toggleOne(q.id)}
                          />
                        </label>
                      </td>
                      <td className="whitespace-nowrap px-3 py-3 text-muted sm:px-4">
                        <Link
                          href={`/admin/quotes/${q.id}`}
                          className="font-medium text-ink hover:text-bronze-dark hover:underline dark:hover:text-bronze-light"
                        >
                          {formatShortDate(q.createdAt)}
                        </Link>
                        <div className="mt-1">
                          <span className="rounded-full bg-ivory-muted px-1.5 py-0.5 text-[0.5625rem] font-semibold uppercase tracking-wide text-muted-light">
                            {q.source}
                          </span>
                        </div>
                      </td>
                      <td className="px-3 py-3 sm:px-4">
                        <Link
                          href={`/admin/quotes/${q.id}`}
                          className="font-semibold text-ink hover:text-bronze-dark hover:underline dark:hover:text-bronze-light"
                        >
                          {q.name}
                        </Link>
                        <div className="mt-0.5 text-xs text-muted">{q.phone}</div>
                        <div className="truncate text-xs text-muted">{q.email}</div>
                      </td>
                      <td className="hidden px-3 py-3 md:table-cell sm:px-4">
                        <div className="font-medium text-ink">{q.serviceType}</div>
                        <p className="mt-1 max-w-[14rem] text-xs leading-relaxed text-muted line-clamp-2">
                          {q.description}
                        </p>
                      </td>
                      <td className="hidden px-3 py-3 text-muted lg:table-cell sm:px-4">
                        {q.address}
                      </td>
                      <td className="px-3 py-3 sm:px-4">
                        <label className="sr-only" htmlFor={`status-${q.id}`}>
                          Status for {q.name}
                        </label>
                        <div className="flex flex-col gap-1.5">
                          <StatusBadge
                            label={q.status}
                            tone={quoteStatusTone[q.status]}
                          />
                          <select
                            id={`status-${q.id}`}
                            className="field-input mt-0 max-w-[9rem] py-1.5 text-xs"
                            value={q.status}
                            disabled={busyId === q.id}
                            onChange={(e) =>
                              void setStatus(q.id, e.target.value as QuoteStatus)
                            }
                          >
                            {QUOTE_STATUSES.map((s) => (
                              <option key={s} value={s}>
                                {s}
                              </option>
                            ))}
                          </select>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="border-t border-ink/8 px-3 py-2 text-xs text-muted sm:px-4">
              Showing {filtered.length} of {quotes.length}
            </div>
          </div>

          <p className="text-xs text-muted md:hidden">
            Showing {filtered.length} of {quotes.length}
          </p>
        </>
      )}

      <ConfirmDialog
        open={Boolean(confirm)}
        title="Mark as lost?"
        description={
          confirm
            ? `This will set ${confirm.ids.length} quote${confirm.ids.length === 1 ? "" : "s"} to lost. You can change status again later.`
            : undefined
        }
        confirmLabel="Mark lost"
        tone="danger"
        busy={bulkBusy || Boolean(busyId)}
        onCancel={() => setConfirm(null)}
        onConfirm={() => {
          if (confirm) void applyStatus(confirm.ids, confirm.status);
        }}
      />
    </div>
  );
}
