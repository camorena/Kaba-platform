/**
 * Optional mail send — Resend (fetch) or SMTP (nodemailer).
 * No-op / soft-fail when transport is not configured. Never throws to callers
 * that need persist-then-notify safety (notify wrappers catch anyway).
 */

import "server-only";

import {
  getMailFrom,
  getMailStatus,
  getOwnerRecipients,
  getResendApiKey,
  getSmtpConfig,
  type MailTransportKind,
} from "@/lib/mail/config";
import { getPublishedContactInfo } from "@/lib/cms/public";

export type SendMailInput = {
  to: string | string[];
  subject: string;
  text: string;
  html?: string;
  replyTo?: string;
  /** Carbon copy (visible). */
  cc?: string | string[];
  /** Blind carbon copy. */
  bcc?: string | string[];
};

export type SendMailResult = {
  delivered: boolean;
  transport: MailTransportKind;
  reason: string;
  messageId?: string;
};

function normalizeTo(to: string | string[] | undefined): string[] {
  if (!to) return [];
  const list = Array.isArray(to) ? to : [to];
  return list.map((s) => s.trim()).filter(Boolean);
}

/** Case-insensitive dedupe while preserving first-seen casing. */
export function dedupeEmails(emails: string[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const raw of emails) {
    const e = raw.trim();
    if (!e) continue;
    const key = e.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(e);
  }
  return out;
}

async function sendViaResend(input: SendMailInput): Promise<SendMailResult> {
  const apiKey = getResendApiKey();
  const from = getMailFrom();
  if (!apiKey || !from) {
    return {
      delivered: false,
      transport: "none",
      reason: "Resend selected but RESEND_API_KEY or MAIL_FROM missing.",
    };
  }
  const to = normalizeTo(input.to);
  if (!to.length) {
    return {
      delivered: false,
      transport: "resend",
      reason: "No recipients.",
    };
  }

  const cc = normalizeTo(input.cc);
  const bcc = normalizeTo(input.bcc);

  const payload: Record<string, unknown> = {
    from,
    to,
    subject: input.subject,
    text: input.text,
    html: input.html,
    reply_to: input.replyTo,
  };
  if (cc.length) payload.cc = cc;
  if (bcc.length) payload.bcc = bcc;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    return {
      delivered: false,
      transport: "resend",
      reason: `Resend HTTP ${res.status}${body ? `: ${body.slice(0, 200)}` : ""}`,
    };
  }

  const data = (await res.json().catch(() => ({}))) as { id?: string };
  return {
    delivered: true,
    transport: "resend",
    reason: "Delivered via Resend.",
    messageId: data.id,
  };
}

async function sendViaSmtp(input: SendMailInput): Promise<SendMailResult> {
  const smtp = getSmtpConfig();
  const from = getMailFrom();
  if (!smtp || !from) {
    return {
      delivered: false,
      transport: "none",
      reason: "SMTP selected but SMTP_HOST or MAIL_FROM missing.",
    };
  }
  const to = normalizeTo(input.to);
  if (!to.length) {
    return {
      delivered: false,
      transport: "smtp",
      reason: "No recipients.",
    };
  }

  const cc = normalizeTo(input.cc);
  const bcc = normalizeTo(input.bcc);

  const nodemailer = await import("nodemailer");
  const transporter = nodemailer.createTransport({
    host: smtp.host,
    port: smtp.port,
    secure: smtp.secure,
    auth:
      smtp.user && smtp.pass
        ? { user: smtp.user, pass: smtp.pass }
        : undefined,
  });

  const info = await transporter.sendMail({
    from,
    to: to.join(", "),
    cc: cc.length ? cc.join(", ") : undefined,
    bcc: bcc.length ? bcc.join(", ") : undefined,
    subject: input.subject,
    text: input.text,
    html: input.html,
    replyTo: input.replyTo,
  });

  return {
    delivered: true,
    transport: "smtp",
    reason: "Delivered via SMTP.",
    messageId: typeof info.messageId === "string" ? info.messageId : undefined,
  };
}

/**
 * Send with the configured transport. Returns delivered:false when not configured
 * (honest no-op) — does not throw for missing keys.
 */
export async function sendMail(input: SendMailInput): Promise<SendMailResult> {
  const status = getMailStatus();
  if (!status.ready) {
    return {
      delivered: false,
      transport: "none",
      reason:
        "Mail not configured — set MAIL_FROM plus RESEND_API_KEY or SMTP_HOST (see Settings → Platform).",
    };
  }

  try {
    if (status.transport === "resend") return await sendViaResend(input);
    if (status.transport === "smtp") return await sendViaSmtp(input);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return {
      delivered: false,
      transport: status.transport,
      reason: `Mail send failed: ${message}`,
    };
  }

  return {
    delivered: false,
    transport: "none",
    reason: "No mail transport selected.",
  };
}

/** Owner alert recipients: MAIL_TO_OWNERS or site public email. */
export function resolveOwnerEmails(): string[] {
  const fromEnv = getOwnerRecipients();
  if (fromEnv.length) return fromEnv;
  const email = getPublishedContactInfo().email;
  return email ? [email] : [];
}
