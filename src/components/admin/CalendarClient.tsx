"use client";

import Link from "next/link";
import AdminPageChrome from "@/components/admin/AdminPageChrome";
import EmptyState from "@/components/admin/EmptyState";
import { useAdminI18n } from "@/components/admin/LocaleProvider";
import StatusBadge from "@/components/admin/StatusBadge";
import { quoteStatusLabel } from "@/lib/admin/i18n";
import { quoteStatusTone, type QuoteStatus } from "@/lib/admin/status";

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
  const byDay = new Map<string, CalJob[]>();
  for (const j of jobs) {
    const list = byDay.get(j.day) ?? [];
    list.push(j);
    byDay.set(j.day, list);
  }

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

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <section className="admin-glass-panel admin-gold-rail overflow-hidden">
          <div className="flex items-center justify-between border-b border-ink/8 px-4 py-3">
            <h2 className="font-display text-base font-semibold text-ink">{label}</h2>
            <span className="text-[0.6875rem] text-muted">
              {t("common.jobs", { count: jobs.length })}
            </span>
          </div>
          <div className="grid grid-cols-7 border-b border-ink/8 bg-[var(--admin-thead)] text-center text-[0.625rem] font-bold uppercase tracking-wider text-muted">
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
                    isToday ? "bg-bronze/8 ring-1 ring-inset ring-bronze/30" : ""
                  }`}
                >
                  <div
                    className={`text-[0.6875rem] font-semibold tabular-nums ${
                      isToday ? "text-bronze-dark dark:text-bronze-light" : "text-muted"
                    }`}
                  >
                    {Number(day.slice(-2))}
                  </div>
                  <ul className="mt-1 space-y-0.5">
                    {dayJobs.slice(0, 2).map((j) => (
                      <li key={j.id}>
                        <Link
                          href={`/admin/quotes/${j.quoteId}`}
                          className="block truncate rounded px-1 py-0.5 text-[0.625rem] font-semibold text-ink hover:bg-bronze/15"
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
          <h2 className="admin-section-label">{t("pages.schedule.upcoming")}</h2>
          {jobs.length === 0 ? (
            <EmptyState
              title={t("pages.schedule.emptyTitle")}
              description={t("pages.schedule.emptyDesc")}
            />
          ) : (
            <ul className="space-y-2">
              {jobs.map((j) => (
                <li key={j.id}>
                  <Link
                    href={`/admin/quotes/${j.quoteId}`}
                    className="admin-card admin-card-interactive block transition"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-[0.625rem] font-bold uppercase tracking-wider text-bronze">
                          {j.day} · {j.timeLabel}
                        </p>
                        <p className="mt-0.5 font-display text-base font-semibold text-ink">
                          {j.title}
                        </p>
                        <p className="mt-0.5 text-sm text-muted">
                          {j.customer} · {j.serviceType}
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
