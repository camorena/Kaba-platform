/** Resolve public app origin for Checkout success/cancel URLs. */

export function appOrigin(request: Request): string {
  const env =
    process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
    process.env.VERCEL_URL?.trim();
  if (env) {
    return env.startsWith("http") ? env.replace(/\/$/, "") : `https://${env}`;
  }
  return new URL(request.url).origin;
}
