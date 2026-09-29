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
