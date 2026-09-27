import AdminShell from "@/components/admin/AdminShell";
import InvoiceDetailClient from "@/components/admin/InvoiceDetailClient";
import { requireAdmin } from "@/lib/admin/guard";
import { getInvoice } from "@/lib/admin/invoices-store";
import {
  listPaymentsForInvoice,
  paidCentsForInvoice,
} from "@/lib/admin/payments-store";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const inv = getInvoice(id);
  return { title: inv ? inv.number : "Invoice" };
}

export default async function AdminInvoiceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { warning } = await requireAdmin();
  const { id } = await params;
  const invoice = getInvoice(id);
  if (!invoice) notFound();

  return (
    <AdminShell warning={warning}>
      <InvoiceDetailClient
        invoice={invoice}
        payments={listPaymentsForInvoice(invoice.id)}
        paidCents={paidCentsForInvoice(invoice.id)}
      />
    </AdminShell>
  );
}
