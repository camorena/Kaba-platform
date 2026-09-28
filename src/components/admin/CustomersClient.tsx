"use client";

import Link from "next/link";
import EmptyState from "@/components/admin/EmptyState";
import AdminPageChrome from "@/components/admin/AdminPageChrome";
import { useAdminI18n } from "@/components/admin/LocaleProvider";
import StatusBadge from "@/components/admin/StatusBadge";
import { formatShortDate } from "@/lib/admin/format";
import { quoteStatusLabel } from "@/lib/admin/i18n";
import { quoteStatusTone, type QuoteStatus } from "@/lib/admin/status";
import { useMemo, useState } from "react";

export type CustomerRow = {
  key: string;
  name: string;
  email: string;
  phone: string;
  quoteCount: number;
  addresses: string[];
  latestQuoteAt: string;
  statuses: QuoteStatus[];
  quoteId?: string;
};

function initials(name: string): string {
  return name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function filterClass(active: boolean): string {
  return `admin-touch rounded-md px-2.5 py-1.5 text-xs font-medium transition ${
    active
      ? "bg-bronze/12 text-bronze-dark dark:text-bronze-light"
      : "text-muted hover:bg-[var(--admin-panel)] hover:text-ink"
  }`;
}

type ActivityFilter = "all" | "active" | "single";

export default function CustomersClient({
  customers,
}: {
  customers: CustomerRow[];
}) {
  const { t, locale } = useAdminI18n();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<ActivityFilter>("all");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return customers.filter((c) => {
      if (filter === "active" && c.quoteCount < 2) return false;
      if (filter === "single" && c.quoteCount !== 1) return false;
      if (!q) return true;
      const hay = [c.name, c.email, c.phone, ...c.addresses]
        .join(" ")
        .toLowerCase();
      return hay.includes(q);
    });
  }, [customers, query, filter]);

  const counts = useMemo(
    () => ({
      all: customers.length,
      active: customers.filter((c) => c.quoteCount >= 2).length,
      single: customers.filter((c) => c.quoteCount === 1).length,
    }),
    [customers],
  );

  function clearFilters() {
    setQuery("");
    setFilter("all");
  }

  return (
    <>
      <AdminPageChrome page="customers" showDictMeta />

      {customers.length === 0 ? (
        <EmptyState
          title={t("pages.customers.emptyTitle")}
          description={t("pages.customers.emptyDesc")}
        />
      ) : (
        <>
          <div className="admin-toolbar mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-1">
              {(
                [
                  ["all", t("common.all"), counts.all],
                  ["active", t("pages.customers.filterActive"), counts.active],
                  ["single", t("pages.customers.filterSingle"), counts.single],
                ] as const
              ).map(([key, label, count]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setFilter(key)}
                  className={filterClass(filter === key)}
                  aria-pressed={filter === key}
                >
                  {label} ({count})
                </button>
              ))}
            </div>
            <div className="relative min-w-0 flex-1 sm:max-w-xs sm:justify-end">
              <label htmlFor="customers-search" className="sr-only">
                {t("pages.customers.searchLabel")}
              </label>
              <input
                id="customers-search"
                type="search"
                placeholder={t("pages.customers.searchPlaceholder")}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="field-input !mt-0 w-full py-2 text-sm"
              />
            </div>
          </div>

          <p className="mb-3 text-[0.6875rem] text-muted">
            {t("common.showingOf", {
              filtered: filtered.length,
              total: customers.length,
            })}
          </p>

          {filtered.length === 0 ? (
            <EmptyState
              title={t("common.noMatches")}
              description={t("common.noMatchesDesc")}
              action={
                <button
                  type="button"
                  className="btn-secondary-light admin-touch text-sm"
                  onClick={clearFilters}
                >
                  {t("common.clearFilters")}
                </button>
              }
            />
          ) : (
            <>
              <ul className="admin-card-list space-y-2.5 md:hidden">
                {filtered.map((c) => {
                  const latestStatus = c.statuses[0] ?? "new";
                  return (
                    <li key={c.key} className="admin-mobile-card">
                      <div className="flex items-start gap-2.5">
                        <span
                          className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[color-mix(in_srgb,var(--bronze)_12%,transparent)] text-[0.6875rem] font-semibold text-bronze-dark dark:text-bronze-light"
                          aria-hidden
                        >
                          {initials(c.name)}
                        </span>
                        <div className="min-w-0 flex-1">
                          {c.quoteId ? (
                            <Link
                              href={`/admin/quotes/${c.quoteId}`}
                              className="font-semibold text-ink hover:text-bronze-dark hover:underline dark:hover:text-bronze-light"
                            >
                              {c.name}
                            </Link>
                          ) : (
                            <span className="font-semibold text-ink">{c.name}</span>
                          )}
                          <p className="mt-0.5 text-xs text-muted">{c.phone}</p>
                          <p className="truncate text-xs text-muted">{c.email}</p>
                          <div className="mt-2 flex flex-wrap items-center gap-2">
                            <StatusBadge
                              label={quoteStatusLabel(locale, latestStatus)}
                              tone={quoteStatusTone[latestStatus]}
                            />
                            <span className="text-xs text-muted">
                              {t(
                                c.quoteCount === 1
                                  ? "common.quotesCount"
                                  : "common.quotesCount_plural",
                                { count: c.quoteCount },
                              )}
                            </span>
                          </div>
                          <p className="mt-1.5 text-xs text-muted">
                            {c.addresses.join(" · ")}
                          </p>
                          <p className="mt-1 text-[0.6875rem] text-muted-light">
                            {t("common.latest", {
                              date: formatShortDate(c.latestQuoteAt),
                            })}
                          </p>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>

              <div className="admin-table-wrap hidden overflow-hidden rounded-xl border border-[color:var(--admin-border)] bg-[var(--admin-panel)] md:block">
                <div className="overflow-x-auto">
                  <table className="admin-table min-w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-ink/10 text-[0.625rem] uppercase tracking-wider text-muted">
                        <th className="px-3 py-2.5 font-semibold sm:px-4">
                          {t("pages.customers.colCustomer")}
                        </th>
                        <th className="px-3 py-2.5 font-semibold sm:px-4">
                          {t("pages.customers.colQuotes")}
                        </th>
                        <th className="hidden px-3 py-2.5 font-semibold md:table-cell sm:px-4">
                          {t("pages.customers.colLocations")}
                        </th>
                        <th className="px-3 py-2.5 font-semibold sm:px-4">
                          {t("pages.customers.colLatest")}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map((c) => {
                        const latestStatus = c.statuses[0] ?? "new";
                        return (
                          <tr
                            key={c.key}
                            className="border-b border-ink/5 align-top last:border-0 transition-colors hover:bg-[var(--admin-row-hover)]"
                          >
                            <td className="px-3 py-3 sm:px-4">
                              <div className="flex items-start gap-2.5">
                                <span
                                  className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[color-mix(in_srgb,var(--bronze)_12%,transparent)] text-[0.6875rem] font-semibold text-bronze-dark dark:text-bronze-light"
                                  aria-hidden
                                >
                                  {initials(c.name)}
                                </span>
                                <div className="min-w-0">
                                  {c.quoteId ? (
                                    <Link
                                      href={`/admin/quotes/${c.quoteId}`}
                                      className="font-semibold text-ink hover:text-bronze-dark hover:underline dark:hover:text-bronze-light"
                                    >
                                      {c.name}
                                    </Link>
                                  ) : (
                                    <span className="font-semibold text-ink">
                                      {c.name}
                                    </span>
                                  )}
                                  <div className="mt-0.5 text-xs text-muted">
                                    {c.phone}
                                  </div>
                                  <div className="truncate text-xs text-muted">
                                    {c.email}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-3 py-3 sm:px-4">
                              <div className="font-medium tabular-nums text-ink">
                                {c.quoteCount}
                              </div>
                              <div className="mt-1">
                                <StatusBadge
                                  label={quoteStatusLabel(locale, latestStatus)}
                                  tone={quoteStatusTone[latestStatus]}
                                />
                              </div>
                            </td>
                            <td className="hidden px-3 py-3 text-muted md:table-cell sm:px-4">
                              {c.addresses.join(" · ")}
                            </td>
                            <td className="whitespace-nowrap px-3 py-3 text-muted sm:px-4">
                              {formatShortDate(c.latestQuoteAt)}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </>
      )}
    </>
  );
}
