"use client";

import EmptyState from "@/components/admin/EmptyState";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { QuoteRecord, QuoteStatus } from "@/lib/admin/quotes-store";

const statuses: QuoteStatus[] = [
  "new",
  "contacted",
  "scheduled",
  "won",
  "lost",
];

const statusTone: Record<QuoteStatus, string> = {
  new: "bg-sky-500/15 text-sky-900 dark:text-sky-200",
  contacted: "bg-violet-500/15 text-violet-900 dark:text-violet-200",
  scheduled: "bg-amber-500/15 text-amber-950 dark:text-amber-100",
  won: "bg-emerald-500/15 text-emerald-900 dark:text-emerald-200",
  lost: "bg-ink/8 text-muted",
};

export default function QuotesTable({ quotes }: { quotes: QuoteRecord[] }) {
  const router = useRouter();
  const [busyId, setBusyId] = useState<string | null>(null);

  async function setStatus(id: string, status: QuoteStatus) {
    setBusyId(id);
    try {
      await fetch(`/api/quotes/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      router.refresh();
    } finally {
      setBusyId(null);
    }
  }

  if (quotes.length === 0) {
    return (
      <EmptyState
        title="No quotes yet"
        description="Submissions from /quote will appear here. This demo uses an in-memory store—it resets on cold starts until a database is wired."
      />
    );
  }

  return (
    <div className="admin-table-wrap overflow-hidden rounded-2xl border border-ink/10 bg-surface shadow-sm">
      <div className="overflow-x-auto">
        <table className="admin-table min-w-full text-left text-sm">
          <thead>
            <tr className="border-b border-ink/10 bg-ivory-muted/70 text-[0.6875rem] uppercase tracking-wider text-muted">
              <th className="px-4 py-3 font-semibold">Received</th>
              <th className="px-4 py-3 font-semibold">Contact</th>
              <th className="px-4 py-3 font-semibold">Service</th>
              <th className="px-4 py-3 font-semibold">Location</th>
              <th className="px-4 py-3 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody>
            {quotes.map((q) => (
              <tr
                key={q.id}
                className="border-b border-ink/5 align-top transition-colors last:border-0 hover:bg-ivory-muted/40"
              >
                <td className="whitespace-nowrap px-4 py-3.5 text-muted">
                  {new Date(q.createdAt).toLocaleString("en-US", {
                    timeZone: "America/Chicago",
                    month: "short",
                    day: "numeric",
                    hour: "numeric",
                    minute: "2-digit",
                  })}
                  <div className="mt-1">
                    <span className="rounded-full bg-ivory-muted px-2 py-0.5 text-[0.625rem] font-semibold uppercase tracking-wide text-muted-light">
                      {q.source}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3.5">
                  <div className="font-semibold text-ink">{q.name}</div>
                  <div className="mt-0.5 text-muted">{q.phone}</div>
                  <div className="text-muted">{q.email}</div>
                  <div className="mt-1.5 text-[0.6875rem] capitalize text-muted-light">
                    Prefer {q.preferredContact}
                  </div>
                </td>
                <td className="px-4 py-3.5">
                  <div className="font-medium text-ink">{q.serviceType}</div>
                  <p className="mt-1.5 max-w-xs text-xs leading-relaxed text-muted line-clamp-3">
                    {q.description}
                  </p>
                </td>
                <td className="px-4 py-3.5 text-muted">{q.address}</td>
                <td className="px-4 py-3.5">
                  <label className="sr-only" htmlFor={`status-${q.id}`}>
                    Status for {q.name}
                  </label>
                  <div className="flex flex-col gap-2">
                    <span
                      className={`inline-flex w-fit rounded-full px-2 py-0.5 text-[0.625rem] font-bold uppercase tracking-wide ${statusTone[q.status]}`}
                    >
                      {q.status}
                    </span>
                    <select
                      id={`status-${q.id}`}
                      className="field-input mt-0 max-w-[9.5rem] py-1.5 text-xs"
                      value={q.status}
                      disabled={busyId === q.id}
                      onChange={(e) =>
                        void setStatus(q.id, e.target.value as QuoteStatus)
                      }
                    >
                      {statuses.map((s) => (
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
    </div>
  );
}
