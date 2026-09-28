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

  return (
    <>
      <AdminPageChrome page="payments" />
      <PaymentsPanel
        payments={listPayments()}
        invoices={listInvoices()}
        preselectInvoiceId={sp.invoice ?? null}
      />
    </>
  );
}
