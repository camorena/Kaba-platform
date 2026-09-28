/**
 * Persist-then-notify — email / SMS after the quote row exists.
 *
 * Contract (prior kaba-fence pattern):
 *   1. Persist the quote (source of truth).
 *   2. Attempt notifyOwners(quote).
 *   3. On success, set notifiedAt; on failure, increment notifyAttempts and leave notifiedAt null.
 *   4. Never lose a lead because mail failed.
 *
 * Today: no-op stub with a clear TODO. Wire Nodemailer / Resend / etc. later.
 */

import type { InvoiceRecord, PaymentRecord, QuoteRecord } from "@/lib/db/types";

export type NotifyQuoteResult = {
  /** Always false until a real mailer is wired. */
  delivered: boolean;
  /** Human-readable reason for logs / admin UI. */
  reason: string;
};

/**
 * Owner notification hook. Intentionally a no-op.
 *
 * TODO(mail): send owner alert (and optional customer confirmation) via
 * configured transport; return { delivered: true } only after accept from the provider.
 */
export async function notifyQuoteCreated(
  quote: QuoteRecord,
): Promise<NotifyQuoteResult> {
  // Persist-then-notify stub — do not throw; callers must keep the saved row.
  void quote;
  return {
    delivered: false,
    reason:
      "notifyQuoteCreated is a no-op stub — configure mail transport before production leads.",
  };
}

/** Mark notification outcome on a quote-shaped patch (repo.update). */
export function notificationPatchFromResult(
  previousAttempts: number,
  result: NotifyQuoteResult,
): Pick<QuoteRecord, "notifiedAt" | "notifyAttempts"> {
  return {
    notifiedAt: result.delivered ? new Date().toISOString() : null,
    notifyAttempts: previousAttempts + 1,
  };
}


export type NotifyPaymentResult = {
  /** Always false until a real mailer is wired. */
  delivered: boolean;
  reason: string;
};

/**
 * After webhook (or manual record) persists a payment — optional owner/customer notify.
 * Intentionally a no-op stub; receipt stub is built separately for the pay UI.
 *
 * TODO(mail): email receipt + owner alert once transport exists.
 */
export async function notifyPaymentReceived(input: {
  payment: PaymentRecord;
  invoice: InvoiceRecord;
}): Promise<NotifyPaymentResult> {
  void input;
  return {
    delivered: false,
    reason:
      "notifyPaymentReceived is a no-op stub — configure mail transport before production receipts.",
  };
}
