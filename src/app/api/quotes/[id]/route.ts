import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin/auth";
import {
  getQuote,
  updateQuoteStatus,
  type QuoteStatus,
} from "@/lib/admin/quotes-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const statuses: QuoteStatus[] = [
  "new",
  "contacted",
  "scheduled",
  "won",
  "lost",
];

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { id } = await context.params;
  if (!getQuote(id)) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }

  let body: { status?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  const status = body.status as QuoteStatus | undefined;
  if (!status || !statuses.includes(status)) {
    return NextResponse.json({ error: "Invalid status." }, { status: 400 });
  }

  const updated = updateQuoteStatus(id, status);
  return NextResponse.json({ quote: updated });
}
