"use client";

import Link from "next/link";
import EmptyState from "@/components/admin/EmptyState";
import AdminPageChrome from "@/components/admin/AdminPageChrome";
import { useAdminI18n } from "@/components/admin/LocaleProvider";
import StatusBadge from "@/components/admin/StatusBadge";
import { formatShortDate } from "@/lib/admin/format";
import { quoteStatusLabel } from "@/lib/admin/i18n";
import { quoteStatusTone, type QuoteStatus } from "@/lib/admin/status";

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

export default function CustomersClient({
  customers,
}: {
  customers: CustomerRow[];
}) {
  const { t, locale } = useAdminI18n();

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
          <ul className="admin-card-list space-y-2.5 md:hidden">
            {customers.map((c) => {
              const latestStatus = c.statuses[0] ?? "new";
              return (
                <li key={c.key} className="admin-mobile-card">
                  <div className="flex items-start gap-2.5">
                    <span
                      className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-bronze/25 to-bronze/5 text-[0.6875rem] font-bold text-bronze-dark ring-1 ring-bronze/20 dark:text-bronze-light"
                      aria-hidden
                    >
                      {c.name
                        .split(" ")
                        .map((p) => p[0])
                        .slice(0, 2)
                        .join("")
                        .toUpperCase()}
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

          <div className="admin-table-wrap admin-gold-rail hidden overflow-hidden rounded-xl border border-[color:var(--admin-border)] bg-[var(--admin-panel)] shadow-[var(--admin-shadow)] md:block">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-ink/8 bg-[var(--admin-thead)] px-3 py-2.5 sm:px-4">
              <p className="text-[0.6875rem] font-bold uppercase tracking-wider text-muted">
                {t("pages.customers.directory")}
              </p>
              <p className="text-xs text-muted">
                {t(
                  customers.length === 1
                    ? "common.contacts"
                    : "common.contacts_plural",
                  { count: customers.length },
                )}
              </p>
            </div>
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
                  {customers.map((c) => {
                    const latestStatus = c.statuses[0] ?? "new";
                    return (
                      <tr
                        key={c.key}
                        className="border-b border-ink/5 align-top last:border-0 transition-colors hover:bg-[var(--admin-row-hover)]"
                      >
                        <td className="px-3 py-3 sm:px-4">
                          <div className="flex items-start gap-2.5">
                            <span
                              className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-bronze/25 to-bronze/5 text-[0.6875rem] font-bold text-bronze-dark ring-1 ring-bronze/20 dark:text-bronze-light"
                              aria-hidden
                            >
                              {c.name
                                .split(" ")
                                .map((p) => p[0])
                                .slice(0, 2)
                                .join("")
                                .toUpperCase()}
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
  );
}
