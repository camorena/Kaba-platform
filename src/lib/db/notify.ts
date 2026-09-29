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
import {
  buildQuietDigestEmail,
  toQuietDigestItems,
} from "@/lib/mail/templates/quiet-digest";
import { buildInvoicePayLinkEmail } from "@/lib/mail/templates/invoice-pay-link";
import { isAutoEmailPayLinkEnabled } from "@/lib/mail/auto-pay-link";
import { isAutoVisitRemindersEnabled } from "@/lib/mail/auto-visit-reminders";
import { buildVisitReminderEmail } from "@/lib/mail/templates/visit-reminder";
import { markQuoteVisitReminderSent } from "@/lib/admin/quotes-store";
import { visitKindLabel } from "@/lib/db/visits";
import { QUIET_DAYS_THRESHOLD } from "@/lib/db/quiet";
import { markInvoicePayLinkNotified } from "@/lib/admin/invoices-store";

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
 * Email the customer their invoice summary + public pay URL (elegant HTML).
 * Does not change invoice status; caller may mark "sent" / payLinkNotifiedAt.
 * Customer-only — no owner BCC (owner BCC is for owner-facing notices).
 *
 * Auto path: maybeAutoEmailInvoicePayLink when status first becomes "sent"
 * (default ON when mail configured; KABA_AUTO_EMAIL_PAY_LINK=false to disable).
 * Manual admin "Email pay link" always calls this and refreshes the stamp.
 * See preview/REUSE_PORT_v22.md.
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
  const mail = buildInvoicePayLinkEmail({
    invoice,
    brandName,
    payUrl,
    totalCents: total,
    phone: contact.phone || "(919) 292-4777",
    email: contact.email || "kabafencellc@gmail.com",
    phoneHref: contact.phoneHref,
    emailHref: contact.emailHref,
  });

  const result = await sendMail({
    to,
    subject: mail.subject,
    text: mail.text,
    html: mail.html,
    replyTo: contact.email || undefined,
  });

  return {
    delivered: result.delivered,
    reason: result.reason,
    payUrl,
    to,
  };
}

export type AutoPayLinkResult = {
  attempted: boolean;
  delivered: boolean;
  skipped: boolean;
  reason: string;
  payUrl?: string;
  to?: string;
  invoice?: InvoiceRecord;
};

/**
 * After an invoice first becomes "sent": email pay link once (idempotent).
 * Honest no-op when mail off, toggle off, already notified, or missing email/token.
 */
