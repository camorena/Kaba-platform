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

/** Reserved prefix of the memory adapter's seed tokens (never valid in Postgres). */
export const DEMO_PAY_TOKEN_PREFIX = "kf_pay_demo_";

export function isDemoPayToken(token: string): boolean {
  return token.startsWith(DEMO_PAY_TOKEN_PREFIX);
}

export function payPath(token: string): string {
  return `/pay/${encodeURIComponent(token)}`;
}
