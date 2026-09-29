/**
 * Auto visit reminders (tomorrow's scheduled / won quotes).
 *
 * Default: ON when mail is configured.
 * Explicit: KABA_AUTO_VISIT_REMINDERS=true|false (also 1/0/on/off/yes/no).
 * Idempotent via quotes.visit_reminder_sent_at.
 */

import { isMailReady } from "@/lib/mail/config";

export type AutoVisitRemindersEnv = "unset" | "on" | "off";

export function getAutoVisitRemindersEnv(): AutoVisitRemindersEnv {
  const raw = process.env.KABA_AUTO_VISIT_REMINDERS?.trim().toLowerCase();
  if (!raw) return "unset";
  if (["false", "0", "off", "no"].includes(raw)) return "off";
  if (["true", "1", "on", "yes"].includes(raw)) return "on";
  return "unset";
}

/**
 * Whether the visit-reminders cron should send.
 * - env off → never
 * - env on → yes (still no-ops inside notify if mail keys missing)
 * - unset → yes only when mail is ready (default ON when configured)
 */
export function isAutoVisitRemindersEnabled(): boolean {
  const env = getAutoVisitRemindersEnv();
  if (env === "off") return false;
  if (env === "on") return true;
  return isMailReady();
}

export type AutoVisitRemindersPosture = {
  enabled: boolean;
  env: AutoVisitRemindersEnv;
  mailReady: boolean;
  badge: "on_default" | "on_env" | "off_env" | "off_mail";
};

export function getAutoVisitRemindersPosture(): AutoVisitRemindersPosture {
  const env = getAutoVisitRemindersEnv();
  const mailReady = isMailReady();
  const enabled = isAutoVisitRemindersEnabled();
  let badge: AutoVisitRemindersPosture["badge"] = "off_mail";
  if (env === "off") badge = "off_env";
  else if (env === "on") badge = "on_env";
  else if (mailReady) badge = "on_default";
  else badge = "off_mail";
  return { enabled, env, mailReady, badge };
}
