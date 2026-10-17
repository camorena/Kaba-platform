import { NextResponse } from "next/server";
import { guardAdmin } from "@/lib/admin/api-guard";
import { loadBusinessStats } from "@/lib/admin/stats-server";
import { parseStatsRange } from "@/lib/stats/business";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Aggregates only — no customer names, emails, or phones. */
export async function GET(request: Request) {
  const denied = await guardAdmin("viewer");
  if (denied) return denied;
  const range = parseStatsRange(new URL(request.url).searchParams.get("range"));
  return NextResponse.json({ stats: await loadBusinessStats(range) });
}
