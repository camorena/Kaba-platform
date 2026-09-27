"use client";

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
      <p className="rounded-xl border border-dashed border-ink/15 bg-surface px-4 py-10 text-center text-sm text-muted">
        No quotes yet. Submissions from <code>/quote</code> will appear here
        (in-memory store — resets on cold starts until a DB is wired).
      </p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-ink/10 bg-surface shadow-sm">
      <table className="min-w-full text-left text-sm">
        <thead className="border-b border-ink/10 bg-ivory-muted/60 text-[0.6875rem] uppercase tracking-wider text-muted">
          <tr>
            <th className="px-3 py-2.5 font-semibold">Received</th>
            <th className="px-3 py-2.5 font-semibold">Contact</th>
            <th className="px-3 py-2.5 font-semibold">Service</th>
            <th className="px-3 py-2.5 font-semibold">Location</th>
            <th className="px-3 py-2.5 font-semibold">Status</th>
          </tr>
        </thead>
        <tbody>
          {quotes.map((q) => (
            <tr key={q.id} className="border-b border-ink/5 align-top last:border-0">
              <td className="whitespace-nowrap px-3 py-3 text-muted">
                {new Date(q.createdAt).toLocaleString("en-US", {
                  timeZone: "America/Chicago",
                  month: "short",
                  day: "numeric",
                  hour: "numeric",
                  minute: "2-digit",
                })}
                <div className="mt-0.5 text-[0.6875rem] text-muted-light">
                  {q.source}
                </div>
              </td>
              <td className="px-3 py-3">
                <div className="font-semibold text-ink">{q.name}</div>
                <div className="text-muted">{q.phone}</div>
                <div className="text-muted">{q.email}</div>
                <div className="mt-1 text-[0.6875rem] capitalize text-muted-light">
                  Prefer {q.preferredContact}
                </div>
              </td>
              <td className="px-3 py-3">
                <div className="font-medium text-ink">{q.serviceType}</div>
                <p className="mt-1 max-w-xs text-xs leading-relaxed text-muted">
                  {q.description}
                </p>
              </td>
              <td className="px-3 py-3 text-muted">{q.address}</td>
              <td className="px-3 py-3">
                <label className="sr-only" htmlFor={`status-${q.id}`}>
                  Status for {q.name}
                </label>
                <select
                  id={`status-${q.id}`}
                  className="field-input mt-0 py-1.5 text-xs"
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
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
