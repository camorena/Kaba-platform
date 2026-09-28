import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin/auth";
import {
  getQuote,
  updateQuote,
} from "@/lib/admin/quotes-store";
import { QUOTE_STATUSES, type QuoteStatus } from "@/lib/admin/status";

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
  const quote = await getQuote(id);
  if (!quote) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }
  return NextResponse.json({ quote });
}

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { id } = await context.params;
  if (!(await getQuote(id))) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }

  let body: { status?: string; notes?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  const patch: { status?: QuoteStatus; notes?: string } = {};

  if (body.status !== undefined) {
    const status = body.status as QuoteStatus;
    if (!QUOTE_STATUSES.includes(status)) {
      return NextResponse.json({ error: "Invalid status." }, { status: 400 });
    }
    patch.status = status;
  }

  if (body.notes !== undefined) {
    if (typeof body.notes !== "string") {
      return NextResponse.json({ error: "Invalid notes." }, { status: 400 });
    }
    patch.notes = body.notes.slice(0, 8000);
  }

  if (patch.status === undefined && patch.notes === undefined) {
    return NextResponse.json(
      { error: "Provide status and/or notes." },
      { status: 400 },
    );
  }

  const updated = await updateQuote(id, patch);
  return NextResponse.json({ quote: updated });
}
