/**
 * Public Checkout Session for an invoice deposit — authenticated by pay token only.
 * No admin cookie. Without Stripe keys → 503 with honest posture.
 */

import { NextResponse } from "next/server";
import { getInvoiceByPayToken, invoiceSubtotalCents } from "@/lib/admin/invoices-store";
import { paidCentsForInvoice } from "@/lib/admin/payments-store";
import { appOrigin } from "@/lib/pay/origin";
import { isValidPayTokenShape, payPath } from "@/lib/pay/token";
import { getStripe } from "@/lib/stripe/client";
import {
  getStripeStatus,
  suggestedDepositCents,
} from "@/lib/stripe/config";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(
  request: Request,
  context: { params: Promise<{ token: string }> },
) {
  const { token: raw } = await context.params;
  const token = decodeURIComponent(raw ?? "").trim();
  if (!token || !isValidPayTokenShape(token)) {
    return NextResponse.json({ error: "Invalid pay token." }, { status: 400 });
  }

  const status = getStripeStatus();
  if (!status.checkoutReady) {
    return NextResponse.json(
      {
        error:
          "Online card payment is not available. Stripe keys are not configured.",
        stripe: status,
      },
      { status: 503 },
    );
  }

  const stripe = getStripe();
  if (!stripe) {
    return NextResponse.json(
      { error: "Stripe client unavailable.", stripe: status },
      { status: 503 },
    );
  }

  const invoice = await getInvoiceByPayToken(token);
  if (!invoice) {
    return NextResponse.json({ error: "Invoice not found." }, { status: 404 });
  }
  if (invoice.status === "void" || invoice.status === "paid") {
    return NextResponse.json(
      { error: `Invoice is ${invoice.status} — cannot collect a deposit.` },
      { status: 400 },
    );
  }

  let body: { amountCents?: number } = {};
  try {
    const text = await request.text();
    if (text.trim()) body = JSON.parse(text) as { amountCents?: number };
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  const total = invoiceSubtotalCents(invoice);
  const paid = await paidCentsForInvoice(invoice.id);
  const balance = Math.max(0, total - paid);
  if (balance <= 0) {
    return NextResponse.json(
      { error: "Invoice has no remaining balance." },
      { status: 400 },
    );
  }

  let amountCents = Math.round(Number(body.amountCents));
  if (!Number.isFinite(amountCents) || amountCents <= 0) {
    amountCents = suggestedDepositCents(total, paid);
  }
  if (amountCents > balance) amountCents = balance;
  if (amountCents < 50) {
    return NextResponse.json(
      { error: "Amount too small for Stripe Checkout (min $0.50)." },
      { status: 400 },
    );
  }

  const origin = appOrigin(request);
  const path = payPath(invoice.payToken);
  const successUrl = `${origin}${path}?checkout=success&session_id={CHECKOUT_SESSION_ID}`;
  const cancelUrl = `${origin}${path}?checkout=cancel`;

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: "usd",
          unit_amount: amountCents,
          product_data: {
            name: `Deposit — ${invoice.number}`,
            description: `${invoice.customerName} · Kaba Fence invoice deposit`,
          },
        },
      },
    ],
    customer_email: invoice.customerEmail?.trim() || undefined,
    metadata: {
      invoiceId: invoice.id,
      invoiceNumber: invoice.number,
      purpose: "invoice_deposit",
      payToken: invoice.payToken,
    },
    success_url: successUrl,
    cancel_url: cancelUrl,
  });

  return NextResponse.json({
    sessionId: session.id,
    url: session.url,
    amountCents,
    invoiceId: invoice.id,
  });
}
