import Link from "next/link";
import AdminShell from "@/components/admin/AdminShell";
import { requireAdmin } from "@/lib/admin/guard";
import { listQuotes, quoteStats } from "@/lib/admin/quotes-store";

export const metadata = { title: "Dashboard" };
export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const { warning } = await requireAdmin();
  const stats = quoteStats();
  const recent = listQuotes().slice(0, 5);

  const cards = [
    { label: "Total quotes", value: stats.total, href: "/admin/quotes" },
    { label: "New", value: stats.new, href: "/admin/quotes" },
    { label: "Scheduled", value: stats.scheduled, href: "/admin/quotes" },
    { label: "Won", value: stats.won, href: "/admin/quotes" },
  ];

  return (
    <AdminShell warning={warning}>
      <header className="mb-6">
        <h1 className="font-display text-2xl font-semibold tracking-tight text-ink">
          Dashboard
        </h1>
        <p className="mt-1 text-sm text-muted">
          Overview of quote pipeline. Invoices and payments are placeholders.
        </p>
      </header>

      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <li key={c.label}>
            <Link
              href={c.href}
              className="block rounded-xl border border-ink/10 bg-surface p-4 shadow-sm transition hover:border-bronze/40"
            >
              <p className="text-[0.6875rem] font-bold uppercase tracking-wider text-muted">
                {c.label}
              </p>
              <p className="mt-2 font-display text-3xl font-semibold text-ink">
                {c.value}
              </p>
            </Link>
          </li>
        ))}
      </ul>

      <section className="mt-8">
        <div className="mb-3 flex items-center justify-between gap-3">
          <h2 className="text-sm font-bold uppercase tracking-wider text-muted">
            Recent quotes
          </h2>
          <Link
            href="/admin/quotes"
            className="text-sm font-semibold text-bronze-dark hover:underline dark:text-bronze-light"
          >
            View all
          </Link>
        </div>
        <ul className="divide-y divide-ink/8 overflow-hidden rounded-xl border border-ink/10 bg-surface">
          {recent.map((q) => (
            <li
              key={q.id}
              className="flex flex-wrap items-baseline justify-between gap-2 px-4 py-3 text-sm"
            >
              <div>
                <span className="font-semibold text-ink">{q.name}</span>
                <span className="text-muted"> · {q.serviceType}</span>
              </div>
              <span className="rounded-full bg-ivory-muted px-2 py-0.5 text-[0.6875rem] font-semibold uppercase tracking-wide text-ink">
                {q.status}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-8 grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-dashed border-ink/15 bg-surface/70 p-4">
          <h2 className="text-sm font-bold text-ink">Invoices</h2>
          <p className="mt-1 text-sm text-muted">
            Placeholder — not live yet.
          </p>
          <Link
            href="/admin/invoices"
            className="mt-3 inline-block text-sm font-semibold text-bronze-dark dark:text-bronze-light"
          >
            Open →
          </Link>
        </div>
        <div className="rounded-xl border border-dashed border-ink/15 bg-surface/70 p-4">
          <h2 className="text-sm font-bold text-ink">Payments</h2>
          <p className="mt-1 text-sm text-muted">
            Placeholder — Stripe / ACH wiring pending.
          </p>
          <Link
            href="/admin/payments"
            className="mt-3 inline-block text-sm font-semibold text-bronze-dark dark:text-bronze-light"
          >
            Open →
          </Link>
        </div>
      </section>
    </AdminShell>
  );
}
