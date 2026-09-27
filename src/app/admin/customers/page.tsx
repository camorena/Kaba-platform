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
      />

      {customers.length === 0 ? (
        <EmptyState
          title="No customers yet"
          description="Customers appear when quotes land in the store."
        />
      ) : (
        <div className="admin-table-wrap overflow-hidden rounded-xl border border-ink/10 bg-[var(--admin-panel)] shadow-[var(--shadow-xs)]">
          <div className="overflow-x-auto">
            <table className="admin-table min-w-full text-left text-sm">
              <thead>
                <tr className="border-b border-ink/10 bg-[var(--admin-thead)] text-[0.625rem] uppercase tracking-wider text-muted">
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
                      className="border-b border-ink/5 align-top last:border-0 hover:bg-[var(--admin-row-hover)]"
                    >
                      <td className="px-3 py-3 sm:px-4">
                        {quoteLink ? (
                          <Link
                            href={`/admin/quotes/${quoteLink.id}`}
                            className="font-semibold text-ink hover:underline"
                          >
                            {c.name}
                          </Link>
                        ) : (
                          <span className="font-semibold text-ink">{c.name}</span>
                        )}
                        <div className="mt-0.5 text-xs text-muted">{c.phone}</div>
                        <div className="text-xs text-muted">{c.email}</div>
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
          <div className="border-t border-ink/8 px-3 py-2 text-xs text-muted sm:px-4">
            {customers.length} customer{customers.length === 1 ? "" : "s"}
          </div>
        </div>
      )}
    </AdminShell>
  );
}
