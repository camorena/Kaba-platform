import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin/auth";
import {
  addQuote,
  bulkUpdateQuoteStatus,
  listQuotes,
  updateQuote,
} from "@/lib/admin/quotes-store";
import { QUOTE_STATUSES, type QuoteStatus } from "@/lib/admin/status";
import {
  notificationPatchFromResult,
  notifyQuoteCreated,
} from "@/lib/db/notify";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json(
      { error: "Unauthorized. Admin session required." },
      { status: 401 },
    );
  }
  return NextResponse.json({ quotes: await listQuotes() });
}

export async function PATCH(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  let body: { ids?: unknown; status?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  const ids = Array.isArray(body.ids)
    ? body.ids.filter((id): id is string => typeof id === "string" && id.length > 0)
    : [];
  const status = body.status as QuoteStatus;

  if (!ids.length) {
    return NextResponse.json({ error: "Provide ids[]." }, { status: 400 });
  }
  if (!QUOTE_STATUSES.includes(status)) {
    return NextResponse.json({ error: "Invalid status." }, { status: 400 });
  }
  if (ids.length > 100) {
    return NextResponse.json({ error: "Max 100 ids per bulk update." }, { status: 400 });
  }

  const result = await bulkUpdateQuoteStatus(ids, status);
  return NextResponse.json({ ok: true, ...result, status });
}

/**
 * Public quote intake — persist-then-notify.
 * 1. Validate + addQuote (row is source of truth).
 * 2. notifyQuoteCreated — owner alert (+ always-copy BCC) + customer confirmation.
 * 3. Record notifyAttempts / notifiedAt; never fail the request if mail fails.
 */
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid payload." }, { status: 400 });
  }

  const data = body as Record<string, unknown>;
  const name = String(data.name ?? "").trim();
  const phone = String(data.phone ?? "").trim();
  const email = String(data.email ?? "").trim();
  const serviceType = String(data.serviceType ?? "").trim();
  const address = String(data.address ?? "").trim();
  const description = String(data.description ?? "").trim();
  const preferredContact = String(data.preferredContact ?? "phone").trim();
  const source = String(data.source ?? "api").trim() || "api";

  if (!name || !phone || !email || !serviceType || !address || !description) {
    return NextResponse.json(
      { error: "Missing required quote fields." },
      { status: 400 },
    );
  }

  // 1. Persist first.
  const quote = await addQuote({
    name,
    phone,
    email,
    serviceType,
    address,
    description,
    preferredContact,
    source,
  });

  // 2. Notify second (stub no-op — must not throw away the saved row).
  let notifyDelivered = false;
  let notifyReason = "skipped";
  try {
    const notifyResult = await notifyQuoteCreated(quote);
    notifyDelivered = notifyResult.delivered;
    notifyReason = notifyResult.reason;
    await updateQuote(
      quote.id,
      notificationPatchFromResult(quote.notifyAttempts, notifyResult),
    );
  } catch (err) {
    notifyReason =
      err instanceof Error ? err.message : "notifyQuoteCreated threw";
    await updateQuote(quote.id, {
      notifyAttempts: quote.notifyAttempts + 1,
      notifiedAt: null,
    });
    console.error(
      "[quotes] ALERT: quote %s saved but notify failed: %s",
      quote.id,
      notifyReason,
    );
  }

  return NextResponse.json(
    {
      ok: true,
      id: quote.id,
      notified: notifyDelivered,
      notifyReason,
    },
    { status: 201 },
  );
}
