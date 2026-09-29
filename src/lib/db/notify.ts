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
  dedupeEmails,
} from "@/lib/mail";
import { getPublishedContactInfo, getPublishedHeroCopy } from "@/lib/cms/public";
import { buildPaymentReceiptStub } from "@/lib/pay/receipt";
import { invoicePayUrl, publicAppOrigin } from "@/lib/pay/origin";
import { QUOTE_OWNER_ALWAYS_COPY } from "@/lib/mail/templates/html";
import { buildQuoteOwnerEmail } from "@/lib/mail/templates/quote-owner";
import { buildQuoteCustomerEmail } from "@/lib/mail/templates/quote-customer";

export type NotifyQuoteResult = {
  /** True when the owner/admin alert was delivered (drives notifiedAt). */
  delivered: boolean;
  reason: string;
  ownerDelivered?: boolean;
  customerDelivered?: boolean;
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
 * Owner notification + customer confirmation after a quote is saved.
 * Persist-then-notify — must not throw away the saved row (callers catch).
 *
 * Recipients:
 *   - To: MAIL_TO_OWNERS (or published site email fallback)
 *   - Bcc: camoren222@gmail.com always (QUOTE_OWNER_ALWAYS_COPY), even when
 *     MAIL_TO_OWNERS is only the business inbox — skipped if already in To
 *   - Customer: separate elegant confirmation when quote.email is present
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
      ownerDelivered: false,
      customerDelivered: false,
    };
  }

  const owners = dedupeEmails(resolveOwnerEmails());
  const alwaysCopy = QUOTE_OWNER_ALWAYS_COPY.trim().toLowerCase();
  const ownerSet = new Set(owners.map((e) => e.toLowerCase()));
  const bcc =
    alwaysCopy && !ownerSet.has(alwaysCopy) ? [QUOTE_OWNER_ALWAYS_COPY] : [];

  if (!owners.length && !bcc.length) {
    return {
      delivered: false,
      reason: "No owner recipients (set MAIL_TO_OWNERS or site email).",
      ownerDelivered: false,
      customerDelivered: false,
    };
  }

  // If MAIL_TO_OWNERS empty but we still have the always-copy address, send To that address.
  const to = owners.length ? owners : [QUOTE_OWNER_ALWAYS_COPY];
  const ownerBcc = owners.length ? bcc : [];

  const brandName = getPublishedHeroCopy().name;
  const contact = getPublishedContactInfo();
  const adminUrl = `${publicAppOrigin()}/admin/quotes/${quote.id}`;
  const ownerMail = buildQuoteOwnerEmail({ quote, brandName, adminUrl });

  let ownerDelivered = false;
  let customerDelivered = false;
  const reasons: string[] = [];

  const ownerResult = await sendMail({
    to,
    bcc: ownerBcc.length ? ownerBcc : undefined,
    subject: ownerMail.subject,
    text: ownerMail.text,
    html: ownerMail.html,
    replyTo: quote.email || undefined,
  });
  ownerDelivered = ownerResult.delivered;
  reasons.push(
    ownerResult.delivered
      ? `Owner notice delivered (${ownerResult.transport}${ownerBcc.length ? `; bcc ${ownerBcc.join(",")}` : ""}).`
      : `Owner notice failed: ${ownerResult.reason}`,
  );

  const customerEmail = quote.email?.trim() || "";
  if (customerEmail) {
    const customerMail = buildQuoteCustomerEmail({
      quote,
      brandName,
      phone: contact.phone || "(919) 292-4777",
      email: contact.email || "kabafencellc@gmail.com",
      phoneHref: contact.phoneHref,
      emailHref: contact.emailHref,
    });
    const customerResult = await sendMail({
      to: customerEmail,
      subject: customerMail.subject,
      text: customerMail.text,
      html: customerMail.html,
      replyTo: contact.email || undefined,
    });
    customerDelivered = customerResult.delivered;
    reasons.push(
      customerResult.delivered
        ? `Customer confirmation delivered (${customerResult.transport}).`
        : `Customer confirmation failed: ${customerResult.reason}`,
    );
  } else {
    reasons.push("No customer email on quote — skipped confirmation.");
  }

  return {
    delivered: ownerDelivered,
    reason: reasons.join(" "),
    ownerDelivered,
    customerDelivered,
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
