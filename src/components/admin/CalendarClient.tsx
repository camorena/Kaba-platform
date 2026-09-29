"use client";

import Link from "next/link";
import AdminPageChrome from "@/components/admin/AdminPageChrome";
import EmptyState from "@/components/admin/EmptyState";
import { useAdminI18n } from "@/components/admin/LocaleProvider";
import StatusBadge from "@/components/admin/StatusBadge";
import { formatYmd } from "@/lib/admin/format";
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
  hasScheduledFor: boolean;
};

type StatusFilter = "all" | QuoteStatus;

function filterClass(active: boolean): string {
  return `admin-touch rounded-md px-2.5 py-1.5 text-xs font-medium transition ${
    active
      ? "bg-bronze/12 text-bronze-dark dark:text-bronze-light"
      : "text-muted hover:bg-[var(--admin-panel)] hover:text-ink"
  }`;
}

function jobTitleKey(status: QuoteStatus): string {
  return status === "won"
    ? "pages.schedule.kindInstall"
    : "pages.schedule.kindVisit";
}

function jobTimeKey(status: QuoteStatus): string {
  return status === "won"
    ? "pages.schedule.timeInstall"
    : "pages.schedule.timeVisit";
}

function eventChipClass(status: QuoteStatus): string {
  switch (status) {
    case "won":
      return "bg-emerald-500/12 text-emerald-900 dark:text-emerald-200";
    case "scheduled":
      return "bg-amber-500/12 text-amber-950 dark:text-amber-100";
    case "contacted":
      return "bg-violet-500/12 text-violet-950 dark:text-violet-100";
    case "new":
      return "bg-sky-500/12 text-sky-950 dark:text-sky-100";
    default:
      return "bg-ink/6 text-ink";
  }
}

