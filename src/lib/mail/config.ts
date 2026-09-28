/**
 * Mail env posture — never throws; build/demo safe without keys.
 *
 * Prefer Resend when RESEND_API_KEY is set; otherwise SMTP when SMTP_HOST is set.
 * MAIL_FROM is required for either transport to be "ready".
 *
 *   RESEND_API_KEY     — Resend HTTP API
 *   SMTP_HOST          — e.g. smtp.example.com
 *   SMTP_PORT          — default 587
 *   SMTP_USER / SMTP_PASS
 *   SMTP_SECURE        — "true" for port 465 TLS
 *   MAIL_FROM          — From: address (required for send)
 *   MAIL_TO_OWNERS     — comma-separated owner alert recipients (optional;
 *                        falls back to published contact email / site.ts)
 */

export type MailTransportKind = "none" | "resend" | "smtp";

export type MailStatus = {
  resendConfigured: boolean;
  smtpConfigured: boolean;
  fromConfigured: boolean;
  ownersConfigured: boolean;
  /** Active transport when ready; none when keys missing. */
  transport: MailTransportKind;
  /** Can attempt a send (transport + MAIL_FROM). */
  ready: boolean;
  /** Honest UI badge. */
  badge: "not_configured" | "resend" | "smtp";
};

function present(value: string | undefined): boolean {
  return Boolean(value?.trim());
}

export function getMailFrom(): string | null {
  const v = process.env.MAIL_FROM?.trim();
  return v || null;
}

export function getResendApiKey(): string | null {
  const v = process.env.RESEND_API_KEY?.trim();
  return v || null;
}

export function getSmtpConfig(): {
  host: string;
  port: number;
  user: string | null;
  pass: string | null;
  secure: boolean;
} | null {
  const host = process.env.SMTP_HOST?.trim();
  if (!host) return null;
  const portRaw = process.env.SMTP_PORT?.trim();
  const port = portRaw ? Number.parseInt(portRaw, 10) : 587;
  return {
    host,
    port: Number.isFinite(port) && port > 0 ? port : 587,
    user: process.env.SMTP_USER?.trim() || null,
    pass: process.env.SMTP_PASS?.trim() || null,
    secure: process.env.SMTP_SECURE?.trim()?.toLowerCase() === "true",
  };
}

/** Comma-separated owner recipients; empty → caller should fall back. */
export function getOwnerRecipients(): string[] {
  const raw = process.env.MAIL_TO_OWNERS?.trim();
  if (!raw) return [];
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

export function getMailStatus(): MailStatus {
  const resendConfigured = present(process.env.RESEND_API_KEY);
  const smtpConfigured = present(process.env.SMTP_HOST);
  const fromConfigured = present(process.env.MAIL_FROM);
  const ownersConfigured = present(process.env.MAIL_TO_OWNERS);

  let transport: MailTransportKind = "none";
  if (resendConfigured && fromConfigured) transport = "resend";
  else if (smtpConfigured && fromConfigured) transport = "smtp";

  const ready = transport !== "none";
  let badge: MailStatus["badge"] = "not_configured";
  if (transport === "resend") badge = "resend";
  else if (transport === "smtp") badge = "smtp";

  return {
    resendConfigured,
    smtpConfigured,
    fromConfigured,
    ownersConfigured,
    transport,
    ready,
    badge,
  };
}

export function isMailReady(): boolean {
  return getMailStatus().ready;
}
