/**
 * Elegant customer pay-link email — invoice summary + CTA to /pay/{token}.
 */

import type { InvoiceRecord } from "@/lib/db/types";
import { formatMoney } from "@/lib/admin/format";
import {
  agencyEmailShell,
  displayOrDash,
  escapeHtml,
  EMAIL_BRAND,
} from "@/lib/mail/templates/html";

export type InvoicePayLinkEmailInput = {
  invoice: InvoiceRecord;
  brandName: string;
  payUrl: string;
  totalCents: number;
  phone: string;
  email: string;
  phoneHref?: string;
  emailHref?: string;
};

export function buildInvoicePayLinkEmail(input: InvoicePayLinkEmailInput): {
  subject: string;
  text: string;
  html: string;
} {
  const {
    invoice,
    brandName,
    payUrl,
    totalCents,
    phone,
    email,
    phoneHref,
    emailHref,
  } = input;
  const firstName = invoice.customerName.trim().split(/\s+/)[0] || "there";
  const totalLabel = formatMoney(totalCents);
  const subject = `[${brandName}] Invoice ${invoice.number} · Pay online`;

  const lineText = invoice.lines
    .map((l) => {
      const amt = formatMoney(l.quantity * l.unitCents);
      return `  • ${l.description} × ${l.quantity} @ ${formatMoney(l.unitCents)} = ${amt}`;
    })
    .join("\n");

  const text = [
    `Hello ${firstName},`,
    "",
    `Here is your invoice from ${brandName}.`,
    "",
    `Invoice: ${invoice.number}`,
    `Total: ${totalLabel}`,
    invoice.address ? `Job address: ${invoice.address}` : null,
    "",
    "Line items:",
    lineText || "  (none)",
    invoice.notes ? `\nNotes:\n${invoice.notes}` : null,
    "",
    "Pay online (secure link — no login required):",
    payUrl,
    "",
    phone ? `Phone: ${phone}` : null,
    email ? `Email: ${email}` : null,
    "",
    `Thank you,`,
    brandName,
  ]
    .filter((line): line is string => line !== null)
    .join("\n");

  const { gold, charcoal, charcoalSoft, cream, border, muted } = EMAIL_BRAND;

  const lineRowsHtml = invoice.lines.length
    ? invoice.lines
        .map((l) => {
          const amt = formatMoney(l.quantity * l.unitCents);
          return `<tr>
  <td style="padding:8px 12px;border-bottom:1px solid ${border};font-family:Arial,Helvetica,sans-serif;font-size:13px;color:${charcoalSoft};">${escapeHtml(l.description)}</td>
  <td style="padding:8px 12px;border-bottom:1px solid ${border};font-family:Arial,Helvetica,sans-serif;font-size:13px;color:${muted};text-align:right;white-space:nowrap;">${escapeHtml(amt)}</td>
</tr>`;
        })
        .join("")
    : `<tr><td colspan="2" style="padding:8px 12px;font-size:13px;color:${muted};">(none)</td></tr>`;

  const bodyHtml = `
<p style="margin:0 0 16px;">Hello ${escapeHtml(firstName)},</p>
<p style="margin:0 0 16px;">Here is your invoice from <strong style="color:${charcoal};">${escapeHtml(brandName)}</strong>. You can pay a deposit online with the secure link below — no login required.</p>

<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 20px;border:1px solid ${border};">
  <tr>
    <td style="padding:14px 16px;font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:1.7;color:${charcoalSoft};">
      <strong style="color:${charcoal};">Invoice ${escapeHtml(invoice.number)}</strong><br>
      Total: <strong style="color:${charcoal};">${escapeHtml(totalLabel)}</strong><br>
      Job address: ${escapeHtml(displayOrDash(invoice.address))}
    </td>
  </tr>
</table>

<p style="margin:0 0 8px;font-family:Georgia,'Times New Roman',serif;font-size:16px;color:${charcoal};">Line items</p>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 24px;border:1px solid ${border};">
  ${lineRowsHtml}
</table>

${
  invoice.notes?.trim()
    ? `<p style="margin:0 0 8px;font-family:Georgia,'Times New Roman',serif;font-size:16px;color:${charcoal};">Notes</p>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 24px;">
  <tr>
    <td style="padding:12px 14px;background:${cream};border-left:3px solid ${gold};font-family:Arial,Helvetica,sans-serif;font-size:13px;line-height:1.6;color:${charcoalSoft};">${escapeHtml(invoice.notes.trim())}</td>
  </tr>
</table>`
    : ""
}

<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:8px 0 20px;">
  <tr>
    <td style="border-radius:6px;background:${gold};">
      <a href="${escapeHtml(payUrl)}" style="display:inline-block;padding:14px 28px;font-family:Arial,Helvetica,sans-serif;font-size:15px;font-weight:700;color:#ffffff;text-decoration:none;">Pay online</a>
    </td>
  </tr>
</table>
<p style="margin:0 0 16px;font-size:12px;color:${muted};word-break:break-all;">Or open: <a href="${escapeHtml(payUrl)}" style="color:${gold};">${escapeHtml(payUrl)}</a></p>

<p style="margin:0 0 8px;">Questions? We’re glad to help.</p>
<p style="margin:0;font-size:14px;color:${muted};">
  ${phone ? `<a href="${escapeHtml(phoneHref || `tel:${phone.replace(/\D/g, "")}`)}" style="color:${gold};text-decoration:none;">${escapeHtml(phone)}</a>` : ""}
  ${phone && email ? " · " : ""}
  ${email ? `<a href="${escapeHtml(emailHref || `mailto:${email}`)}" style="color:${gold};text-decoration:none;">${escapeHtml(email)}</a>` : ""}
</p>
`.trim();

  const html = agencyEmailShell({
    brandName,
    preheader: `Invoice ${invoice.number} · ${totalLabel} — pay online securely.`,
    title: `Invoice ${invoice.number}`,
    bodyHtml,
    phone,
    email,
    phoneHref,
    emailHref,
    footerNote: "Secure pay link · No admin login required",
  });

  return { subject, text, html };
}
