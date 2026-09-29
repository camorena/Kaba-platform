/**
 * Authorize Vercel Cron (or manual) invocations of /api/cron/* routes.
 *
 * Accepts either:
 *   1. Authorization: Bearer ${CRON_SECRET}  (preferred — Vercel sends this
 *      automatically when CRON_SECRET is set on the project)
 *   2. x-vercel-cron: 1  (platform cron header — useful before CRON_SECRET is set)
 *
 * Never allow open access: if neither check passes, return false.
 */

export function isAuthorizedCronRequest(request: Request): boolean {
  const secret = process.env.CRON_SECRET?.trim();
  const auth = request.headers.get("authorization");

  if (secret) {
    if (auth === `Bearer ${secret}`) return true;
  }

  // Vercel sets this on scheduled cron invocations (clients should not spoof it
  // on production, but CRON_SECRET is still the stronger check — set it).
  const vercelCron = request.headers.get("x-vercel-cron");
  if (vercelCron === "1") return true;

  // Dev convenience: allow Bearer match against a non-empty secret only (above).
  // Without secret and without the platform header → deny.
  return false;
}
