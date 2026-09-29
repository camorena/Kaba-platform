/** Resolve public app origin for Checkout success/cancel URLs and customer emails. */

const FALLBACK_ORIGIN = "https://kaba-platform.vercel.app";

function originFromEnv(): string | null {
  const env =
    process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
    process.env.VERCEL_URL?.trim();
  if (!env) return null;
  return env.startsWith("http") ? env.replace(/\/$/, "") : `https://${env}`;
}

/** Public origin without a Request (webhooks, notify, cron). */
export function publicAppOrigin(): string {
  return originFromEnv() ?? FALLBACK_ORIGIN;
}

export function appOrigin(request?: Request): string {
  const fromEnv = originFromEnv();
  if (fromEnv) return fromEnv;
  if (request) {
    try {
      return new URL(request.url).origin;
    } catch {
      /* fall through */
    }
  }
  return FALLBACK_ORIGIN;
}

/** Absolute customer pay URL for an invoice pay token. */
export function invoicePayUrl(payToken: string, request?: Request): string {
  const token = payToken.trim();
  const origin = request ? appOrigin(request) : publicAppOrigin();
  return `${origin}/pay/${encodeURIComponent(token)}`;
}
