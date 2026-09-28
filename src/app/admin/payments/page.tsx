import AdminShell from "@/components/admin/AdminShell";
import PageHeader from "@/components/admin/PageHeader";
import PaymentsPanel from "@/components/admin/PaymentsPanel";
import { requireAdmin } from "@/lib/admin/guard";
import { listInvoices } from "@/lib/admin/invoices-store";
import { listPayments } from "@/lib/admin/payments-store";

export const metadata = { title: "Payments" };
export const dynamic = "force-dynamic";

export default async function AdminPaymentsPage({
  searchParams,
}: {
  searchParams: Promise<{ invoice?: string }>;
}) {
  const { warning } = await requireAdmin();
  const sp = await searchParams;

  return (
    <AdminShell warning={warning}>
      <PageHeader
        title="Payments"
        crumbs={[
          { href: "/admin", label: "Admin" },
          { label: "Payments" },
        ]}
        description="Stub ledger linked to invoices. No Stripe, ACH, or card capture — recording only for UI foundation."
      />
      <PaymentsPanel
        payments={listPayments()}
        invoices={listInvoices()}
        preselectInvoiceId={sp.invoice ?? null}
      />
    </AdminShell>
  );
}
