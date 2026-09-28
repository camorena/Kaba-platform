import AdminShell from "@/components/admin/AdminShell";
import PageHeader from "@/components/admin/PageHeader";
import { BarChart, DonutChart, Sparkline } from "@/components/admin/MiniCharts";
import { formatMoney } from "@/lib/admin/format";
import { requireAdmin } from "@/lib/admin/guard";
import { invoiceStats, listInvoices } from "@/lib/admin/invoices-store";
import { paidCentsMap, paymentStats } from "@/lib/admin/payments-store";
import { listQuotes, quoteStats } from "@/lib/admin/quotes-store";
import { QUOTE_STATUSES } from "@/lib/admin/status";

export const metadata = { title: "Reports" };
export const dynamic = "force-dynamic";

export default async function AdminReportsPage() {
  const { warning } = await requireAdmin();
  const quotes = listQuotes();
  const qStats = quoteStats();
  const paidMap = paidCentsMap();
  const iStats = invoiceStats(paidMap);
  const pStats = paymentStats();

  const statusCounts = QUOTE_STATUSES.map(
    (s) => quotes.filter((q) => q.status === s).length,
  );

  const serviceMap = new Map<string, number>();
  for (const q of quotes) {
    serviceMap.set(q.serviceType, (serviceMap.get(q.serviceType) ?? 0) + 1);
  }
  const services = [...serviceMap.entries()].sort((a, b) => b[1] - a[1]);

  const trend = [1, 2, 2, 3, 4, quotes.length, Math.max(quotes.length, 4)];

  const invoiceSegs = [
    { label: "Open", value: iStats.open, color: "#c08b3a" },
    {
      label: "Paid",
      value: listInvoices().filter((i) => i.status === "paid").length,
      color: "#10b981",
    },
    {
      label: "Other",
      value: Math.max(
        0,
        listInvoices().length -
          iStats.open -
          listInvoices().filter((i) => i.status === "paid").length,
      ),
      color: "#64748b",
    },
  ].filter((s) => s.value > 0);

  return (
    <AdminShell warning={warning}>
      <PageHeader
        title="Reports"
        description="Lightweight ops snapshot — SVG/CSS charts only. Demo amounts; no analytics vendor."
      />

      <ul className="grid gap-2.5 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Quotes", value: String(qStats.total), hint: `${qStats.new} new` },
          {
            label: "Won rate",
            value:
              qStats.total === 0
                ? "—"
                : `${Math.round((qStats.won / qStats.total) * 100)}%`,
            hint: `${qStats.won} won`,
          },
          {
            label: "Open AR (demo)",
            value: formatMoney(iStats.totalOpenCents),
            hint: `${iStats.open} open invoices`,
          },
          {
            label: "Collected (stub)",
            value: formatMoney(pStats.recordedCents),
            hint: `${pStats.total} payments`,
          },
        ].map((c) => (
          <li key={c.label} className="admin-stat admin-stat-lift">
            <p className="admin-stat-label">{c.label}</p>
            <p className="admin-stat-value mt-1">{c.value}</p>
            <p className="mt-1 text-[0.6875rem] text-muted">{c.hint}</p>
          </li>
        ))}
      </ul>

      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        <section className="admin-glass-panel admin-gold-rail p-4 sm:p-5">
          <div className="mb-4 flex items-end justify-between gap-3">
            <div>
              <h2 className="admin-card-title">Pipeline by status</h2>
              <p className="mt-1 text-xs text-muted">Quote counts in each stage</p>
            </div>
            <Sparkline values={trend} />
          </div>
          <BarChart
            values={statusCounts}
            labels={QUOTE_STATUSES.map((s) => s.slice(0, 3))}
          />
        </section>

        <section className="admin-glass-panel admin-gold-rail p-4 sm:p-5">
          <h2 className="admin-card-title">Invoice mix</h2>
          <p className="mt-1 mb-4 text-xs text-muted">Open vs paid vs other</p>
          {invoiceSegs.length === 0 ? (
            <p className="text-sm text-muted">No invoices yet.</p>
          ) : (
            <DonutChart segments={invoiceSegs} />
          )}
        </section>

        <section className="admin-glass-panel admin-gold-rail p-4 sm:p-5 lg:col-span-2">
          <h2 className="admin-card-title">Demand by service</h2>
          <p className="mt-1 mb-4 text-xs text-muted">
            From quote service types (stub store)
          </p>
          {services.length === 0 ? (
            <p className="text-sm text-muted">No service data.</p>
          ) : (
            <ul className="space-y-2.5">
              {services.map(([name, count]) => {
                const pct = Math.round((count / quotes.length) * 100);
                return (
                  <li key={name}>
                    <div className="mb-1 flex justify-between text-sm">
                      <span className="font-medium text-ink">{name}</span>
                      <span className="tabular-nums text-muted">
                        {count} · {pct}%
                      </span>
                    </div>
                    <div className="admin-meter">
                      <div
                        className="admin-meter-fill"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </div>
    </AdminShell>
  );
}
