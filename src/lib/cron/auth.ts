/**
 * Authorize Vercel Cron (or manual) invocations of /api/cron/* routes.
 *
 * Requires `Authorization: Bearer ${CRON_SECRET}` — Vercel Cron sends this
 * automatically when CRON_SECRET is set on the project. The `x-vercel-cron`
 * header is NOT trusted: any client can send it.
 *
 * No CRON_SECRET configured ⇒ every request is denied (fail closed).
 */

import { timingSafeEqual } from "node:crypto";

export function isAuthorizedCronRequest(request: Request): boolean {
  const secret = process.env.CRON_SECRET?.trim();
  if (!secret) return false;
  const auth = request.headers.get("authorization") ?? "";
  const expected = Buffer.from(`Bearer ${secret}`, "utf8");
  const actual = Buffer.from(auth, "utf8");
  if (actual.length !== expected.length) return false;
  return timingSafeEqual(actual, expected);
}
