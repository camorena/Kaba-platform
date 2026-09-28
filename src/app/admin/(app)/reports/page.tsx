import AdminPageChrome from "@/components/admin/AdminPageChrome";
import ReportsPanel from "@/components/admin/ReportsPanel";
import { listInvoices } from "@/lib/admin/invoices-store";
import { paymentStats } from "@/lib/admin/payments-store";
import { listQuotes } from "@/lib/admin/quotes-store";

export const metadata = { title: "Reports" };
export const dynamic = "force-dynamic";

export default async function AdminReportsPage() {
  const quotes = (await listQuotes()).map((q) => ({
    id: q.id,
    status: q.status,
    serviceType: q.serviceType,
    createdAt: q.createdAt,
  }));
  const invoices = (await listInvoices()).map((inv) => ({
    id: inv.id,
    status: inv.status,
    totalCents: inv.lines.reduce((s, l) => s + l.quantity * l.unitCents, 0),
    createdAt: inv.createdAt,
  }));
  const pStats = await paymentStats();

  return (
    <>
      <AdminPageChrome page="reports" />
      <ReportsPanel
        quotes={quotes}
        invoices={invoices}
        paidCents={pStats.recordedCents}
        paymentCount={pStats.total}
      />
    </>
  );
}
