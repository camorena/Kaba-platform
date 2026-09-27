import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin/auth";
import {
  listPayments,
  recordPayment,
} from "@/lib/admin/payments-store";
import { PAYMENT_METHODS, type PaymentMethod } from "@/lib/admin/status";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }
  return NextResponse.json({ payments: listPayments() });
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

  const payment = recordPayment({
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
