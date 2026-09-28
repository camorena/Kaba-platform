/**
 * Opaque invoice pay tokens — customer can open /pay/[token] without an admin cookie.
 * Tokens are stored on the invoice row (memory + Postgres).
 */

import { randomBytes } from "node:crypto";

const TOKEN_RE = /^kf_[A-Za-z0-9_-]{16,64}$/;

/** Generate a new opaque pay token (prefix + 18 random bytes, base64url). */
export function generatePayToken(): string {
  return `kf_${randomBytes(18).toString("base64url")}`;
}

export function isValidPayTokenShape(token: string): boolean {
  return TOKEN_RE.test(token.trim());
}

/** Stable demo tokens so docs / demos can deep-link without guessing. */
export const DEMO_PAY_TOKENS = {
  inv_seed_1: "kf_pay_demo_1001_alicia",
  inv_seed_2: "kf_pay_demo_1002_chris",
  inv_seed_3: "kf_pay_demo_1003_sam",
} as const;

export function payPath(token: string): string {
  return `/pay/${encodeURIComponent(token)}`;
}
