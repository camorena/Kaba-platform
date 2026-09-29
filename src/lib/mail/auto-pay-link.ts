/**
 * Auto email pay-link when an invoice first becomes "sent".
 *
 * Default: ON when mail is configured.
 * Explicit: KABA_AUTO_EMAIL_PAY_LINK=true|false (also 1/0/on/off/yes/no).
 * Idempotent via invoices.pay_link_notified_at — skip if already emailed.
 * Manual admin "Email pay link" always sends and refreshes the stamp.
 */

import { isMailReady } from "@/lib/mail/config";

export type AutoPayLinkEnv = "unset" | "on" | "off";

export function getAutoEmailPayLinkEnv(): AutoPayLinkEnv {
  const raw = process.env.KABA_AUTO_EMAIL_PAY_LINK?.trim().toLowerCase();
  if (!raw) return "unset";
  if (["false", "0", "off", "no"].includes(raw)) return "off";
  if (["true", "1", "on", "yes"].includes(raw)) return "on";
  return "unset";
}

/**
 * Whether auto-send should run on first transition to "sent".
 * - env off → never
 * - env on → yes (still no-ops inside notify if mail keys missing)
 * - unset → yes only when mail is ready (default ON when configured)
 */
export function isAutoEmailPayLinkEnabled(): boolean {
  const env = getAutoEmailPayLinkEnv();
  if (env === "off") return false;
  if (env === "on") return true;
  return isMailReady();
}

export type AutoPayLinkPosture = {
  enabled: boolean;
  env: AutoPayLinkEnv;
  mailReady: boolean;
  /** Honest Settings badge label key hint. */
  badge: "on_default" | "on_env" | "off_env" | "off_mail";
};

export function getAutoEmailPayLinkPosture(): AutoPayLinkPosture {
  const env = getAutoEmailPayLinkEnv();
  const mailReady = isMailReady();
  const enabled = isAutoEmailPayLinkEnabled();
  let badge: AutoPayLinkPosture["badge"] = "off_mail";
  if (env === "off") badge = "off_env";
  else if (env === "on") badge = "on_env";
  else if (mailReady) badge = "on_default";
  else badge = "off_mail";
  return { enabled, env, mailReady, badge };
}
