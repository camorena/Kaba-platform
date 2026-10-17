import "server-only";

import { NextResponse } from "next/server";
import { requireRole, type AppRole } from "@/lib/admin/dal";

/** Returns a 401/403 response when the session lacks `role`, else null. */
export async function guardAdmin(role: AppRole): Promise<NextResponse | null> {
  try {
    await requireRole(role);
    return null;
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unauthorized.";
    const status = message.startsWith("Forbidden") ? 403 : 401;
    return NextResponse.json(
      { error: status === 401 ? "Unauthorized." : "Forbidden." },
      { status },
    );
  }
}

export async function readJson(request: Request): Promise<unknown | undefined> {
  try {
    return await request.json();
  } catch {
    return undefined;
  }
}
