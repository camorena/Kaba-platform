import { NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/admin/dal";
import { getAdminNotifications } from "@/lib/admin/notifications";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Derived admin notifications for the signed-in admin (bell). */
export async function GET() {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }
  try {
    const data = await getAdminNotifications(admin);
    return NextResponse.json(data, { headers: { "Cache-Control": "no-store" } });
  } catch (err) {
    console.error(
      "[admin/notifications] load failed:",
      err instanceof Error ? err.message : err,
    );
    return NextResponse.json(
      { error: "Could not load notifications." },
      { status: 503 },
    );
  }
}
