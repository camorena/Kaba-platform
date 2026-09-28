/**
 * Stripe env posture — never throws; build/demo safe without keys.
 *
 *   STRIPE_SECRET_KEY              — server Checkout / API
 *   STRIPE_WEBHOOK_SECRET          — webhook signature verify
 *   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY — client (Checkout redirect needs secret only)
 */

export type StripeStatus = {
  secretKeyConfigured: boolean;
  publishableKeyConfigured: boolean;
  webhookSecretConfigured: boolean;
  /** Secret present — can create Checkout Sessions. */
  checkoutReady: boolean;
  /** Secret + webhook secret — can verify and record from webhooks. */
  webhookReady: boolean;
  /** Honest UI badge: not_connected | checkout_ready | connected */
  badge: "not_connected" | "checkout_ready" | "connected";
};

function present(value: string | undefined): boolean {
  return Boolean(value?.trim());
}

export function getStripeSecretKey(): string | null {
  const v = process.env.STRIPE_SECRET_KEY?.trim();
  return v || null;
}

export function getStripeWebhookSecret(): string | null {
  const v = process.env.STRIPE_WEBHOOK_SECRET?.trim();
  return v || null;
}

export function getStripePublishableKey(): string | null {
  const v = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY?.trim();
  return v || null;
}

export function getStripeStatus(): StripeStatus {
  const secretKeyConfigured = present(process.env.STRIPE_SECRET_KEY);
  const publishableKeyConfigured = present(
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
  );
  const webhookSecretConfigured = present(process.env.STRIPE_WEBHOOK_SECRET);
  const checkoutReady = secretKeyConfigured;
  const webhookReady = secretKeyConfigured && webhookSecretConfigured;

  let badge: StripeStatus["badge"] = "not_connected";
  if (webhookReady) badge = "connected";
  else if (checkoutReady) badge = "checkout_ready";

  return {
    secretKeyConfigured,
    publishableKeyConfigured,
    webhookSecretConfigured,
    checkoutReady,
    webhookReady,
    badge,
  };
}

/** True when Checkout Sessions can be created (secret key only). */
export function isStripeCheckoutReady(): boolean {
  return getStripeStatus().checkoutReady;
}

/**
 * Suggested deposit: 50% of invoice total, capped at remaining balance.
 * Returns 0 when nothing is owed.
 */
export function suggestedDepositCents(
  totalCents: number,
  paidCents: number,
): number {
  const total = Math.max(0, Math.round(totalCents));
  const paid = Math.max(0, Math.round(paidCents));
  const balance = Math.max(0, total - paid);
  if (balance <= 0 || total <= 0) return 0;
  const half = Math.ceil(total * 0.5);
  return Math.min(balance, half);
}
