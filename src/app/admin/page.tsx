import Link from "next/link";
import AdminShell from "@/components/admin/AdminShell";
import EmptyState from "@/components/admin/EmptyState";
import PageHeader from "@/components/admin/PageHeader";
import StatusBadge from "@/components/admin/StatusBadge";
import { requireAdmin } from "@/lib/admin/guard";
import { formatMoney, formatShortDate } from "@/lib/admin/format";
import { invoiceStats, listInvoices } from "@/lib/admin/invoices-store";
import { listPayments, paidCentsMap, paymentStats } from "@/lib/admin/payments-store";
import { listQuotes, quoteStats } from "@/lib/admin/quotes-store";
import { quoteStatusTone } from "@/lib/admin/status";

export const metadata = { title: "Dashboard" };
export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const { warning } = await requireAdmin();
  const qStats = quoteStats();
  const paidMap = paidCentsMap();
  const iStats = invoiceStats(paidMap);
  const pStats = paymentStats();
  const recent = listQuotes().slice(0, 6);
  const recentInvoices = listInvoices().slice(0, 4);
  const recentPayments = listPayments().slice(0, 4);

  const cards = [
    {
      label: "New quotes",
      value: String(qStats.new),
      href: "/admin/quotes",
      hint: `${qStats.total} total`,
    },
    {
      label: "Open invoices",
      value: String(iStats.open),
      href: "/admin/invoices",
      hint: formatMoney(iStats.totalOpenCents) + " due (demo)",
    },
    {
      label: "Payments recorded",
      value: String(pStats.total),
      href: "/admin/payments",
      hint: formatMoney(pStats.recordedCents) + " stub",
    },
    {
      label: "Won quotes",
      value: String(qStats.won),
      href: "/admin/quotes",
      hint: `${qStats.scheduled} scheduled`,
    },
  ];

  return (
    <AdminShell warning={warning}>
      <PageHeader
        title="Dashboard"
        description="Quote → invoice → payment foundation. Amounts marked demo are synthetic; auth remains a stub."
      />


      <div className="mb-4 flex flex-wrap items-center gap-2">
        {[
          { href: "/admin/quotes", label: "Quotes" },
          { href: "/admin/invoices", label: "Invoices" },
          { href: "/admin/calendar", label: "Schedule" },
          { href: "/admin/activity", label: "Activity" },
          { href: "/admin/reports", label: "Reports" },
        ].map((x) => (
          <Link
            key={x.href}
            href={x.href}
            className="admin-chip hover:border-bronze/40"
          >
            {x.label} →
          </Link>
        ))}
      </div>

      <ul className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((c) => (
          <li key={c.label}>
            <Link href={c.href} className="admin-stat admin-stat-lift block transition hover:border-bronze/35">
              <p className="admin-stat-label">{c.label}</p>
              <p className="admin-stat-value mt-1">{c.value}</p>
              <p className="mt-1 text-[0.6875rem] text-muted">{c.hint}</p>
            </Link>
          </li>
        ))}
      </ul>

      <div className="mt-5 grid gap-3.5 lg:grid-cols-5">
        <section className="lg:col-span-3">
          <div className="mb-2.5 flex items-center justify-between gap-3">
            <h2 className="text-[0.6875rem] font-bold uppercase tracking-[0.1em] text-bronze-dark">
              Recent quotes
            </h2>
            <Link
              href="/admin/quotes"
              className="text-xs font-semibold text-bronze-dark hover:underline dark:text-bronze-light"
            >
              View all
            </Link>
          </div>
          {recent.length === 0 ? (
            <EmptyState
              title="Pipeline is empty"
              description="When homeowners submit the public quote form, recent entries will show here."
            />
          ) : (
            <ul className="divide-y divide-ink/8 overflow-hidden rounded-xl border border-ink/10 bg-[var(--admin-panel)] shadow-[var(--shadow-xs)]">
              {recent.map((q) => (
                <li key={q.id}>
                  <Link
                    href={`/admin/quotes/${q.id}`}
                    className="flex flex-wrap items-center justify-between gap-2 px-3 py-2.5 text-sm transition hover:bg-[var(--admin-row-hover)] sm:px-4"
                  >
                    <div className="min-w-0">
                      <span className="font-semibold text-ink">{q.name}</span>
                      <span className="text-muted"> · {q.serviceType}</span>
                      <div className="text-[0.6875rem] text-muted-light">
                        {formatShortDate(q.createdAt)} · {q.address}
                      </div>
                    </div>
                    <StatusBadge
                      label={q.status}
                      tone={quoteStatusTone[q.status]}
                    />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="space-y-4 lg:col-span-2">
          <div>
            <div className="mb-2.5 flex items-center justify-between">
              <h2 className="text-[0.6875rem] font-bold uppercase tracking-[0.1em] text-bronze-dark">
                Invoices
              </h2>
              <Link
                href="/admin/invoices"
                className="text-xs font-semibold text-bronze-dark hover:underline dark:text-bronze-light"
              >
                All
              </Link>
            </div>
            <ul className="divide-y divide-ink/8 overflow-hidden rounded-xl border border-ink/10 bg-[var(--admin-panel)]">
              {recentInvoices.map((inv) => (
                <li key={inv.id}>
                  <Link
                    href={`/admin/invoices/${inv.id}`}
                    className="flex items-center justify-between gap-2 px-3 py-2.5 text-sm hover:bg-[var(--admin-row-hover)]"
                  >
                    <span className="font-semibold text-ink">{inv.number}</span>
                    <span className="text-xs capitalize text-muted">
                      {inv.status}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <div className="mb-2.5 flex items-center justify-between">
              <h2 className="text-[0.6875rem] font-bold uppercase tracking-[0.1em] text-bronze-dark">
                Payments
              </h2>
              <Link
                href="/admin/payments"
                className="text-xs font-semibold text-bronze-dark hover:underline dark:text-bronze-light"
              >
                All
              </Link>
            </div>
            <ul className="divide-y divide-ink/8 overflow-hidden rounded-xl border border-ink/10 bg-[var(--admin-panel)]">
              {recentPayments.map((p) => (
                <li
                  key={p.id}
                  className="flex items-center justify-between gap-2 px-3 py-2.5 text-sm"
                >
                  <span className="text-ink">{p.invoiceNumber}</span>
                  <span className="font-medium tabular-nums text-ink">
                    {formatMoney(p.amountCents)}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>
    </AdminShell>
  );
}
