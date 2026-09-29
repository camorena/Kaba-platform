/**
 * Persist-then-notify — email after the quote / payment / invoice row exists.
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
import { getPublishedContactInfo, getPublishedHeroCopy } from "@/lib/cms/public";
import { buildPaymentReceiptStub } from "@/lib/pay/receipt";
import { invoicePayUrl, publicAppOrigin } from "@/lib/pay/origin";

export type NotifyQuoteResult = {
  delivered: boolean;
  reason: string;
};

export type NotifyPaymentResult = {
  delivered: boolean;
  reason: string;
  ownerDelivered?: boolean;
  customerDelivered?: boolean;
};

export type NotifyPayLinkResult = {
  delivered: boolean;
  reason: string;
  payUrl?: string;
  to?: string;
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

function invoiceTotalCents(invoice: InvoiceRecord): number {
  return invoice.lines.reduce((s, l) => s + l.quantity * l.unitCents, 0);
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function htmlPre(text: string): string {
  return `<pre style="font-family:system-ui,sans-serif;white-space:pre-wrap">${escapeHtml(text)}</pre>`;
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

  const brandName = getPublishedHeroCopy().name;
  const subject = `[${brandName}] New quote · ${quote.name}`;
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
    `Admin: ${publicAppOrigin()}/admin/quotes/${quote.id}`,
  ];
  const text = lines.join("\n");

  const result = await sendMail({
    to: owners,
    subject,
    text,
    html: htmlPre(text),
    replyTo: quote.email || undefined,
  });

  return {
    delivered: result.delivered,
    reason: result.reason,
  };
}

/**
 * Admin action — email the customer their invoice summary + public pay URL.
 * Does not change invoice status; caller may mark "sent" separately.
 */
export async function notifyInvoicePayLink(
  invoice: InvoiceRecord,
  opts?: { request?: Request },
): Promise<NotifyPayLinkResult> {
  const status = getMailStatus();
  if (!status.ready) {
    return {
      delivered: false,
      reason:
        "Mail not configured — set MAIL_FROM plus RESEND_API_KEY or SMTP_HOST (Settings → Platform).",
    };
  }

  const to = invoice.customerEmail?.trim() || "";
  if (!to) {
    return {
      delivered: false,
      reason: "Invoice has no customer email.",
    };
  }

  const token = invoice.payToken?.trim() || "";
  if (!token) {
    return {
      delivered: false,
      reason: "Invoice has no pay token.",
    };
  }

  const payUrl = invoicePayUrl(token, opts?.request);
  const brandName = getPublishedHeroCopy().name;
  const contact = getPublishedContactInfo();
  const total = invoiceTotalCents(invoice);
  const totalLabel = formatMoney(total);

  const lineRows = invoice.lines
    .map((l) => {
      const amt = formatMoney(l.quantity * l.unitCents);
      return `  • ${l.description} × ${l.quantity} @ ${formatMoney(l.unitCents)} = ${amt}`;
    })
    .join("\n");

  const subject = `[${brandName}] Invoice ${invoice.number} · Pay online`;
  const lines = [
    `Hello ${invoice.customerName || "there"},`,
    "",
    `Here is your invoice from ${brandName}.`,
    "",
    `Invoice: ${invoice.number}`,
    `Total: ${totalLabel}`,
    invoice.address ? `Job address: ${invoice.address}` : null,
    "",
    "Line items:",
    lineRows || "  (none)",
    invoice.notes ? `\nNotes:\n${invoice.notes}` : null,
    "",
    "Pay online (secure link — no login required):",
    payUrl,
    "",
    contact.phone ? `Phone: ${contact.phone}` : null,
    contact.email ? `Email: ${contact.email}` : null,
    "",
    `Thank you,`,
    brandName,
  ]
    .filter((line): line is string => line !== null)
    .join("\n");

  const result = await sendMail({
    to,
    subject,
    text: lines,
    html: htmlPre(lines),
    replyTo: contact.email || undefined,
  });

  return {
    delivered: result.delivered,
    reason: result.reason,
    payUrl,
    to,
  };
}

