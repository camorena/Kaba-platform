/**
 * Create a Stripe Checkout Session for an invoice deposit.
 * Requires STRIPE_SECRET_KEY. Without keys → 503 honest “not connected”.
 */

import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin/auth";
import { getInvoice, invoiceSubtotalCents } from "@/lib/admin/invoices-store";
import { paidCentsForInvoice } from "@/lib/admin/payments-store";
import {
  getStripeStatus,
  suggestedDepositCents,
} from "@/lib/stripe/config";
import { getStripe } from "@/lib/stripe/client";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function appOrigin(request: Request): string {
  const env =
    process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
    process.env.VERCEL_URL?.trim();
  if (env) {
    return env.startsWith("http") ? env.replace(/\/$/, "") : `https://${env}`;
  }
  return new URL(request.url).origin;
}

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const status = getStripeStatus();
  if (!status.checkoutReady) {
    return NextResponse.json(
      {
        error:
          "Stripe is not connected. Set STRIPE_SECRET_KEY (and ideally STRIPE_WEBHOOK_SECRET + NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY).",
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

  let body: { invoiceId?: string; amountCents?: number };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  const invoiceId = String(body.invoiceId ?? "").trim();
  if (!invoiceId) {
    return NextResponse.json({ error: "invoiceId required." }, { status: 400 });
  }

  const invoice = await getInvoice(invoiceId);
  if (!invoice) {
    return NextResponse.json({ error: "Invoice not found." }, { status: 404 });
  }
  if (invoice.status === "void" || invoice.status === "paid") {
    return NextResponse.json(
      { error: `Invoice is ${invoice.status} — cannot collect a deposit.` },
      { status: 400 },
    );
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
  const successUrl = `${origin}/admin/invoices/${invoice.id}?checkout=success&session_id={CHECKOUT_SESSION_ID}`;
  const cancelUrl = `${origin}/admin/invoices/${invoice.id}?checkout=cancel`;

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
