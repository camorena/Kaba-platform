import AdminPageChrome from "@/components/admin/AdminPageChrome";
import PaymentsPanel from "@/components/admin/PaymentsPanel";
import { listInvoices } from "@/lib/admin/invoices-store";
import { listPayments } from "@/lib/admin/payments-store";

export const metadata = { title: "Payments" };
export const dynamic = "force-dynamic";

export default async function AdminPaymentsPage({
  searchParams,
}: {
  searchParams: Promise<{ invoice?: string }>;
}) {
  const sp = await searchParams;
  const payments = await listPayments();
  const invoices = await listInvoices();

  return (
    <>
      <AdminPageChrome page="payments" />
      <PaymentsPanel
        payments={payments}
        invoices={invoices}
        preselectInvoiceId={sp.invoice ?? null}
      />
    </>
  );
}
