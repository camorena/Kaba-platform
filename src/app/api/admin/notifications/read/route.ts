import { NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/admin/dal";
import { markAdminNotificationsRead } from "@/lib/admin/notifications";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Body: { keys: string[] } or { all: true }. */
export async function POST(request: Request) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  let body: { keys?: unknown; all?: unknown };
  try {
    body = (await request.json()) as { keys?: unknown; all?: unknown };
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  const all = body?.all === true;
  const keys = Array.isArray(body?.keys)
    ? body.keys.filter((k): k is string => typeof k === "string")
    : [];
  if (!all && keys.length === 0) {
    return NextResponse.json(
      { error: "Provide keys[] or all: true." },
      { status: 400 },
    );
  }

  try {
    await markAdminNotificationsRead(admin, { all, keys });
  } catch (err) {
    console.error(
      "[admin/notifications/read] failed:",
      err instanceof Error ? err.message : err,
    );
    return NextResponse.json({ error: "Could not save read state." }, { status: 503 });
  }
  return NextResponse.json({ ok: true });
}
