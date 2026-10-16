/**
 * Lightweight in-memory fixed-window rate limiter (per warm serverless instance).
 * Good enough to blunt form spam; not a distributed guarantee.
 */

type Bucket = { count: number; resetAt: number };

export type RateLimitResult = {
  ok: boolean;
  remaining: number;
  retryAfterSec: number;
};

export function createRateLimiter(opts: { windowMs: number; max: number }) {
  const buckets = new Map<string, Bucket>();

  function prune(now: number) {
    if (buckets.size < 500) return;
    for (const [key, bucket] of buckets) {
      if (bucket.resetAt <= now) buckets.delete(key);
    }
  }

  return function check(key: string): RateLimitResult {
    const now = Date.now();
    prune(now);
    const existing = buckets.get(key);
    if (!existing || existing.resetAt <= now) {
      buckets.set(key, { count: 1, resetAt: now + opts.windowMs });
      return { ok: true, remaining: opts.max - 1, retryAfterSec: 0 };
    }
    if (existing.count >= opts.max) {
      return {
        ok: false,
        remaining: 0,
        retryAfterSec: Math.max(1, Math.ceil((existing.resetAt - now) / 1000)),
      };
    }
    existing.count += 1;
    return { ok: true, remaining: opts.max - existing.count, retryAfterSec: 0 };
  };
}