/**
 * After webhook (or manual record) persists a payment — owner notice + customer receipt.
 * Payment row is source of truth; notify is best-effort (separate sends).
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
      ownerDelivered: false,
      customerDelivered: false,
    };
  }

  const { payment, invoice } = input;
  const receipt = buildPaymentReceiptStub(payment, invoice);
  const amountLabel = formatMoney(payment.amountCents);
  const owners = resolveOwnerEmails();
  const customerEmail = invoice.customerEmail?.trim() || null;
  const brandName = getPublishedHeroCopy().name;
  const contact = getPublishedContactInfo();
  const replyTo = contact.email || undefined;

  let ownerDelivered = false;
  let customerDelivered = false;
  const reasons: string[] = [];

  if (owners.length) {
    const ownerSubject = `[${brandName}] Payment received · ${invoice.number} · ${amountLabel}`;
    const ownerText = [
      `Payment recorded for invoice ${invoice.number}.`,
      "",
      `Receipt: ${receipt.receiptNumber}`,
      `Amount: ${amountLabel}`,
      `Method: ${payment.method}`,
      `Customer: ${invoice.customerName || "—"}`,
      `Customer email: ${customerEmail || "—"}`,
      `Invoice: ${invoice.number} (${invoice.id})`,
      `Payment id: ${payment.id}`,
      payment.reference ? `Reference: ${payment.reference}` : null,
      "",
      `Admin: ${publicAppOrigin()}/admin/invoices/${invoice.id}`,
      "",
      "This message is sent after the ledger row was saved (persist-then-notify).",
    ]
      .filter((line): line is string => line !== null)
      .join("\n");

    const ownerResult = await sendMail({
      to: owners,
      subject: ownerSubject,
      text: ownerText,
      html: htmlPre(ownerText),
      replyTo: customerEmail || replyTo,
    });
    ownerDelivered = ownerResult.delivered;
    reasons.push(
      ownerResult.delivered
        ? `Owner notice delivered (${ownerResult.transport}).`
        : `Owner notice failed: ${ownerResult.reason}`,
    );
  } else {
    reasons.push("No owner recipients (set MAIL_TO_OWNERS or site email).");
  }

  if (customerEmail) {
    const customerSubject = `[${brandName}] Payment receipt · ${invoice.number} · ${amountLabel}`;
    const customerText = [
      `Hello ${invoice.customerName || "there"},`,
      "",
      `Thank you — we received your payment.`,
      "",
      `Receipt: ${receipt.receiptNumber}`,
      `Invoice: ${invoice.number}`,
      `Amount paid: ${amountLabel}`,
      `Method: ${payment.method}`,
      payment.reference ? `Reference: ${payment.reference}` : null,
      "",
      contact.phone ? `Questions? Call ${contact.phone}` : null,
      contact.email ? `Or email ${contact.email}` : null,
      "",
      `Thank you,`,
      brandName,
    ]
      .filter((line): line is string => line !== null)
      .join("\n");

    const customerResult = await sendMail({
      to: customerEmail,
      subject: customerSubject,
      text: customerText,
      html: htmlPre(customerText),
      replyTo,
    });
    customerDelivered = customerResult.delivered;
    reasons.push(
      customerResult.delivered
        ? `Customer receipt delivered (${customerResult.transport}).`
        : `Customer receipt failed: ${customerResult.reason}`,
    );
  } else {
    reasons.push("No customer email on invoice — skipped receipt.");
  }

  const delivered = ownerDelivered || customerDelivered;
  if (!owners.length && !customerEmail) {
    return {
      delivered: false,
      reason: "No recipients for payment notify (owners or invoice email).",
      ownerDelivered: false,
      customerDelivered: false,
    };
  }

  return {
    delivered,
    reason: reasons.join(" "),
    ownerDelivered,
    customerDelivered,
  };
}
