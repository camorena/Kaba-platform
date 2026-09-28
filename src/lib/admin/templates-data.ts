/** Follow-up message templates — copy to clipboard, no email API. */

export type MessageTemplate = {
  id: string;
  channel: "sms" | "email" | "note";
  title: string;
  body: string;
};

export const FOLLOWUP_TEMPLATES: MessageTemplate[] = [
  {
    id: "t_sms_ack",
    channel: "sms",
    title: "SMS · Request received",
    body: "Hi {{name}} — this is Kaba Fence. We got your {{service}} request for {{address}}. We'll call or text within one business day to set a visit. Reply STOP to opt out.",
  },
  {
    id: "t_sms_visit",
    channel: "sms",
    title: "SMS · Confirm site visit",
    body: "Hi {{name}}, confirming our Kaba Fence visit {{when}} at {{address}}. Please clear access along the fence line if you can. Call/text (919) 555-0100 if you need to reschedule.",
  },
  {
    id: "t_sms_quote",
    channel: "sms",
    title: "SMS · Quote ready",
    body: "Hi {{name}} — your Kaba Fence estimate for {{service}} is ready. Total ballpark {{amount}}. Happy to walk through options. Reply here or call (919) 555-0100.",
  },
  {
    id: "t_email_ack",
    channel: "email",
    title: "Email · Thank you / next steps",
    body: "Hi {{name}},\n\nThank you for requesting a quote from Kaba Fence for {{service}} at {{address}}.\n\nWe'll review the details and reach out within one business day to schedule a quick site visit. No obligation — we measure carefully so the number is honest.\n\nQuestions in the meantime? Reply to this email or call (919) 555-0100.\n\n— Kaba Fence",
  },
  {
    id: "t_email_proposal",
    channel: "email",
    title: "Email · Proposal cover",
    body: "Hi {{name}},\n\nAttached is your Kaba Fence proposal for {{service}} at {{address}}.\n\nWhat's included:\n• Materials as specified\n• Labor & cleanup\n• Warranty overview\n\nWe're happy to adjust height, style, or gate placement. Reply with questions or a preferred start window.\n\n— Kaba Fence",
  },
  {
    id: "t_email_invoice",
    channel: "email",
    title: "Email · Invoice sent",
    body: "Hi {{name}},\n\nInvoice {{invoice}} for your {{service}} project is ready. Balance due: {{amount}}.\n\nYou can pay by check, ACH, or card (details on the invoice). Thank you for choosing Kaba Fence.\n\n— Kaba Fence Admin",
  },
  {
    id: "t_note_hoa",
    channel: "note",
    title: "Internal · HOA checklist",
    body: "HOA packet: [ ] guidelines PDF  [ ] material sample photos  [ ] height confirmation  [ ] setback sketch  [ ] neighbor notice if required. Site visit notes: ",
  },
  {
    id: "t_note_won",
    channel: "note",
    title: "Internal · Won handoff",
    body: "Won · deposit {{amount}} · materials lead time __ days · crew week of __ · customer access notes: __ · gate hardware: __",
  },
];

export function fillTemplate(
  body: string,
  vars: Record<string, string>,
): string {
  return body.replace(/\{\{(\w+)\}\}/g, (_, key: string) => vars[key] ?? `{{${key}}}`);
}
