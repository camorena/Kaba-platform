/**
 * Stripe webhook — persist-then-notify style:
 *   1. Verify signature
 *   2. Write payment row (idempotent by event.id)
 *   3. Invoice status update happens inside payments.record
 *
 * Without STRIPE_SECRET_KEY + STRIPE_WEBHOOK_SECRET → 503.
 * No live charges in demo without keys.
 */

import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { getInvoice } from "@/lib/admin/invoices-store";
import { recordPayment } from "@/lib/admin/payments-store";
import { notifyPaymentReceived } from "@/lib/db/notify";
import { buildPaymentReceiptStub } from "@/lib/pay/receipt";
import { getStripe } from "@/lib/stripe/client";
import {
  getStripeStatus,
  getStripeWebhookSecret,
} from "@/lib/stripe/config";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const status = getStripeStatus();
  if (!status.webhookReady) {
    return NextResponse.json(
      {
        error:
          "Stripe webhook not configured. Set STRIPE_SECRET_KEY and STRIPE_WEBHOOK_SECRET.",
        stripe: status,
      },
      { status: 503 },
    );
  }

  const stripe = getStripe();
  const webhookSecret = getStripeWebhookSecret();
  if (!stripe || !webhookSecret) {
    return NextResponse.json(
      { error: "Stripe webhook not configured." },
      { status: 503 },
    );
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json(
      { error: "Missing stripe-signature header." },
      { status: 400 },
    );
  }

  const rawBody = await request.text();
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Invalid signature";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  try {
    if (event.type === "checkout.session.completed") {
      await handleCheckoutCompleted(event);
    }
    // Other event types acknowledged (no-op) so Stripe stops retrying.
  } catch (err) {
    console.error("[stripe/webhook]", event.id, err);
    return NextResponse.json(
      { error: "Webhook handler failed." },
      { status: 500 },
    );
  }

  return NextResponse.json({ received: true, eventId: event.id });
}

async function handleCheckoutCompleted(event: Stripe.Event): Promise<void> {
  const session = event.data.object as Stripe.Checkout.Session;
  const invoiceId = String(session.metadata?.invoiceId ?? "").trim();
  if (!invoiceId) {
    console.warn(
      "[stripe/webhook] checkout.session.completed missing metadata.invoiceId",
      session.id,
    );
    return;
  }

  const amountCents =
    typeof session.amount_total === "number" ? session.amount_total : 0;
  if (amountCents <= 0) {
    console.warn(
      "[stripe/webhook] checkout.session.completed with zero amount",
      session.id,
    );
    return;
  }

  const paymentIntent =
    typeof session.payment_intent === "string"
      ? session.payment_intent
      : session.payment_intent?.id ?? "";

  const payment = await recordPayment({
    invoiceId,
    amountCents,
    method: "card",
    reference: paymentIntent || session.id,
    notes: `Stripe Checkout deposit · ${session.id}`,
    stripeEventId: event.id,
    stripeCheckoutSessionId: session.id,
    demo: !event.livemode,
  });

  if (!payment) {
    throw new Error(
      `Failed to record payment for invoice ${invoiceId} (session ${session.id})`,
    );
  }

  // Persist-then-notify: payment row is source of truth; notify is best-effort.
  const invoice = await getInvoice(invoiceId);
  if (invoice) {
    const notify = await notifyPaymentReceived({ payment, invoice });
    const receipt = buildPaymentReceiptStub(payment, invoice);
    console.info(
      "[stripe/webhook] payment recorded",
      payment.id,
      "notify:",
      notify.reason,
      "receipt:",
      receipt.receiptNumber,
    );
  }
}
