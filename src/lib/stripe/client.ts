/**
 * Lazy Stripe SDK client — only constructed when STRIPE_SECRET_KEY is set.
 * Importing this module does not require keys (build-safe).
 */

import "server-only";

import type Stripe from "stripe";
import { getStripeSecretKey } from "@/lib/stripe/config";

let cached: Stripe | null | undefined;

/**
 * Returns a Stripe client, or null when STRIPE_SECRET_KEY is unset.
 * Callers must handle null and show the honest “not connected” path.
 */
export function getStripe(): Stripe | null {
  if (cached !== undefined) return cached;
  const key = getStripeSecretKey();
  if (!key) {
    cached = null;
    return null;
  }
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const StripeCtor = require("stripe") as typeof import("stripe").default;
  cached = new StripeCtor(key, {
    apiVersion: "2025-02-24.acacia",
    typescript: true,
  });
  return cached;
}

/** Test helper. */
export function resetStripeCache(): void {
  cached = undefined;
}
