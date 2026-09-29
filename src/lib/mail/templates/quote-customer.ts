/**
 * Elegant customer confirmation after quote form submit.
 * No fake promises — thank you, what happens next, real contact info.
 */

import type { QuoteRecord } from "@/lib/db/types";
import {
  agencyEmailShell,
  displayOrDash,
  escapeHtml,
  EMAIL_BRAND,
} from "@/lib/mail/templates/html";

export type QuoteCustomerEmailInput = {
  quote: QuoteRecord;
  brandName: string;
  phone: string;
  email: string;
  phoneHref?: string;
  emailHref?: string;
};

export function buildQuoteCustomerEmail(input: QuoteCustomerEmailInput): {
  subject: string;
  text: string;
  html: string;
} {
  const { quote, brandName, phone, email, phoneHref, emailHref } = input;
  const firstName = quote.name.trim().split(/\s+/)[0] || "there";
  const subject = `We received your request — ${brandName}`;

  const text = [
    `Hello ${firstName},`,
    "",
    `Thank you for reaching out to ${brandName}.`,
    "We have your estimate request and our team will review the details shortly.",
    "",
    "What happens next",
    "• We review your project notes and service area.",
    "• Someone from our team will contact you using your preferred method to discuss next steps or schedule an on-site visit when appropriate.",
    "• You’ll receive a clear written estimate before any work begins — no obligation.",
    "",
    "Your request summary",
    `Name: ${quote.name}`,
    `Project: ${displayOrDash(quote.serviceType)}`,
    `Address / area: ${displayOrDash(quote.address)}`,
    `Preferred contact: ${displayOrDash(quote.preferredContact)}`,
    "",
    "Questions in the meantime?",
    phone ? `Phone: ${phone}` : null,
    email ? `Email: ${email}` : null,
    "",
    "Thank you,",
    brandName,
  ]
    .filter((line): line is string => line !== null)
    .join("\n");

  const { gold, charcoal, charcoalSoft, cream, border, muted } = EMAIL_BRAND;

  const bodyHtml = `
<p style="margin:0 0 16px;">Hello ${escapeHtml(firstName)},</p>
<p style="margin:0 0 16px;">Thank you for reaching out to <strong style="color:${charcoal};">${escapeHtml(brandName)}</strong>. We have your estimate request and our team will review the details shortly.</p>

<p style="margin:28px 0 10px;font-family:Georgia,'Times New Roman',serif;font-size:16px;color:${charcoal};">What happens next</p>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 24px;">
  <tr>
    <td style="padding:12px 14px;background:${cream};border-left:3px solid ${gold};font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:1.6;color:${charcoalSoft};">
      <strong style="color:${charcoal};">1. Review</strong> — We read your project notes and confirm we serve your area.<br><br>
      <strong style="color:${charcoal};">2. Contact</strong> — We’ll reach out via your preferred method to discuss next steps or schedule an on-site visit when it makes sense.<br><br>
      <strong style="color:${charcoal};">3. Clear estimate</strong> — You’ll get a written scope and price before any work begins. No obligation.
    </td>
  </tr>
</table>

<p style="margin:0 0 10px;font-family:Georgia,'Times New Roman',serif;font-size:16px;color:${charcoal};">Your request</p>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 24px;border:1px solid ${border};">
  <tr>
    <td style="padding:14px 16px;font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:1.7;color:${charcoalSoft};">
      <strong style="color:${charcoal};">${escapeHtml(quote.name)}</strong><br>
      Project: ${escapeHtml(displayOrDash(quote.serviceType))}<br>
      Address / area: ${escapeHtml(displayOrDash(quote.address))}<br>
      Preferred contact: ${escapeHtml(displayOrDash(quote.preferredContact))}
    </td>
  </tr>
</table>

<p style="margin:0 0 8px;">Questions in the meantime? We’re glad to help.</p>
<p style="margin:0;font-size:14px;color:${muted};">
  ${phone ? `<a href="${escapeHtml(phoneHref || `tel:${phone.replace(/\D/g, "")}`)}" style="color:${gold};text-decoration:none;">${escapeHtml(phone)}</a>` : ""}
  ${phone && email ? " · " : ""}
  ${email ? `<a href="${escapeHtml(emailHref || `mailto:${email}`)}" style="color:${gold};text-decoration:none;">${escapeHtml(email)}</a>` : ""}
</p>
`.trim();

  const html = agencyEmailShell({
    brandName,
    preheader: `Thank you — we received your estimate request and will be in touch.`,
    title: "Thank you for your request",
    bodyHtml,
    phone,
    email,
    phoneHref,
    emailHref,
    footerNote: "Raleigh, NC & surrounding areas · Licensed & insured local crew",
  });

  return { subject, text, html };
}
