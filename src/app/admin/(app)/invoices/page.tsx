import AdminPageChrome from "@/components/admin/AdminPageChrome";
import InvoicesPanel from "@/components/admin/InvoicesPanel";
import { listInvoices } from "@/lib/admin/invoices-store";
import { paidCentsMap } from "@/lib/admin/payments-store";
import { listQuotes } from "@/lib/admin/quotes-store";

export const metadata = { title: "Invoices" };
export const dynamic = "force-dynamic";

export default async function AdminInvoicesPage() {
  const invoices = await listInvoices();
  const paid = await paidCentsMap();
  const paidMap: Record<string, number> = {};
  paid.forEach((v, k) => {
    paidMap[k] = v;
  });
  const quotesForCreate = (await listQuotes()).filter((q) =>
    ["won", "scheduled", "contacted", "new"].includes(q.status),
  );

  return (
    <>
      <AdminPageChrome page="invoices" showDictMeta />
      <InvoicesPanel
        invoices={invoices}
        paidMap={paidMap}
        quotesForCreate={quotesForCreate}
      />
    </>
  );
}
