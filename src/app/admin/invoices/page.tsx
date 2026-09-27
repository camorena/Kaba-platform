import AdminShell from "@/components/admin/AdminShell";
import InvoicesPanel from "@/components/admin/InvoicesPanel";
import PageHeader from "@/components/admin/PageHeader";
import { requireAdmin } from "@/lib/admin/guard";
import { listInvoices } from "@/lib/admin/invoices-store";
import { paidCentsMap } from "@/lib/admin/payments-store";
import { listQuotes } from "@/lib/admin/quotes-store";

export const metadata = { title: "Invoices" };
export const dynamic = "force-dynamic";

export default async function AdminInvoicesPage() {
  const { warning } = await requireAdmin();
  const invoices = listInvoices();
  const paid = paidCentsMap();
  const paidMap: Record<string, number> = {};
  paid.forEach((v, k) => {
    paidMap[k] = v;
  });
  const quotesForCreate = listQuotes().filter((q) =>
    ["won", "scheduled", "contacted", "new"].includes(q.status),
  );

  return (
    <AdminShell warning={warning}>
      <PageHeader
        title="Invoices"
        description="Demo invoices with synthetic amounts. Create drafts from quotes; PDF/email and real pricing come later."
      />
      <InvoicesPanel
        invoices={invoices}
        paidMap={paidMap}
        quotesForCreate={quotesForCreate}
      />
    </AdminShell>
  );
}
