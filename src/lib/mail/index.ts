export {
  getMailStatus,
  isMailReady,
  getMailFrom,
  getOwnerRecipients,
  type MailStatus,
  type MailTransportKind,
} from "@/lib/mail/config";
export {
  sendMail,
  resolveOwnerEmails,
  dedupeEmails,
  type SendMailInput,
  type SendMailResult,
} from "@/lib/mail/send";
export { QUOTE_OWNER_ALWAYS_COPY } from "@/lib/mail/templates/html";

export {
  getAutoEmailPayLinkEnv,
  getAutoEmailPayLinkPosture,
  isAutoEmailPayLinkEnabled,
} from "@/lib/mail/auto-pay-link";
export type { AutoPayLinkEnv, AutoPayLinkPosture } from "@/lib/mail/auto-pay-link";

export {
  getAutoVisitRemindersEnv,
  getAutoVisitRemindersPosture,
  isAutoVisitRemindersEnabled,
} from "@/lib/mail/auto-visit-reminders";
export type {
  AutoVisitRemindersEnv,
  AutoVisitRemindersPosture,
} from "@/lib/mail/auto-visit-reminders";
