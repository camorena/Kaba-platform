import AdminShell from "@/components/admin/AdminShell";
import PageHeader from "@/components/admin/PageHeader";
import ReportsPanel from "@/components/admin/ReportsPanel";
import { requireAdmin } from "@/lib/admin/guard";
import { listInvoices } from "@/lib/admin/invoices-store";
import { paymentStats } from "@/lib/admin/payments-store";
import { listQuotes } from "@/lib/admin/quotes-store";

export const metadata = { title: "Reports" };
export const dynamic = "force-dynamic";

export default async function AdminReportsPage() {
  const { warning } = await requireAdmin();
  const quotes = listQuotes().map((q) => ({
    id: q.id,
    status: q.status,
    serviceType: q.serviceType,
    createdAt: q.createdAt,
  }));
  const invoices = listInvoices().map((inv) => ({
    id: inv.id,
    status: inv.status,
    totalCents: inv.lines.reduce((s, l) => s + l.quantity * l.unitCents, 0),
    createdAt: inv.createdAt,
  }));
  const pStats = paymentStats();

  return (
    <AdminShell warning={warning}>
      <PageHeader
        title="Reports"
        description="Lightweight ops snapshot — SVG/CSS charts only. Demo amounts; no analytics vendor."
        crumbs={[
          { href: "/admin", label: "Admin" },
          { label: "Reports" },
        ]}
      />
      <ReportsPanel
        quotes={quotes}
        invoices={invoices}
        paidCents={pStats.recordedCents}
        paymentCount={pStats.total}
      />
    </AdminShell>
  );
}
