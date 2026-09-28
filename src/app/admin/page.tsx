import AdminShell from "@/components/admin/AdminShell";
import DashboardClient from "@/components/admin/DashboardClient";
import { requireAdmin } from "@/lib/admin/guard";
import { invoiceStats, listInvoices } from "@/lib/admin/invoices-store";
import { listPayments, paidCentsMap, paymentStats } from "@/lib/admin/payments-store";
import { listQuotes, quoteStats } from "@/lib/admin/quotes-store";
import { QUOTE_STATUSES } from "@/lib/admin/status";

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
        metaKey: "newQuote" as const,
        serviceOrStatus: q.serviceType,
      })),
    ...listInvoices()
      .filter((i) => i.status === "sent" || i.status === "partial" || i.status === "draft")
      .slice(0, 3)
      .map((i) => ({
        id: i.id,
        href: `/admin/invoices/${i.id}`,
        label: i.number,
        metaKey: "invoice" as const,
        serviceOrStatus: i.status,
        customer: i.customerName,
      })),
  ].slice(0, 5);

  const funnel = QUOTE_STATUSES.filter((s) => s !== "lost").map((s) => ({
    status: s,
    count: quotes.filter((q) => q.status === s).length,
  }));

  return (
    <AdminShell warning={warning}>
      <DashboardClient
        qStats={qStats}
        iStats={iStats}
        pStats={pStats}
        needsAction={needsAction}
        funnel={funnel}
        recent={recent.map((q) => ({
          id: q.id,
          name: q.name,
          serviceType: q.serviceType,
          address: q.address,
          status: q.status,
          createdAt: q.createdAt,
        }))}
        recentInvoices={recentInvoices.map((i) => ({
          id: i.id,
          number: i.number,
          status: i.status,
          customerName: i.customerName,
        }))}
        recentPayments={recentPayments.map((p) => ({
          id: p.id,
          invoiceNumber: p.invoiceNumber,
          amountCents: p.amountCents,
        }))}
      />
    </AdminShell>
  );
}
