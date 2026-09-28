import Link from "next/link";
import AdminShell from "@/components/admin/AdminShell";
import EmptyState from "@/components/admin/EmptyState";
import PageHeader from "@/components/admin/PageHeader";
import StatusBadge from "@/components/admin/StatusBadge";
import { requireAdmin } from "@/lib/admin/guard";
import { formatShortDate } from "@/lib/admin/format";
import { listCustomers, listQuotes } from "@/lib/admin/quotes-store";
import { quoteStatusTone } from "@/lib/admin/status";

export const metadata = { title: "Customers" };
export const dynamic = "force-dynamic";

export default async function AdminCustomersPage() {
  const { warning } = await requireAdmin();
  const customers = listCustomers();
  const quotes = listQuotes();

  return (
    <AdminShell warning={warning}>
      <PageHeader
        title="Customers"
        description="Derived from quote contacts (email/phone). Not a CRM — unique keys collapse duplicate submissions."
        meta={
          <p className="mb-1 text-[0.625rem] font-bold uppercase tracking-[0.14em] text-bronze">
            Relationship layer · stub
          </p>
        }
      />

      {customers.length === 0 ? (
        <EmptyState
          title="No customers yet"
          description="Customers appear when quotes land in the store."
        />
      ) : (
        <div className="admin-table-wrap admin-gold-rail overflow-hidden rounded-xl border border-ink/10 bg-[var(--admin-panel)] shadow-[var(--shadow-xs)]">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-ink/8 bg-[var(--admin-thead)] px-3 py-2.5 sm:px-4">
            <p className="text-[0.6875rem] font-bold uppercase tracking-wider text-muted">
              Directory
            </p>
            <p className="text-xs text-muted">
              {customers.length} contact{customers.length === 1 ? "" : "s"}
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="admin-table min-w-full text-left text-sm">
              <thead>
                <tr className="border-b border-ink/10 text-[0.625rem] uppercase tracking-wider text-muted">
                  <th className="px-3 py-2.5 font-semibold sm:px-4">Customer</th>
                  <th className="px-3 py-2.5 font-semibold sm:px-4">Quotes</th>
                  <th className="hidden px-3 py-2.5 font-semibold md:table-cell sm:px-4">
                    Locations
                  </th>
                  <th className="px-3 py-2.5 font-semibold sm:px-4">Latest</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((c) => {
                  const latestStatus =
                    c.statuses[0] ??
                    quotes.find((q) => q.email === c.email)?.status ??
                    "new";
                  const quoteLink = quotes.find(
                    (q) =>
                      q.email.toLowerCase() === c.email.toLowerCase() ||
                      q.phone === c.phone,
                  );
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
                            {quoteLink ? (
                              <Link
                                href={`/admin/quotes/${quoteLink.id}`}
                                className="font-semibold text-ink hover:text-bronze-dark hover:underline dark:hover:text-bronze-light"
                              >
                                {c.name}
                              </Link>
                            ) : (
                              <span className="font-semibold text-ink">{c.name}</span>
                            )}
                            <div className="mt-0.5 text-xs text-muted">{c.phone}</div>
                            <div className="truncate text-xs text-muted">{c.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-3 sm:px-4">
                        <div className="font-medium tabular-nums text-ink">
                          {c.quoteCount}
                        </div>
                        <div className="mt-1">
                          <StatusBadge
                            label={latestStatus}
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
      )}
    </AdminShell>
  );
}
