/**
 * Owner / admin alert when a public quote form is submitted.
 */

import type { QuoteRecord } from "@/lib/db/types";
import {
  agencyEmailShell,
  detailRow,
  displayOrDash,
  escapeHtml,
  EMAIL_BRAND,
} from "@/lib/mail/templates/html";

export type QuoteOwnerEmailInput = {
  quote: QuoteRecord;
  brandName: string;
  adminUrl: string;
};

export function buildQuoteOwnerEmail(input: QuoteOwnerEmailInput): {
  subject: string;
  text: string;
  html: string;
} {
  const { quote, brandName, adminUrl } = input;
  const subject = `[${brandName}] New quote · ${quote.name}${quote.phone ? ` · ${quote.phone}` : ""}`;

  const text = [
    `New quote request saved (${quote.id}).`,
    "",
    `Name: ${quote.name}`,
    `Email: ${displayOrDash(quote.email)}`,
    `Phone: ${displayOrDash(quote.phone)}`,
    `Preferred contact: ${displayOrDash(quote.preferredContact)}`,
    `Project / service: ${displayOrDash(quote.serviceType)}`,
    `Address: ${displayOrDash(quote.address)}`,
    `Source: ${displayOrDash(quote.source)}`,
    "",
    "Notes / description:",
    quote.description?.trim() || "(none)",
    "",
    `Admin: ${adminUrl}`,
  ].join("\n");

  const notesBlock = quote.description?.trim()
    ? `<p style="margin:20px 0 6px;font-family:Arial,Helvetica,sans-serif;font-size:12px;letter-spacing:0.06em;text-transform:uppercase;color:${EMAIL_BRAND.gold};">Notes</p>
<p style="margin:0;white-space:pre-wrap;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.6;color:${EMAIL_BRAND.charcoal};">${escapeHtml(quote.description.trim())}</p>`
    : "";

  const bodyHtml = `
<p style="margin:0 0 20px;">A new estimate request just arrived from the website.</p>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
  ${detailRow("Name", quote.name)}
  ${detailRow("Phone", displayOrDash(quote.phone))}
  ${detailRow("Email", displayOrDash(quote.email))}
  ${detailRow("Prefer contact", displayOrDash(quote.preferredContact))}
  ${detailRow("Project", displayOrDash(quote.serviceType))}
  ${detailRow("Address", displayOrDash(quote.address))}
  ${detailRow("Source", displayOrDash(quote.source))}
</table>
${notesBlock}
<p style="margin:28px 0 0;">
  <a href="${escapeHtml(adminUrl)}" style="display:inline-block;padding:12px 22px;background:${EMAIL_BRAND.gold};color:#ffffff;font-family:Arial,Helvetica,sans-serif;font-size:13px;letter-spacing:0.04em;text-decoration:none;border-radius:2px;">Open in admin</a>
</p>
<p style="margin:14px 0 0;font-size:12px;color:${EMAIL_BRAND.muted};">Lead ID: ${escapeHtml(quote.id)}</p>
`.trim();

  const html = agencyEmailShell({
    brandName,
    preheader: `New quote from ${quote.name} — ${quote.serviceType || "project"}`,
    title: "New quote request",
    bodyHtml,
    footerNote: "Persist-then-notify — this lead is already saved in admin.",
  });

  return { subject, text, html };
}
