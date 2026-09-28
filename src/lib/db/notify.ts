/**
 * Persist-then-notify — email after the quote / payment row exists.
 *
 * Contract (prior kaba-fence pattern):
 *   1. Persist the row (source of truth).
 *   2. Attempt notify via optional Resend or SMTP (env).
 *   3. On success, set notifiedAt; on failure, increment notifyAttempts and leave notifiedAt null.
 *   4. Never lose a lead / payment because mail failed.
 *
 * Without MAIL_FROM + (RESEND_API_KEY | SMTP_HOST): honest no-op with clear reason.
 */

import type { InvoiceRecord, PaymentRecord, QuoteRecord } from "@/lib/db/types";
import { formatMoney } from "@/lib/admin/format";
import {
  getMailStatus,
  resolveOwnerEmails,
  sendMail,
} from "@/lib/mail";
import { siteConfig } from "@/lib/site";
import { buildPaymentReceiptStub } from "@/lib/pay/receipt";

export type NotifyQuoteResult = {
  delivered: boolean;
  reason: string;
};

export type NotifyPaymentResult = {
  delivered: boolean;
  reason: string;
};

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

/**
 * Owner notification after a quote is saved.
 * Persist-then-notify — must not throw away the saved row (callers catch).
 */
export async function notifyQuoteCreated(
  quote: QuoteRecord,
): Promise<NotifyQuoteResult> {
  const status = getMailStatus();
  if (!status.ready) {
    return {
      delivered: false,
      reason:
        "notifyQuoteCreated no-op — configure MAIL_FROM + RESEND_API_KEY or SMTP_HOST (Settings → Platform).",
    };
  }

  const owners = resolveOwnerEmails();
  if (!owners.length) {
    return {
      delivered: false,
      reason: "No owner recipients (set MAIL_TO_OWNERS or site email).",
    };
  }

  const subject = `[${siteConfig.name}] New quote · ${quote.name}`;
  const lines = [
    `New quote request saved (${quote.id}).`,
    "",
    `Name: ${quote.name}`,
    `Email: ${quote.email || "—"}`,
    `Phone: ${quote.phone || "—"}`,
    `Preferred contact: ${quote.preferredContact || "—"}`,
    `Address: ${quote.address || "—"}`,
    `Source: ${quote.source || "—"}`,
    "",
    "Description:",
    quote.description || "(none)",
    "",
    `Admin: /admin/quotes/${quote.id}`,
  ];
  const text = lines.join("\n");

  const result = await sendMail({
    to: owners,
    subject,
    text,
    html: `<pre style="font-family:system-ui,sans-serif;white-space:pre-wrap">${escapeHtml(text)}</pre>`,
    replyTo: quote.email || undefined,
  });

  return {
    delivered: result.delivered,
    reason: result.reason,
  };
}

/**
 * After webhook (or manual record) persists a payment — optional owner + customer notify.
 * Payment row is source of truth; notify is best-effort.
 */
export async function notifyPaymentReceived(input: {
  payment: PaymentRecord;
  invoice: InvoiceRecord;
}): Promise<NotifyPaymentResult> {
  const status = getMailStatus();
  if (!status.ready) {
    return {
      delivered: false,
      reason:
        "notifyPaymentReceived no-op — configure MAIL_FROM + RESEND_API_KEY or SMTP_HOST (Settings → Platform).",
    };
  }

  const { payment, invoice } = input;
  const receipt = buildPaymentReceiptStub(payment, invoice);
  const amountLabel = formatMoney(payment.amountCents);
  const owners = resolveOwnerEmails();
  const customerEmail = invoice.customerEmail?.trim() || null;

  const recipients = [
    ...owners,
    ...(customerEmail ? [customerEmail] : []),
  ];
  // Dedupe
  const to = [...new Set(recipients.map((e) => e.toLowerCase()))].map((lower) => {
    const original = recipients.find((r) => r.toLowerCase() === lower);
    return original ?? lower;
  });

  if (!to.length) {
    return {
      delivered: false,
      reason: "No recipients for payment notify (owners or invoice email).",
    };
  }

  const subject = `[${siteConfig.name}] Payment received · ${invoice.number} · ${amountLabel}`;
  const lines = [
    `Payment recorded for invoice ${invoice.number}.`,
    "",
    `Receipt: ${receipt.receiptNumber}`,
    `Amount: ${amountLabel}`,
    `Method: ${payment.method}`,
    `Customer: ${invoice.customerName || "—"}`,
    `Invoice: ${invoice.number} (${invoice.id})`,
    `Payment id: ${payment.id}`,
    payment.reference ? `Reference: ${payment.reference}` : null,
    "",
    "This message is sent after the ledger row was saved (persist-then-notify).",
  ]
    .filter((line): line is string => line !== null)
    .join("\n");

  const result = await sendMail({
    to,
    subject,
    text: lines,
    html: `<pre style="font-family:system-ui,sans-serif;white-space:pre-wrap">${escapeHtml(lines)}</pre>`,
    replyTo: siteConfig.email || undefined,
  });

  return {
    delivered: result.delivered,
    reason: result.reason,
  };
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