export default function CalendarClient({
  label,
  year,
  month,
  weeks,
  jobs,
  todayKey,
}: {
  label: string;
  year: number;
  month: number;
  weeks: (string | null)[][];
  jobs: CalJob[];
  todayKey: string;
}) {
  const { t, locale } = useAdminI18n();
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const dateLocale = locale === "es" ? "es-CO" : "en-US";

  const monthLabel = useMemo(() => {
    try {
      return new Date(year, month, 1).toLocaleString(dateLocale, {
        month: "long",
        year: "numeric",
      });
    } catch {
      return label;
    }
  }, [year, month, dateLocale, label]);

  const filteredJobs = useMemo(() => {
    if (statusFilter === "all") return jobs;
    return jobs.filter((j) => j.status === statusFilter);
  }, [jobs, statusFilter]);

  const byDay = useMemo(() => {
    const map = new Map<string, CalJob[]>();
    for (const j of filteredJobs) {
      const list = map.get(j.day) ?? [];
      list.push(j);
      map.set(j.day, list);
    }
    return map;
  }, [filteredJobs]);

  const upcoming = useMemo(() => {
    return [...filteredJobs].sort((a, b) => a.day.localeCompare(b.day));
  }, [filteredJobs]);

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
            s === "all" ? t("common.all") : quoteStatusLabel(locale, s);
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

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.35fr)_minmax(280px,1fr)]">
        {/* Upcoming first on phone — easier to scan than a dense month grid */}
        <section className="order-2 space-y-3 lg:order-1">
          <section className="admin-glass-panel overflow-hidden">
            <div className="flex items-center justify-between gap-3 border-b border-ink/8 px-4 py-3">
              <h2 className="font-display text-base font-semibold tracking-tight text-ink">
                {monthLabel}
              </h2>
              <span className="shrink-0 text-[0.6875rem] tabular-nums text-muted">
                {t("common.jobs", { count: filteredJobs.length })}
              </span>
            </div>
            <div className="grid grid-cols-7 border-b border-ink/8 bg-[var(--admin-thead)] text-center text-[0.625rem] font-semibold uppercase tracking-wider text-muted">
              {dow.map((d) => (
                <div key={d} className="px-0.5 py-2 sm:px-1">
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
                      className="min-h-[3.75rem] border-b border-r border-ink/5 bg-ink/[0.015] p-1 sm:min-h-[5rem] sm:p-1.5"
                    />
                  );
                }
                const dayJobs = byDay.get(day) ?? [];
                const isToday = day === todayKey;
                const hasJobs = dayJobs.length > 0;
                return (
                  <div
                    key={day}
                    className={`min-h-[3.75rem] border-b border-r border-ink/5 p-1 transition sm:min-h-[5rem] sm:p-1.5 ${
                      isToday
                        ? "bg-bronze/7 ring-1 ring-inset ring-bronze/25"
                        : hasJobs
                          ? "bg-[var(--admin-panel)]"
                          : "hover:bg-[var(--admin-row-hover)]"
                    }`}
                  >
                    <div
                      className={`flex items-center justify-between gap-0.5 text-[0.6875rem] font-semibold tabular-nums ${
                        isToday
                          ? "text-bronze-dark dark:text-bronze-light"
                          : "text-muted"
                      }`}
                    >
                      <span
                        className={
                          isToday
                            ? "inline-flex h-5 w-5 items-center justify-center rounded-full bg-bronze text-[0.625rem] font-bold text-white"
                            : undefined
                        }
                      >
                        {Number(day.slice(-2))}
                      </span>
                      {hasJobs ? (
                        <span className="hidden text-[0.5625rem] font-medium text-muted sm:inline">
                          {dayJobs.length}
                        </span>
                      ) : null}
                    </div>
                    <ul className="mt-1 space-y-0.5">
                      {dayJobs.slice(0, 2).map((j) => (
                        <li key={j.id}>
                          <Link
                            href={`/admin/quotes/${j.quoteId}`}
                            className={`block truncate rounded px-1 py-0.5 text-[0.625rem] font-medium transition hover:brightness-95 ${eventChipClass(j.status)}`}
                            title={`${t(jobTitleKey(j.status))} · ${j.customer}`}
                          >
                            <span className="hidden sm:inline">
                              {t(jobTimeKey(j.status))}{" "}
                            </span>
                            {j.customer.split(" ")[0]}
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
        </section>

        <section className="order-1 space-y-3 lg:order-2">
          <div className="flex items-baseline justify-between gap-2">
            <h2 className="admin-section-label">
              {t("pages.schedule.upcoming")}
            </h2>
            <span className="text-[0.6875rem] tabular-nums text-muted">
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
                ) : jobs.length === 0 ? (
                  <Link
                    href="/admin/quotes"
                    className="btn-secondary-light admin-touch text-sm"
                  >
                    {t("pages.schedule.emptyAction")}
                  </Link>
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
                      <div className="min-w-0 flex-1">
                        <p className="text-[0.6875rem] tabular-nums text-muted">
                          {formatYmd(j.day, dateLocale, {
                            weekday: "short",
                            month: "short",
                            day: "numeric",
                          })}
                          <span className="text-ink/25"> · </span>
                          {t(jobTimeKey(j.status))}
                          {!j.hasScheduledFor ? (
                            <>
                              <span className="text-ink/25"> · </span>
                              <span className="font-medium text-amber-800/80 dark:text-amber-200/80">
                                {t("pages.schedule.stubDay")}
                              </span>
                            </>
                          ) : null}
                        </p>
                        <p className="mt-0.5 text-sm font-semibold text-ink">
                          {t(jobTitleKey(j.status))}
                        </p>
                        <p className="mt-0.5 truncate text-sm text-muted">
                          {j.customer}
                          <span className="text-ink/25"> · </span>
                          {j.serviceType}
                        </p>
                        {j.address ? (
                          <p className="truncate text-xs text-muted-light">
                            {j.address}
                          </p>
                        ) : null}
                      </div>
                      <div className="flex shrink-0 flex-col items-end gap-1.5">
                        <StatusBadge
                          label={quoteStatusLabel(locale, j.status)}
                          tone={quoteStatusTone[j.status]}
                        />
                        <span className="text-[0.625rem] font-medium text-bronze-dark dark:text-bronze-light">
                          {t("pages.schedule.openQuote")}
                        </span>
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
          <p className="px-0.5 text-[0.6875rem] leading-relaxed text-muted">
            {t("pages.schedule.footnote")}
          </p>
        </section>
      </div>
    </>
  );
}