export async function maybeAutoEmailInvoicePayLink(
  invoice: InvoiceRecord,
  opts?: { request?: Request },
): Promise<AutoPayLinkResult> {
  if (!isAutoEmailPayLinkEnabled()) {
    return {
      attempted: false,
      delivered: false,
      skipped: true,
      reason:
        "Auto pay-link email off (set KABA_AUTO_EMAIL_PAY_LINK=true, or configure mail for default ON).",
    };
  }

  if (invoice.payLinkNotifiedAt) {
    return {
      attempted: false,
      delivered: false,
      skipped: true,
      reason: "Pay-link email already sent for this invoice (idempotent skip).",
    };
  }

  const mailStatus = getMailStatus();
  if (!mailStatus.ready) {
    return {
      attempted: false,
      delivered: false,
      skipped: true,
      reason:
        "notifyInvoicePayLink no-op — configure MAIL_FROM + RESEND_API_KEY or SMTP_HOST (Settings → Platform).",
    };
  }

  const result = await notifyInvoicePayLink(invoice, opts);
  if (!result.delivered) {
    return {
      attempted: true,
      delivered: false,
      skipped: false,
      reason: result.reason,
      payUrl: result.payUrl,
      to: result.to,
    };
  }

  let marked: InvoiceRecord | undefined;
  try {
    marked = await markInvoicePayLinkNotified(invoice.id);
  } catch {
    /* non-fatal — email already delivered */
  }

  return {
    attempted: true,
    delivered: true,
    skipped: false,
    reason: result.reason,
    payUrl: result.payUrl,
    to: result.to,
    invoice: marked,
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

/**
 * Daily gone-quiet digest for owners — same recipient pattern as quote owner copy:
 *   To: MAIL_TO_OWNERS (or published site email)
 *   Bcc: camoren222@gmail.com always (QUOTE_OWNER_ALWAYS_COPY), deduped
 *
 * Honest no-op when mail is not configured (caller still returns 200 + reason).
 */
export type NotifyQuietDigestResult = {
  delivered: boolean;
  reason: string;
  quietCount: number;
  emailedCount: number;
  to?: string[];
  bcc?: string[];
};

/** Cap rows in the email body; remainder linked via listUrl. */
export const QUIET_DIGEST_EMAIL_LIMIT = 40;

export async function notifyQuietDigest(
  quotes: QuoteRecord[],
): Promise<NotifyQuietDigestResult> {
  const quietCount = quotes.length;
  const status = getMailStatus();
  if (!status.ready) {
    return {
      delivered: false,
      quietCount,
      emailedCount: 0,
      reason:
        "notifyQuietDigest no-op — configure MAIL_FROM + RESEND_API_KEY or SMTP_HOST (Settings → Platform).",
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
      quietCount,
      emailedCount: 0,
      reason: "No owner recipients (set MAIL_TO_OWNERS or site email).",
    };
  }

  const to = owners.length ? owners : [QUOTE_OWNER_ALWAYS_COPY];
  const ownerBcc = owners.length ? bcc : [];

  const brandName = getPublishedHeroCopy().name;
  const origin = publicAppOrigin();
  const listUrl = `${origin}/admin/quotes#gone-quiet`;
  const sorted = [...quotes].sort(
    (a, b) =>
      new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime(),
  );
  const capped = sorted.slice(0, QUIET_DIGEST_EMAIL_LIMIT);
  const truncatedCount = Math.max(0, sorted.length - capped.length);

  const mail = buildQuietDigestEmail({
    brandName,
    thresholdDays: QUIET_DAYS_THRESHOLD,
    items: toQuietDigestItems(capped, origin),
    listUrl,
    truncatedCount,
  });

  const result = await sendMail({
    to,
    bcc: ownerBcc.length ? ownerBcc : undefined,
    subject: mail.subject,
    text: mail.text,
    html: mail.html,
  });

  return {
    delivered: result.delivered,
    quietCount,
    emailedCount: quietCount,
    to,
    bcc: ownerBcc.length ? ownerBcc : undefined,
    reason: result.delivered
      ? `Quiet digest delivered (${result.transport}; ${quietCount} lead${quietCount === 1 ? "" : "s"}${ownerBcc.length ? `; bcc ${ownerBcc.join(",")}` : ""}).`
      : `Quiet digest failed: ${result.reason}`,
  };
}

/**
 * Day-before visit / install reminder to the customer.
 * Recipients (match quote-alert owner awareness on a customer-facing send):
 *   - To: customer email
 *   - Bcc: MAIL_TO_OWNERS (or published site email) + always camoren222@gmail.com
 *     (QUOTE_OWNER_ALWAYS_COPY), deduped, excluding the customer address
 *
 * Idempotent stamp via markQuoteVisitReminderSent on deliver.
 * Toggle: KABA_AUTO_VISIT_REMINDERS (default ON when mail configured).
 */
export type NotifyVisitReminderResult = {
  delivered: boolean;
  skipped: boolean;
  reason: string;
  to?: string;
  bcc?: string[];
  quoteId?: string;
};

export async function notifyVisitReminder(
  quote: QuoteRecord,
): Promise<NotifyVisitReminderResult> {
  if (!isAutoVisitRemindersEnabled()) {
    return {
      delivered: false,
      skipped: true,
      reason:
        "Visit reminders off (set KABA_AUTO_VISIT_REMINDERS=true, or configure mail for default ON).",
      quoteId: quote.id,
    };
  }

  if (quote.visitReminderSentAt) {
    return {
      delivered: false,
      skipped: true,
      reason: "Visit reminder already sent for this quote (idempotent skip).",
      quoteId: quote.id,
    };
  }

  const visitDay = quote.scheduledFor?.trim() || "";
  if (!visitDay) {
    return {
      delivered: false,
      skipped: true,
      reason: "Quote has no scheduledFor date.",
      quoteId: quote.id,
    };
  }

  const status = getMailStatus();
  if (!status.ready) {
    return {
      delivered: false,
      skipped: true,
      reason:
        "notifyVisitReminder no-op — configure MAIL_FROM + RESEND_API_KEY or SMTP_HOST (Settings → Platform).",
      quoteId: quote.id,
    };
  }

  const to = quote.email?.trim() || "";
  if (!to) {
    return {
      delivered: false,
      skipped: true,
      reason: "Quote has no customer email.",
      quoteId: quote.id,
    };
  }

  const owners = dedupeEmails(resolveOwnerEmails());
  const alwaysCopy = QUOTE_OWNER_ALWAYS_COPY.trim().toLowerCase();
  const customerKey = to.toLowerCase();
  const bccRaw: string[] = [...owners];
  if (alwaysCopy && alwaysCopy !== customerKey) {
    bccRaw.push(QUOTE_OWNER_ALWAYS_COPY);
  }
  const bcc = dedupeEmails(bccRaw).filter(
    (e) => e.trim().toLowerCase() !== customerKey,
  );

  const brandName = getPublishedHeroCopy().name;
  const contact = getPublishedContactInfo();
  const mail = buildVisitReminderEmail({
    quote,
    brandName,
    visitDay,
    phone: contact.phone || "(919) 292-4777",
    email: contact.email || "kabafencellc@gmail.com",
    phoneHref: contact.phoneHref,
    emailHref: contact.emailHref,
  });

  const result = await sendMail({
    to,
    bcc: bcc.length ? bcc : undefined,
    subject: mail.subject,
    text: mail.text,
    html: mail.html,
    replyTo: contact.email || undefined,
  });

  if (!result.delivered) {
    return {
      delivered: false,
      skipped: false,
      reason: result.reason,
      to,
      bcc: bcc.length ? bcc : undefined,
      quoteId: quote.id,
    };
  }

  try {
    await markQuoteVisitReminderSent(quote.id);
  } catch {
    /* non-fatal — email already delivered */
  }

  const kind = visitKindLabel(quote.status);
  return {
    delivered: true,
    skipped: false,
    reason: `Visit reminder delivered (${result.transport}; ${kind}${bcc.length ? `; bcc ${bcc.join(",")}` : ""}).`,
    to,
    bcc: bcc.length ? bcc : undefined,
    quoteId: quote.id,
  };
}
