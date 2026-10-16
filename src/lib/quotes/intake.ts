/**
 * Public lead intake — shared by the quote form (/api/quotes) and the chat
 * widget (/api/chat/lead). Persist-then-notify:
 *   1. addQuote (row is the source of truth),
 *   2. notifyQuoteCreated — owner alert (MAIL_TO_OWNERS + always-copy) and
 *      customer confirmation when an email is present,
 *   3. record notifiedAt / notifyAttempts; never lose the lead if mail fails.
 */

import "server-only";

import { addQuote, updateQuote } from "@/lib/admin/quotes-store";
import {
  notificationPatchFromResult,
  notifyQuoteCreated,
} from "@/lib/db/notify";
import type { NewQuoteInput, QuoteRecord } from "@/lib/db/types";
import { clientKeyFromRequest } from "@/lib/chat/rate-limit";
import { createRateLimiter, type RateLimitResult } from "@/lib/rate-limit";

/** Shared across quote form + chat lead: 8 submissions / 10 min per IP. */
const intakeLimiter = createRateLimiter({ windowMs: 10 * 60_000, max: 8 });

export function checkIntakeRateLimit(request: Request): RateLimitResult {
  return intakeLimiter(clientKeyFromRequest(request));
}

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const PHONE_RE = /^[\d\s().+-]{7,}$/;

export type IntakeResult = {
  quote: QuoteRecord;
  notified: boolean;
  notifyReason: string;
};

export async function createQuoteAndNotify(
  input: NewQuoteInput,
): Promise<IntakeResult> {
  const quote = await addQuote(input);

  let notified = false;
  let notifyReason = "skipped";
  try {
    const result = await notifyQuoteCreated(quote);
    notified = result.delivered;
    notifyReason = result.reason;
    await updateQuote(
      quote.id,
      notificationPatchFromResult(quote.notifyAttempts, result),
    );
  } catch (err) {
    notifyReason = err instanceof Error ? err.message : "notifyQuoteCreated threw";
    await updateQuote(quote.id, {
      notifyAttempts: quote.notifyAttempts + 1,
      notifiedAt: null,
    });
    console.error(
      "[intake] ALERT: quote %s (%s) saved but notify failed: %s",
      quote.id,
      input.source,
      notifyReason,
    );
  }
  if (!notified) {
    console.warn("[intake] quote %s (%s) owner notice not delivered: %s", quote.id, input.source, notifyReason);
  }
  return { quote, notified, notifyReason };
}
