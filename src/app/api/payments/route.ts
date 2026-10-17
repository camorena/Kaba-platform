import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin/auth";
import {
  listPayments,
  paidCentsForInvoice,
  recordPayment,
} from "@/lib/admin/payments-store";
import { getInvoice, invoiceSubtotalCents } from "@/lib/admin/invoices-store";
import { PAYMENT_METHODS, type PaymentMethod } from "@/lib/admin/status";
import { INVOICE_NOT_SENDABLE, isInvoiceSendable } from "@/lib/invoices/lines";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }
  return NextResponse.json({ payments: await listPayments() });
}

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  let body: {
    invoiceId?: string;
    amountCents?: number;
    method?: string;
    reference?: string;
    notes?: string;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  const invoiceId = String(body.invoiceId ?? "").trim();
  const amountCents = Number(body.amountCents);
  const method = body.method as PaymentMethod | undefined;

  if (!invoiceId) {
    return NextResponse.json({ error: "invoiceId required." }, { status: 400 });
  }
  if (!Number.isFinite(amountCents) || amountCents <= 0) {
    return NextResponse.json({ error: "Invalid amount." }, { status: 400 });
  }
  if (!method || !PAYMENT_METHODS.includes(method)) {
    return NextResponse.json({ error: "Invalid method." }, { status: 400 });
  }

  const invoice = await getInvoice(invoiceId);
  if (!invoice) {
    return NextResponse.json({ error: "Invoice not found." }, { status: 404 });
  }
  if (!isInvoiceSendable(invoice.lines)) {
    return NextResponse.json(
      {
        error: "La factura necesita al menos una línea con total mayor que $0.",
        code: INVOICE_NOT_SENDABLE,
      },
      { status: 400 },
    );
  }

  const balance = Math.max(
    0,
    invoiceSubtotalCents(invoice) - (await paidCentsForInvoice(invoice.id)),
  );
  if (Math.round(amountCents) > balance) {
    return NextResponse.json(
      {
        error: "El monto supera el saldo pendiente de la factura.",
        code: "amount_exceeds_balance",
        balanceCents: balance,
      },
      { status: 400 },
    );
  }

  const payment = await recordPayment({
    invoiceId,
    amountCents: Math.round(amountCents),
    method,
    reference: String(body.reference ?? ""),
    notes: String(body.notes ?? ""),
  });

  if (!payment) {
    return NextResponse.json(
      { error: "Invoice not found or amount invalid." },
      { status: 404 },
    );
  }

  return NextResponse.json({ payment }, { status: 201 });
}
