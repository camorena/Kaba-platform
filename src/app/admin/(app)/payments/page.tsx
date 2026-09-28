import AdminPageChrome from "@/components/admin/AdminPageChrome";
import PaymentsPanel from "@/components/admin/PaymentsPanel";
import { listInvoices } from "@/lib/admin/invoices-store";
import { listPayments } from "@/lib/admin/payments-store";
import { isStripeCheckoutReady } from "@/lib/stripe/config";

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
  const stripeCheckoutReady = isStripeCheckoutReady();

  return (
    <>
      <AdminPageChrome page="payments" showDictMeta />
      <PaymentsPanel
        payments={payments}
        invoices={invoices}
        preselectInvoiceId={sp.invoice ?? null}
        stripeCheckoutReady={stripeCheckoutReady}
      />
    </>
  );
}
