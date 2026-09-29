import InvoiceDetailClient from "@/components/admin/InvoiceDetailClient";
import { getInvoice } from "@/lib/admin/invoices-store";
import {
  listPaymentsForInvoice,
  paidCentsForInvoice,
} from "@/lib/admin/payments-store";
import {
  getPublishedContactInfo,
  getPublishedHeroCopy,
} from "@/lib/cms/public";
import { isMailReady } from "@/lib/mail";
import { isStripeCheckoutReady } from "@/lib/stripe/config";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const inv = await getInvoice(id);
  return { title: inv ? inv.number : "Invoice" };
}

export default async function AdminInvoiceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const invoice = await getInvoice(id);
  if (!invoice) notFound();

  const payments = await listPaymentsForInvoice(invoice.id);
  const paidCents = await paidCentsForInvoice(invoice.id);
  const stripeCheckoutReady = isStripeCheckoutReady();
  const mailReady = isMailReady();
  const contact = getPublishedContactInfo();
  const brand = getPublishedHeroCopy();

  return (
    <InvoiceDetailClient
      invoice={invoice}
      payments={payments}
      paidCents={paidCents}
      stripeCheckoutReady={stripeCheckoutReady}
      mailReady={mailReady}
      letterhead={{
        name: brand.name,
        tagline: brand.tagline,
        addressRegion: contact.address.region,
        phone: contact.phone,
        email: contact.email,
      }}
    />
  );
}
