import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin/auth";
import {
  getQuote,
  updateQuote,
} from "@/lib/admin/quotes-store";
import { QUOTE_STATUSES, type QuoteStatus } from "@/lib/admin/status";
import type { QuotePatch } from "@/lib/db/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** YYYY-MM-DD calendar day (America/Chicago ops). */
function parseScheduledFor(
  value: unknown,
): { ok: true; value: string | null } | { ok: false; error: string } {
  if (value === null || value === "") return { ok: true, value: null };
  if (typeof value !== "string") {
    return { ok: false, error: "Invalid scheduledFor." };
  }
  const trimmed = value.trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
    return { ok: false, error: "scheduledFor must be YYYY-MM-DD or null." };
  }
  const [y, m, d] = trimmed.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d, 12, 0, 0));
  if (
    dt.getUTCFullYear() !== y ||
    dt.getUTCMonth() !== m - 1 ||
    dt.getUTCDate() !== d
  ) {
    return { ok: false, error: "scheduledFor is not a valid calendar day." };
  }
  return { ok: true, value: trimmed };
}

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

  let body: { status?: string; notes?: string; scheduledFor?: string | null };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  const patch: QuotePatch = {};

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

  if (body.scheduledFor !== undefined) {
    const parsed = parseScheduledFor(body.scheduledFor);
    if (!parsed.ok) {
      return NextResponse.json({ error: parsed.error }, { status: 400 });
    }
    patch.scheduledFor = parsed.value;
  }

  if (
    patch.status === undefined &&
    patch.notes === undefined &&
    patch.scheduledFor === undefined
  ) {
    return NextResponse.json(
      { error: "Provide status, notes, and/or scheduledFor." },
      { status: 400 },
    );
  }

  const updated = await updateQuote(id, patch);
  return NextResponse.json({ quote: updated });
}
