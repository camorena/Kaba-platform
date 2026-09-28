/**
 * Payment receipt stub — shape for UI + future email/PDF.
 * No mail transport yet; notifyPaymentReceived stays a no-op until wired.
 */

import type { InvoiceRecord, PaymentRecord } from "@/lib/db/types";

export type PaymentReceiptStub = {
  kind: "payment_receipt_stub";
  receiptNumber: string;
  issuedAt: string;
  invoiceId: string;
  invoiceNumber: string;
  customerName: string;
  amountCents: number;
  method: string;
  reference: string;
  stripeCheckoutSessionId: string | null;
  note: string;
};

export function buildPaymentReceiptStub(
  payment: PaymentRecord,
  invoice: InvoiceRecord,
): PaymentReceiptStub {
  return {
    kind: "payment_receipt_stub",
    receiptNumber: `RCPT-${payment.id.replace(/^pay_/, "").slice(0, 12).toUpperCase()}`,
    issuedAt: payment.createdAt,
    invoiceId: invoice.id,
    invoiceNumber: invoice.number,
    customerName: invoice.customerName,
    amountCents: payment.amountCents,
    method: payment.method,
    reference: payment.reference,
    stripeCheckoutSessionId: payment.stripeCheckoutSessionId,
    note: "Receipt stub — email when mail transport is configured (Settings → Platform).",
  };
}
