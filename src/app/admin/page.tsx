import Link from "next/link";
import AdminShell from "@/components/admin/AdminShell";
import EmptyState from "@/components/admin/EmptyState";
import { Sparkline } from "@/components/admin/MiniCharts";
import PageHeader from "@/components/admin/PageHeader";
import StatusBadge from "@/components/admin/StatusBadge";
import { requireAdmin } from "@/lib/admin/guard";
import { formatMoney, formatShortDate } from "@/lib/admin/format";
import { invoiceStats, listInvoices } from "@/lib/admin/invoices-store";
import { listPayments, paidCentsMap, paymentStats } from "@/lib/admin/payments-store";
import { listQuotes, quoteStats } from "@/lib/admin/quotes-store";
import { QUOTE_STATUSES, quoteStatusTone } from "@/lib/admin/status";

export const metadata = { title: "Dashboard" };
export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const { warning } = await requireAdmin();
  const quotes = listQuotes();
  const qStats = quoteStats();
  const paidMap = paidCentsMap();
  const iStats = invoiceStats(paidMap);
  const pStats = paymentStats();
  const recent = quotes.slice(0, 5);
  const recentInvoices = listInvoices().slice(0, 4);
  const recentPayments = listPayments().slice(0, 3);

  const needsAction = [
    ...quotes
      .filter((q) => q.status === "new")
      .map((q) => ({
        id: q.id,
        href: `/admin/quotes/${q.id}`,
        label: q.name,
        meta: `New quote · ${q.serviceType}`,
        tone: "sky" as const,
      })),
    ...listInvoices()
      .filter((i) => i.status === "sent" || i.status === "partial" || i.status === "draft")
      .slice(0, 3)
      .map((i) => ({
        id: i.id,
        href: `/admin/invoices/${i.id}`,
        label: i.number,
        meta: `${i.status} · ${i.customerName}`,
        tone: "amber" as const,
      })),
  ].slice(0, 5);

  const funnel = QUOTE_STATUSES.filter((s) => s !== "lost").map((s) => ({
    status: s,
    count: quotes.filter((q) => q.status === s).length,
  }));
  const funnelMax = Math.max(1, ...funnel.map((f) => f.count));

  const cards = [
    {
      label: "New quotes",
      value: String(qStats.new),
      href: "/admin/quotes",
      hint: `${qStats.total} total`,
      spark: [1, 1, 2, 2, 3, qStats.new || 1],
    },
    {
      label: "Open invoices",
      value: String(iStats.open),
      href: "/admin/invoices",
      hint: formatMoney(iStats.totalOpenCents) + " due",
      spark: [2, 2, 3, 2, 3, iStats.open || 1],
    },
    {
      label: "Collected",
      value: formatMoney(pStats.recordedCents),
      href: "/admin/payments",
      hint: `${pStats.total} stub payments`,
      spark: [1, 2, 2, 3, 4, Math.max(1, pStats.total)],
    },
    {
      label: "Won",
      value: String(qStats.won),
      href: "/admin/pipeline",
      hint: `${qStats.scheduled} scheduled`,
      spark: [0, 1, 1, 1, 2, qStats.won || 1],
    },
  ];

  return (
    <AdminShell warning={warning}>
      <PageHeader
        title="Dashboard"
        crumbs={[{ label: "Dashboard" }]}
        description="Dense ops brief — attention items, pipeline funnel, and recent movement. Demo amounts; auth remains a stub."
        actions={
          <div className="flex flex-wrap gap-2">
            <Link href="/admin/pipeline" className="btn-primary admin-btn-sm">
              Pipeline
            </Link>
            <Link href="/admin/pricebook" className="btn-secondary-light admin-btn-sm">
              Price book
            </Link>
          </div>
        }
      />

      <div className="mb-3.5 flex flex-wrap items-center gap-1.5">
        {[
          { href: "/admin/quotes", label: "Quotes" },
          { href: "/admin/pipeline", label: "Pipeline" },
          { href: "/admin/invoices", label: "Invoices" },
          { href: "/admin/templates", label: "Templates" },
          { href: "/admin/calendar", label: "Schedule" },
          { href: "/admin/reports", label: "Reports" },
        ].map((x) => (
          <Link key={x.href} href={x.href} className="admin-chip hover:border-bronze/40">
            {x.label} →
          </Link>
        ))}
      </div>

      {needsAction.length > 0 && (
        <section className="admin-attention mb-4 overflow-hidden rounded-xl border border-bronze/25 bg-[var(--admin-panel)] shadow-[var(--shadow-xs)]">
          <div className="flex items-center justify-between gap-2 border-b border-ink/8 bg-gradient-to-r from-bronze/12 to-transparent px-3 py-2 sm:px-4">
            <h2 className="admin-section-label">
              Needs attention
            </h2>
            <span className="text-[0.625rem] tabular-nums text-muted">
              {needsAction.length} item{needsAction.length === 1 ? "" : "s"}
            </span>
          </div>
          <ul className="divide-y divide-ink/6">
            {needsAction.map((item) => (
              <li key={item.id}>
                <Link
                  href={item.href}
                  className="flex items-center justify-between gap-3 px-3 py-2 text-sm transition hover:bg-[var(--admin-row-hover)] sm:px-4"
                >
                  <div className="min-w-0">
                    <span className="font-semibold text-ink">{item.label}</span>
                    <span className="ml-2 text-xs text-muted">{item.meta}</span>
                  </div>
                  <span className="shrink-0 text-bronze" aria-hidden>
                    →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <ul className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((c) => (
          <li key={c.label}>
            <Link
              href={c.href}
              className="admin-stat admin-stat-lift admin-stat-dense block transition hover:border-bronze/35"
            >
              <div className="flex items-start justify-between gap-2">
                <p className="admin-stat-label">{c.label}</p>
                <Sparkline values={c.spark} width={64} height={22} />
              </div>
              <p className="admin-stat-value mt-0.5">{c.value}</p>
              <p className="mt-0.5 text-[0.6875rem] text-muted">{c.hint}</p>
            </Link>
          </li>
        ))}
      </ul>

      <section className="admin-glass-panel admin-gold-rail mt-4 p-3.5 sm:p-4">
        <div className="mb-3 flex items-center justify-between gap-2">
          <h2 className="admin-section-label">
            Pipeline funnel
          </h2>
          <Link
            href="/admin/pipeline"
            className="admin-label-link"
          >
            Board
          </Link>
        </div>
        <div className="admin-funnel flex flex-wrap items-end gap-1.5 sm:gap-2">
          {funnel.map((f) => (
            <Link
              key={f.status}
              href="/admin/pipeline"
              className="admin-funnel-step group min-w-0 flex-1"
              title={`${f.status}: ${f.count}`}
            >
              <div
                className="admin-funnel-bar mx-auto rounded-t-md bg-gradient-to-t from-bronze-dark to-bronze-light transition group-hover:brightness-110"
                style={{
                  height: `${Math.max(12, Math.round((f.count / funnelMax) * 56))}px`,
                  width: "100%",
                  maxWidth: "4.5rem",
                }}
              />
              <p className="mt-1.5 text-center text-[0.625rem] font-bold uppercase tracking-wide text-muted capitalize">
                {f.status}
              </p>
              <p className="text-center text-xs font-semibold tabular-nums text-ink">
                {f.count}
              </p>
            </Link>
          ))}
        </div>
      </section>

      <div className="mt-4 grid gap-3 lg:grid-cols-5">
        <section className="lg:col-span-3">
          <div className="mb-2 flex items-center justify-between gap-3">
            <h2 className="admin-section-label">
              Recent quotes
            </h2>
            <Link
              href="/admin/quotes"
              className="admin-label-link"
            >
              View all
            </Link>
          </div>
          {recent.length === 0 ? (
            <EmptyState
              title="Pipeline is empty"
              description="When homeowners submit the public quote form, recent entries will show here."
              action={
                <Link href="/quote" className="btn-primary text-sm">
                  Open quote form
                </Link>
              }
            />
          ) : (
            <ul className="divide-y divide-[color:var(--admin-border)] overflow-hidden rounded-xl border border-[color:var(--admin-border)] bg-[var(--admin-panel)] shadow-[var(--admin-shadow)]">
              {recent.map((q) => (
                <li key={q.id}>
                  <Link
                    href={`/admin/quotes/${q.id}`}
                    className="flex flex-wrap items-center justify-between gap-2 px-3 py-2 text-sm transition hover:bg-[var(--admin-row-hover)] sm:px-3.5"
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

        <section className="space-y-3 lg:col-span-2">
          <div>
            <div className="mb-2 flex items-center justify-between">
              <h2 className="admin-section-label">
                Invoices
              </h2>
              <Link
                href="/admin/invoices"
                className="admin-label-link"
              >
                All
              </Link>
            </div>
            <ul className="divide-y divide-[color:var(--admin-border)] overflow-hidden rounded-xl border border-[color:var(--admin-border)] bg-[var(--admin-panel)] shadow-[var(--admin-shadow)]">
              {recentInvoices.map((inv) => (
                <li key={inv.id}>
                  <Link
                    href={`/admin/invoices/${inv.id}`}
                    className="flex items-center justify-between gap-2 px-3 py-2 text-sm hover:bg-[var(--admin-row-hover)]"
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
            <div className="mb-2 flex items-center justify-between">
              <h2 className="admin-section-label">
                Payments
              </h2>
              <Link
                href="/admin/payments"
                className="admin-label-link"
              >
                All
              </Link>
            </div>
            <ul className="divide-y divide-[color:var(--admin-border)] overflow-hidden rounded-xl border border-[color:var(--admin-border)] bg-[var(--admin-panel)] shadow-[var(--admin-shadow)]">
              {recentPayments.map((p) => (
                <li
                  key={p.id}
                  className="flex items-center justify-between gap-2 px-3 py-2 text-sm"
                >
                  <span className="text-ink">{p.invoiceNumber}</span>
                  <span className="font-medium tabular-nums text-ink">
                    {formatMoney(p.amountCents)}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Link
              href="/admin/templates"
              className="admin-card admin-card-interactive !p-3 text-center"
            >
              <p className="text-[0.625rem] font-bold uppercase tracking-wider text-bronze">
                Templates
              </p>
              <p className="mt-1 text-xs text-muted">Copy follow-ups</p>
            </Link>
            <Link
              href="/admin/pricebook"
              className="admin-card admin-card-interactive !p-3 text-center"
            >
              <p className="text-[0.625rem] font-bold uppercase tracking-wider text-bronze">
                Price book
              </p>
              <p className="mt-1 text-xs text-muted">Ballpark rates</p>
            </Link>
          </div>
        </section>
      </div>
    </AdminShell>
  );
}
