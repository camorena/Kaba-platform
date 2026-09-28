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
  type SendMailInput,
  type SendMailResult,
} from "@/lib/mail/send";
