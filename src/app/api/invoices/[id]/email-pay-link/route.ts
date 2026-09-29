/**
 * Admin: email customer the public pay link for an invoice.
 * Honest 503 when mail is not configured (Settings → Platform).
 */

import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin/auth";
import { getInvoice, updateInvoiceStatus } from "@/lib/admin/invoices-store";
import { notifyInvoicePayLink } from "@/lib/db/notify";
import { isMailReady } from "@/lib/mail";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  if (!isMailReady()) {
    return NextResponse.json(
      {
        error:
          "Mail not configured. Set MAIL_FROM plus RESEND_API_KEY (preferred) or SMTP_HOST in Vercel env, then redeploy. See Settings → Platform.",
        mailReady: false,
        delivered: false,
      },
      { status: 503 },
    );
  }

  const { id } = await context.params;
  const invoice = await getInvoice(id);
  if (!invoice) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }

  const result = await notifyInvoicePayLink(invoice, { request });
  if (!result.delivered) {
    const status =
      result.reason.includes("no customer email") ||
      result.reason.includes("no pay token")
        ? 400
        : 502;
    return NextResponse.json(
      {
        error: result.reason,
        delivered: false,
        mailReady: true,
        payUrl: result.payUrl,
        to: result.to,
      },
      { status },
    );
  }

  // Soft-mark draft invoices as sent after a successful pay-link email.
  let statusUpdated = false;
  if (invoice.status === "draft") {
    try {
      await updateInvoiceStatus(id, "sent");
      statusUpdated = true;
    } catch {
      /* non-fatal — email already delivered */
    }
  }

  return NextResponse.json({
    delivered: true,
    mailReady: true,
    reason: result.reason,
    payUrl: result.payUrl,
    to: result.to,
    statusUpdated,
  });
}
