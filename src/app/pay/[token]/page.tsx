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
import { isValidPayTokenShape } from "@/lib/pay/token";
import { getPayMessages } from "@/lib/pay/messages";
import { siteConfig } from "@/lib/site";
import {
  isStripeCheckoutReady,
  suggestedDepositCents,
} from "@/lib/stripe/config";
import type { Metadata } from "next";
import Link from "next/link";

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
  const invoice =
    token && isValidPayTokenShape(token)
      ? await getInvoiceByPayToken(token)
      : undefined;
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
  const m = getPayMessages("en");

  if (!token || !isValidPayTokenShape(token)) {
    return <PayNotFound title={m.notFoundTitle} body={m.notFoundBody} />;
  }

  const invoice = await getInvoiceByPayToken(token);
  if (!invoice) {
    return <PayNotFound title={m.notFoundTitle} body={m.notFoundBody} />;
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
    />
  );
}

function PayNotFound({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-xl border border-ink/10 px-5 py-8 text-center">
      <h1 className="font-display text-xl font-semibold text-ink">{title}</h1>
      <p className="mx-auto mt-2 max-w-md text-sm text-muted">{body}</p>
      <p className="mt-4 text-sm">
        <a
          href={siteConfig.phoneHref}
          className="font-semibold text-bronze-dark hover:underline dark:text-bronze-light"
        >
          {siteConfig.phone}
        </a>
        {" · "}
        <Link href="/" className="font-semibold text-ink hover:underline">
          {siteConfig.name}
        </Link>
      </p>
    </div>
  );
}
