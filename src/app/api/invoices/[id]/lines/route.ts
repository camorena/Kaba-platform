/**
 * Admin: replace an invoice's line items (add / edit / remove in one save).
 * Allowed while the invoice is draft or sent; a sent invoice must keep a
 * positive total. Totals are always derived from the lines.
 */

import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin/auth";
import { getInvoice, replaceInvoiceLines } from "@/lib/admin/invoices-store";
import { paidCentsForInvoice } from "@/lib/admin/payments-store";
import {
  INVOICE_LINES_LOCKED,
  INVOICE_NOT_SENDABLE,
  isInvoiceEditable,
  isInvoiceSendable,
  validateInvoiceLines,
} from "@/lib/invoices/lines";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const LOCKED_MESSAGE =
  "Las líneas no se pueden editar: la factura tiene pagos, está pagada o anulada.";

export async function PUT(
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

  let body: { lines?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  const parsed = validateInvoiceLines(body.lines);
  if (!parsed.ok) {
    return NextResponse.json(
      { error: "Líneas inválidas.", code: parsed.error, index: parsed.index },
      { status: 400 },
    );
  }

  if (!isInvoiceEditable(before.status) || (await paidCentsForInvoice(id)) > 0) {
    return NextResponse.json(
      { error: LOCKED_MESSAGE, code: INVOICE_LINES_LOCKED },
      { status: 409 },
    );
  }

  // Once sent, the customer may already hold the link: keep it payable.
  if (before.status !== "draft" && !isInvoiceSendable(parsed.lines)) {
    return NextResponse.json(
      {
        error: "Una factura enviada debe conservar un total mayor que $0.",
        code: INVOICE_NOT_SENDABLE,
      },
      { status: 400 },
    );
  }

  const result = await replaceInvoiceLines(id, parsed.lines);
  if (!result.ok) {
    return result.reason === "locked"
      ? NextResponse.json(
          { error: LOCKED_MESSAGE, code: INVOICE_LINES_LOCKED },
          { status: 409 },
        )
      : NextResponse.json({ error: "Not found." }, { status: 404 });
  }

  return NextResponse.json({
    invoice: result.invoice,
    paidCents: await paidCentsForInvoice(id),
  });
}
