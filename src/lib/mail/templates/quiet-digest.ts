/**
 * Morning gone-quiet digest for owners — EN copy.
 * Formal Colombian Spanish mail templates are not shipped yet (admin UI i18n only);
 * keep this EN until a dedicated ES mail pack lands.
 */

import type { QuoteRecord, QuoteStatus } from "@/lib/db/types";
import { daysSince } from "@/lib/admin/format";
import {
  agencyEmailShell,
  escapeHtml,
  EMAIL_BRAND,
} from "@/lib/mail/templates/html";

const STATUS_LABEL: Record<QuoteStatus, string> = {
  new: "New",
  contacted: "Contacted",
  scheduled: "Scheduled",
  won: "Won",
  lost: "Lost",
};

export type QuietDigestItem = {
  quote: QuoteRecord;
  quietDays: number;
  adminUrl: string;
};

export type QuietDigestEmailInput = {
  brandName: string;
  thresholdDays: number;
  items: QuietDigestItem[];
  /** Link to the full gone-quiet list in admin. */
  listUrl: string;
  /** When items were truncated for the email body. */
  truncatedCount?: number;
};

export function buildQuietDigestEmail(input: QuietDigestEmailInput): {
  subject: string;
  text: string;
  html: string;
} {
  const { brandName, thresholdDays, items, listUrl, truncatedCount = 0 } =
    input;
  const count = items.length + truncatedCount;
  const subject =
    count === 1
      ? `[${brandName}] Morning digest · 1 quiet lead`
      : `[${brandName}] Morning digest · ${count} quiet leads`;

  const textLines = [
    `${brandName} — gone-quiet morning digest`,
    "",
    count === 0
      ? `No quiet leads (threshold: ${thresholdDays}+ days on new / contacted / scheduled).`
      : `${count} lead${count === 1 ? "" : "s"} with no movement for ${thresholdDays}+ days:`,
    "",
  ];

  for (const item of items) {
    const { quote, quietDays, adminUrl } = item;
    textLines.push(
      `• ${quote.name} · ${STATUS_LABEL[quote.status] ?? quote.status} · quiet ${quietDays}d`,
      `  ${adminUrl}`,
    );
  }
  if (truncatedCount > 0) {
    textLines.push(
      "",
      `…and ${truncatedCount} more — open the full list:`,
      listUrl,
    );
  } else if (count > 0) {
    textLines.push("", `Full list: ${listUrl}`);
  }
  textLines.push(
    "",
    "America/Chicago morning digest — review and follow up when ready.",
  );

  const text = textLines.join("\n");

  if (count === 0) {
    const html = agencyEmailShell({
      brandName,
      preheader: "No quiet leads this morning",
      title: "Gone quiet — all clear",
      bodyHtml: `<p style="margin:0;">No leads on <strong>new</strong>, <strong>contacted</strong>, or <strong>scheduled</strong> have been silent for ${thresholdDays}+ days. Nice work.</p>`,
      footerNote: "Morning digest · America/Chicago",
    });
    return { subject: `[${brandName}] Morning digest · all clear`, text, html };
  }

  const rows = items
    .map((item) => {
      const { quote, quietDays, adminUrl } = item;
      const status = STATUS_LABEL[quote.status] ?? quote.status;
      return `<tr>
  <td style="padding:14px 0;border-bottom:1px solid ${EMAIL_BRAND.border};vertical-align:top;">
    <a href="${escapeHtml(adminUrl)}" style="font-family:Georgia,'Times New Roman',serif;font-size:17px;color:${EMAIL_BRAND.charcoal};text-decoration:none;font-weight:600;">${escapeHtml(quote.name)}</a>
    <p style="margin:4px 0 0;font-family:Arial,Helvetica,sans-serif;font-size:13px;color:${EMAIL_BRAND.muted};">
      ${escapeHtml(status)} · quiet ${quietDays} day${quietDays === 1 ? "" : "s"}
      ${quote.phone ? ` · ${escapeHtml(quote.phone)}` : ""}
    </p>
  </td>
  <td style="padding:14px 0;border-bottom:1px solid ${EMAIL_BRAND.border};vertical-align:middle;text-align:right;white-space:nowrap;">
    <a href="${escapeHtml(adminUrl)}" style="font-family:Arial,Helvetica,sans-serif;font-size:12px;letter-spacing:0.04em;color:${EMAIL_BRAND.gold};text-decoration:none;">Open →</a>
  </td>
</tr>`;
    })
    .join("\n");

  const moreNote =
    truncatedCount > 0
      ? `<p style="margin:16px 0 0;font-size:13px;color:${EMAIL_BRAND.muted};">…and ${truncatedCount} more in admin.</p>`
      : "";

  const bodyHtml = `
<p style="margin:0 0 8px;font-family:Arial,Helvetica,sans-serif;font-size:13px;letter-spacing:0.08em;text-transform:uppercase;color:${EMAIL_BRAND.gold};">${count} quiet · ${thresholdDays}+ days silent</p>
<p style="margin:0 0 20px;">These leads are still open (new / contacted / scheduled) with no status change for ${thresholdDays} or more days. A quick follow-up keeps the pipeline warm.</p>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
${rows}
</table>
${moreNote}
<p style="margin:28px 0 0;">
  <a href="${escapeHtml(listUrl)}" style="display:inline-block;padding:12px 22px;background:${EMAIL_BRAND.gold};color:#ffffff;font-family:Arial,Helvetica,sans-serif;font-size:13px;letter-spacing:0.04em;text-decoration:none;border-radius:2px;">View all quiet quotes</a>
</p>
`.trim();

  const html = agencyEmailShell({
    brandName,
    preheader: `${count} quiet lead${count === 1 ? "" : "s"} need a follow-up`,
    title: "Gone-quiet morning digest",
    bodyHtml,
    footerNote: "Morning digest · America/Chicago · already saved in admin",
  });

  return { subject, text, html };
}

/** Build digest items from quiet quote rows (shared with cron route). */
export function toQuietDigestItems(
  quotes: QuoteRecord[],
  origin: string,
  now = Date.now(),
): QuietDigestItem[] {
  return quotes.map((quote) => ({
    quote,
    quietDays: daysSince(quote.updatedAt, now),
    adminUrl: `${origin}/admin/quotes/${quote.id}`,
  }));
}
