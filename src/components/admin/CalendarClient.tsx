"use client";

import Link from "next/link";
import AdminPageChrome from "@/components/admin/AdminPageChrome";
import EmptyState from "@/components/admin/EmptyState";
import { useAdminI18n } from "@/components/admin/LocaleProvider";
import StatusBadge from "@/components/admin/StatusBadge";
import { quoteStatusLabel } from "@/lib/admin/i18n";
import { quoteStatusTone, type QuoteStatus } from "@/lib/admin/status";
import { useMemo, useState } from "react";

export type CalJob = {
  id: string;
  quoteId: string;
  day: string;
  timeLabel: string;
  title: string;
  customer: string;
  serviceType: string;
  address: string;
  status: QuoteStatus;
};

type StatusFilter = "all" | QuoteStatus;

function filterClass(active: boolean): string {
  return `admin-touch rounded-md px-2.5 py-1.5 text-xs font-medium transition ${
    active
      ? "bg-bronze/12 text-bronze-dark dark:text-bronze-light"
      : "text-muted hover:bg-[var(--admin-panel)] hover:text-ink"
  }`;
}

export default function CalendarClient({
  label,
  weeks,
  jobs,
  todayKey,
}: {
  label: string;
  weeks: (string | null)[][];
  jobs: CalJob[];
  todayKey: string;
}) {
  const { t, locale } = useAdminI18n();
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  const byDay = useMemo(() => {
    const map = new Map<string, CalJob[]>();
    for (const j of jobs) {
      const list = map.get(j.day) ?? [];
      list.push(j);
      map.set(j.day, list);
    }
    return map;
  }, [jobs]);

  const upcoming = useMemo(() => {
    if (statusFilter === "all") return jobs;
    return jobs.filter((j) => j.status === statusFilter);
  }, [jobs, statusFilter]);

  const statusCounts = useMemo(() => {
    const counts: Record<StatusFilter, number> = {
      all: jobs.length,
      new: 0,
      contacted: 0,
      scheduled: 0,
      won: 0,
      lost: 0,
    };
    for (const j of jobs) counts[j.status] += 1;
    return counts;
  }, [jobs]);

  const statusFilters: StatusFilter[] = [
    "all",
    "scheduled",
    "won",
    "contacted",
    "new",
  ];

  const dow = [
    t("pages.schedule.dow.sun"),
    t("pages.schedule.dow.mon"),
    t("pages.schedule.dow.tue"),
    t("pages.schedule.dow.wed"),
    t("pages.schedule.dow.thu"),
    t("pages.schedule.dow.fri"),
    t("pages.schedule.dow.sat"),
  ];

  return (
    <>
      <AdminPageChrome page="schedule" showDictMeta />

      <div className="admin-toolbar mb-4 flex flex-wrap items-center gap-1">
        {statusFilters.map((s) => {
          if (s !== "all" && statusCounts[s] === 0) return null;
          const labelText =
            s === "all"
              ? t("common.all")
              : quoteStatusLabel(locale, s);
          return (
            <button
              key={s}
              type="button"
              onClick={() => setStatusFilter(s)}
              className={filterClass(statusFilter === s)}
              aria-pressed={statusFilter === s}
            >
              {labelText} ({statusCounts[s]})
            </button>
          );
        })}
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <section className="admin-glass-panel overflow-hidden">
          <div className="flex items-center justify-between border-b border-ink/8 px-4 py-3">
            <h2 className="font-display text-base font-semibold text-ink">{label}</h2>
            <span className="text-[0.6875rem] text-muted">
              {t("common.jobs", { count: jobs.length })}
            </span>
          </div>
          <div className="grid grid-cols-7 border-b border-ink/8 bg-[var(--admin-thead)] text-center text-[0.625rem] font-semibold uppercase tracking-wider text-muted">
            {dow.map((d) => (
              <div key={d} className="px-1 py-2">
                {d}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7">
            {weeks.flat().map((day, i) => {
              if (!day) {
                return (
                  <div
                    key={`pad-${i}`}
                    className="min-h-[4.5rem] border-b border-r border-ink/5 bg-ink/[0.02] p-1.5"
                  />
                );
              }
              const dayJobs = byDay.get(day) ?? [];
              const isToday = day === todayKey;
              return (
                <div
                  key={day}
                  className={`min-h-[4.5rem] border-b border-r border-ink/5 p-1.5 transition hover:bg-[var(--admin-row-hover)] ${
                    isToday ? "bg-bronze/6" : ""
                  }`}
                >
                  <div
                    className={`text-[0.6875rem] font-semibold tabular-nums ${
                      isToday
                        ? "text-bronze-dark dark:text-bronze-light"
                        : "text-muted"
                    }`}
                  >
                    {Number(day.slice(-2))}
                  </div>
                  <ul className="mt-1 space-y-0.5">
                    {dayJobs.slice(0, 2).map((j) => (
                      <li key={j.id}>
                        <Link
                          href={`/admin/quotes/${j.quoteId}`}
                          className="block truncate rounded px-1 py-0.5 text-[0.625rem] font-medium text-ink hover:bg-bronze/12"
                          title={`${j.title} · ${j.customer}`}
                        >
                          {j.timeLabel} {j.customer.split(" ")[0]}
                        </Link>
                      </li>
                    ))}
                    {dayJobs.length > 2 && (
                      <li className="px-1 text-[0.5625rem] text-muted">
                        {t("common.more", { count: dayJobs.length - 2 })}
                      </li>
                    )}
                  </ul>
                </div>
              );
            })}
          </div>
        </section>

        <section className="space-y-3">
          <div className="flex items-baseline justify-between gap-2">
            <h2 className="admin-section-label">{t("pages.schedule.upcoming")}</h2>
            <span className="text-[0.6875rem] text-muted">
              {t("common.showingOf", {
                filtered: upcoming.length,
                total: jobs.length,
              })}
            </span>
          </div>
          {upcoming.length === 0 ? (
            <EmptyState
              title={
                jobs.length === 0
                  ? t("pages.schedule.emptyTitle")
                  : t("common.noMatches")
              }
              description={
                jobs.length === 0
                  ? t("pages.schedule.emptyDesc")
                  : t("common.noMatchesDesc")
              }
              action={
                statusFilter !== "all" ? (
                  <button
                    type="button"
                    className="btn-secondary-light admin-touch text-sm"
                    onClick={() => setStatusFilter("all")}
                  >
                    {t("common.clearFilters")}
                  </button>
                ) : undefined
              }
            />
          ) : (
            <ul className="divide-y divide-ink/8 overflow-hidden rounded-xl border border-[color:var(--admin-border)] bg-[var(--admin-panel)]">
              {upcoming.map((j) => (
                <li key={j.id}>
                  <Link
                    href={`/admin/quotes/${j.quoteId}`}
                    className="block px-3 py-3 transition hover:bg-[var(--admin-row-hover)] sm:px-4"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-[0.6875rem] tabular-nums text-muted">
                          {j.day}
                          <span className="text-ink/25"> · </span>
                          {j.timeLabel}
                        </p>
                        <p className="mt-0.5 text-sm font-semibold text-ink">
                          {j.title}
                        </p>
                        <p className="mt-0.5 text-sm text-muted">
                          {j.customer}
                          <span className="text-ink/25"> · </span>
                          {j.serviceType}
                        </p>
                        <p className="text-xs text-muted-light">{j.address}</p>
                      </div>
                      <StatusBadge
                        label={quoteStatusLabel(locale, j.status)}
                        tone={quoteStatusTone[j.status]}
                      />
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </>
  );
}
