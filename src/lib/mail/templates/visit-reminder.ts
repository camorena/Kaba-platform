/**
 * Elegant customer visit / install reminder — day-before notice.
 */

import type { QuoteRecord } from "@/lib/db/types";
import {
  formatVisitDayLabel,
  visitKindLabel,
  visitTimeLabel,
} from "@/lib/db/visits";
import {
  agencyEmailShell,
  displayOrDash,
  escapeHtml,
  EMAIL_BRAND,
} from "@/lib/mail/templates/html";

export type VisitReminderEmailInput = {
  quote: QuoteRecord;
  brandName: string;
  /** YYYY-MM-DD */
  visitDay: string;
  phone: string;
  email: string;
  phoneHref?: string;
  emailHref?: string;
};

export function buildVisitReminderEmail(input: VisitReminderEmailInput): {
  subject: string;
  text: string;
  html: string;
} {
  const {
    quote,
    brandName,
    visitDay,
    phone,
    email,
    phoneHref,
    emailHref,
  } = input;
  const firstName = quote.name.trim().split(/\s+/)[0] || "there";
  const kind = visitKindLabel(quote.status);
  const timeLabel = visitTimeLabel(quote.status);
  const dayLabel = formatVisitDayLabel(visitDay);
  const subject = `[${brandName}] Reminder: ${kind} tomorrow · ${dayLabel}`;

  const text = [
    `Hello ${firstName},`,
    "",
    `This is a friendly reminder from ${brandName} about your upcoming ${kind.toLowerCase()}.`,
    "",
    `When: ${dayLabel}`,
    `Time: around ${timeLabel} (we'll confirm if anything changes)`,
    `Project: ${displayOrDash(quote.serviceType)}`,
    `Address: ${displayOrDash(quote.address)}`,
    "",
    "What to expect",
    quote.status === "won"
      ? "• Our crew arrives for the scheduled install window."
      : "• We'll walk the property, confirm measurements, and discuss options.",
    "• Have gate codes / pets / HOA notes ready if they apply.",
    "• Need to reschedule? Reply to this email or call us — we're glad to help.",
    "",
    phone ? `Phone: ${phone}` : null,
    email ? `Email: ${email}` : null,
    "",
    "Thank you,",
    brandName,
  ]
    .filter((line): line is string => line !== null)
    .join("\n");

  const { gold, charcoal, charcoalSoft, cream, border, muted } = EMAIL_BRAND;

  const expectHtml =
    quote.status === "won"
      ? `<strong style="color:${charcoal};">Install window</strong> — Our crew arrives for the scheduled work. Have access and pets notes ready.`
      : `<strong style="color:${charcoal};">Site visit</strong> — We'll walk the property, confirm measurements, and discuss options. Have gate codes / HOA notes ready if they apply.`;

  const bodyHtml = `
<p style="margin:0 0 16px;">Hello ${escapeHtml(firstName)},</p>
<p style="margin:0 0 16px;">This is a friendly reminder from <strong style="color:${charcoal};">${escapeHtml(brandName)}</strong> about your upcoming <strong style="color:${charcoal};">${escapeHtml(kind.toLowerCase())}</strong>.</p>

<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 20px;border:1px solid ${border};">
  <tr>
    <td style="padding:14px 16px;font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:1.7;color:${charcoalSoft};">
      <strong style="color:${charcoal};">${escapeHtml(dayLabel)}</strong><br>
      Around ${escapeHtml(timeLabel)} (we'll confirm if anything changes)<br>
      Project: ${escapeHtml(displayOrDash(quote.serviceType))}<br>
      Address: ${escapeHtml(displayOrDash(quote.address))}
    </td>
  </tr>
</table>

<p style="margin:0 0 8px;font-family:Georgia,'Times New Roman',serif;font-size:16px;color:${charcoal};">What to expect</p>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 24px;">
  <tr>
    <td style="padding:12px 14px;background:${cream};border-left:3px solid ${gold};font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:1.6;color:${charcoalSoft};">
      ${expectHtml}<br><br>
      Need to reschedule? Reply to this email or call us — we're glad to help.
    </td>
  </tr>
</table>

<p style="margin:0 0 8px;">Questions? Reach us anytime.</p>
<p style="margin:0;font-size:14px;color:${muted};">
  ${phone ? `<a href="${escapeHtml(phoneHref || `tel:${phone.replace(/\D/g, "")}`)}" style="color:${gold};text-decoration:none;">${escapeHtml(phone)}</a>` : ""}
  ${phone && email ? " · " : ""}
  ${email ? `<a href="${escapeHtml(emailHref || `mailto:${email}`)}" style="color:${gold};text-decoration:none;">${escapeHtml(email)}</a>` : ""}
</p>
`.trim();

  const html = agencyEmailShell({
    brandName,
    preheader: `${kind} tomorrow · ${dayLabel} · ${displayOrDash(quote.address)}`,
    title: `${kind} tomorrow`,
    bodyHtml,
    phone,
    email,
    phoneHref,
    emailHref,
    footerNote: "Raleigh, NC & surrounding areas · Licensed & insured local crew",
  });

  return { subject, text, html };
}
