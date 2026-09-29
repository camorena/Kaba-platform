import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin/auth";
import {
  getInvoice,
  updateInvoiceStatus,
} from "@/lib/admin/invoices-store";
import { INVOICE_STATUSES, type InvoiceStatus } from "@/lib/admin/status";
import {
  listPaymentsForInvoice,
  paidCentsForInvoice,
} from "@/lib/admin/payments-store";
import { maybeAutoEmailInvoicePayLink } from "@/lib/db/notify";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }
  const { id } = await context.params;
  const invoice = await getInvoice(id);
  if (!invoice) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }
  return NextResponse.json({
    invoice,
    payments: await listPaymentsForInvoice(id),
    paidCents: await paidCentsForInvoice(id),
  });
}

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { id } = await context.params;
  const before = await getInvoice(id);
  if (!before) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }

  let body: { status?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  const status = body.status as InvoiceStatus | undefined;
  if (!status || !INVOICE_STATUSES.includes(status)) {
    return NextResponse.json({ error: "Invalid status." }, { status: 400 });
  }

  const updated = await updateInvoiceStatus(id, status);
  if (!updated) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }

  let autoPayLink: Awaited<ReturnType<typeof maybeAutoEmailInvoicePayLink>> | null =
    null;
  let invoice = updated;

  // First transition to "sent" → auto email pay link (idempotent; honest no-op if mail off).
  if (status === "sent" && before.status !== "sent") {
    autoPayLink = await maybeAutoEmailInvoicePayLink(updated, { request });
    if (autoPayLink.invoice) {
      invoice = autoPayLink.invoice;
    }
  }

  return NextResponse.json({
    invoice,
    autoPayLink: autoPayLink
      ? {
          attempted: autoPayLink.attempted,
          delivered: autoPayLink.delivered,
          skipped: autoPayLink.skipped,
          reason: autoPayLink.reason,
          to: autoPayLink.to,
        }
      : undefined,
  });
}
