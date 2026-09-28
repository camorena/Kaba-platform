import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin/auth";
import {
  createInvoiceFromQuote,
  listInvoices,
} from "@/lib/admin/invoices-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }
  return NextResponse.json({ invoices: await listInvoices() });
}

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  let body: { quoteId?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  const quoteId = String(body.quoteId ?? "").trim();
  if (!quoteId) {
    return NextResponse.json({ error: "quoteId required." }, { status: 400 });
  }

  const invoice = await createInvoiceFromQuote(quoteId);
  if (!invoice) {
    return NextResponse.json({ error: "Quote not found." }, { status: 404 });
  }

  return NextResponse.json({ invoice }, { status: 201 });
}
