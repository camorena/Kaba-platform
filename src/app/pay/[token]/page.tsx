import PayPageClient from "@/components/pay/PayPageClient";
import {
  getInvoiceByPayToken,
  invoiceSubtotalCents,
} from "@/lib/admin/invoices-store";
import {
  listPaymentsForInvoice,
  paidCentsForInvoice,
} from "@/lib/admin/payments-store";
import { buildPaymentReceiptStub } from "@/lib/pay/receipt";
import { isPubliclyPayable, isServablePayToken } from "@/lib/pay/public";
import { getPayMessages } from "@/lib/pay/messages";
import { getPublishedContactInfo } from "@/lib/cms/public";
import {
  isStripeCheckoutReady,
  suggestedDepositCents,
} from "@/lib/stripe/config";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type Search = { checkout?: string; session_id?: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<{ token: string }>;
}): Promise<Metadata> {
  const { token: raw } = await params;
  const token = decodeURIComponent(raw ?? "").trim();
  const found = isServablePayToken(token)
    ? await getInvoiceByPayToken(token)
    : undefined;
  const invoice = found && isPubliclyPayable(found) ? found : undefined;
  const m = getPayMessages("en");
  return {
    title: invoice ? `${m.invoiceLabel} ${invoice.number}` : m.notFoundTitle,
    robots: { index: false, follow: false },
  };
}

export default async function PublicPayPage({
  params,
  searchParams,
}: {
  params: Promise<{ token: string }>;
  searchParams: Promise<Search>;
}) {
  const { token: raw } = await params;
  const token = decodeURIComponent(raw ?? "").trim();
  const search = await searchParams;
  const contact = getPublishedContactInfo();

  if (!isServablePayToken(token)) {
    notFound();
  }

  const invoice = await getInvoiceByPayToken(token);
  if (!invoice || !isPubliclyPayable(invoice)) {
    notFound();
  }

  const paidCents = await paidCentsForInvoice(invoice.id);
  const total = invoiceSubtotalCents(invoice);
  const depositCents = suggestedDepositCents(total, paidCents);
  const stripeCheckoutReady = isStripeCheckoutReady();

  let checkoutState: "idle" | "success" | "cancel" = "idle";
  if (search.checkout === "success") checkoutState = "success";
  else if (search.checkout === "cancel") checkoutState = "cancel";

  let receipt = null;
  const sessionId = search.session_id?.trim();
  if (checkoutState === "success") {
    const payments = await listPaymentsForInvoice(invoice.id);
    const match = sessionId
      ? payments.find((p) => p.stripeCheckoutSessionId === sessionId)
      : payments[0];
    if (match) receipt = buildPaymentReceiptStub(match, invoice);
  }

  return (
    <PayPageClient
      token={token}
      invoice={invoice}
      paidCents={paidCents}
      depositCents={depositCents}
      stripeCheckoutReady={stripeCheckoutReady}
      checkoutState={checkoutState}
      receipt={receipt}
      contact={contact}
    />
  );
}
