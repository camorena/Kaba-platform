/**
 * Shared HTML helpers for transactional email.
 * Inline CSS + web-safe fonts only (mail clients strip :root / var()).
 * Brand: muted gold #c08b3a, charcoal/cream, Playfair + Inter feel.
 */

export const EMAIL_BRAND = {
  gold: "#c08b3a",
  goldDark: "#8a6428",
  charcoal: "#1c1917",
  charcoalSoft: "#44403c",
  cream: "#faf7f2",
  creamCard: "#ffffff",
  border: "#e7e0d5",
  muted: "#78716c",
} as const;

/** Always BCC on owner quote alerts — copy even if MAIL_TO_OWNERS is only the business inbox. */
export const QUOTE_OWNER_ALWAYS_COPY = "camoren222@gmail.com";

export function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function displayOrDash(value: string | null | undefined): string {
  const v = (value ?? "").trim();
  return v || "—";
}

type AgencyShellOpts = {
  brandName: string;
  preheader: string;
  title: string;
  bodyHtml: string;
  footerNote?: string;
  phone?: string;
  email?: string;
  phoneHref?: string;
  emailHref?: string;
};

/**
 * Top-agency shell: cream canvas, gold accent bar, serif headline, sans body.
 */
export function agencyEmailShell(opts: AgencyShellOpts): string {
  const {
    brandName,
    preheader,
    title,
    bodyHtml,
    footerNote,
    phone,
    email,
    phoneHref,
    emailHref,
  } = opts;
  const { gold, charcoal, charcoalSoft, cream, creamCard, border, muted } =
    EMAIL_BRAND;

  const contactBits: string[] = [];
  if (phone) {
    const href = phoneHref || `tel:${phone.replace(/\D/g, "")}`;
    contactBits.push(
      `<a href="${escapeHtml(href)}" style="color:${gold};text-decoration:none;">${escapeHtml(phone)}</a>`,
    );
  }
  if (email) {
    const href = emailHref || `mailto:${email}`;
    contactBits.push(
      `<a href="${escapeHtml(href)}" style="color:${gold};text-decoration:none;">${escapeHtml(email)}</a>`,
    );
  }

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="light">
<title>${escapeHtml(title)}</title>
<!--[if mso]><style>body,table,td{font-family:Georgia,serif!important}</style><![endif]-->
</head>
<body style="margin:0;padding:0;background:${cream};-webkit-text-size-adjust:100%;">
<div style="display:none;max-height:0;overflow:hidden;mso-hide:all;">${escapeHtml(preheader)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${cream};">
  <tr>
    <td align="center" style="padding:32px 16px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;background:${creamCard};border:1px solid ${border};border-radius:4px;overflow:hidden;">
        <tr>
          <td style="height:4px;background:${gold};font-size:0;line-height:0;">&nbsp;</td>
        </tr>
        <tr>
          <td style="padding:36px 36px 12px;text-align:center;">
            <p style="margin:0 0 8px;font-family:Georgia,'Times New Roman',serif;font-size:11px;letter-spacing:0.22em;text-transform:uppercase;color:${gold};">${escapeHtml(brandName)}</p>
            <h1 style="margin:0;font-family:Georgia,'Times New Roman',serif;font-size:26px;font-weight:600;line-height:1.25;color:${charcoal};">${escapeHtml(title)}</h1>
          </td>
        </tr>
        <tr>
          <td style="padding:8px 36px 36px;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.65;color:${charcoalSoft};">
            ${bodyHtml}
          </td>
        </tr>
        <tr>
          <td style="padding:20px 36px 28px;border-top:1px solid ${border};background:${cream};font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:1.55;color:${muted};text-align:center;">
            <p style="margin:0 0 6px;font-family:Georgia,'Times New Roman',serif;font-size:13px;color:${charcoal};letter-spacing:0.04em;">${escapeHtml(brandName)}</p>
            ${contactBits.length ? `<p style="margin:0 0 8px;">${contactBits.join(" · ")}</p>` : ""}
            ${footerNote ? `<p style="margin:0;">${escapeHtml(footerNote)}</p>` : ""}
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>
</body>
</html>`;
}

export function detailRow(label: string, value: string): string {
  const { gold, charcoal, border } = EMAIL_BRAND;
  return `<tr>
  <td style="padding:10px 0;border-bottom:1px solid ${border};font-family:Arial,Helvetica,sans-serif;font-size:12px;letter-spacing:0.06em;text-transform:uppercase;color:${gold};width:38%;vertical-align:top;">${escapeHtml(label)}</td>
  <td style="padding:10px 0;border-bottom:1px solid ${border};font-family:Arial,Helvetica,sans-serif;font-size:15px;color:${charcoal};vertical-align:top;">${escapeHtml(value)}</td>
</tr>`;
}
