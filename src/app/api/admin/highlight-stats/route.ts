import { NextResponse } from "next/server";
import { guardAdmin, readJson } from "@/lib/admin/api-guard";
import { getRepos } from "@/lib/db/adapter";
import {
  MAX_HIGHLIGHT_STATS,
  validateHighlight,
  type HighlightStatInput,
} from "@/lib/stats/highlights";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const denied = await guardAdmin("viewer");
  if (denied) return denied;
  return NextResponse.json({ stats: await getRepos().highlightStats.list() });
}

export async function POST(request: Request) {
  const denied = await guardAdmin("editor");
  if (denied) return denied;
  const body = await readJson(request);
  if (body === undefined) {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }
  const parsed = validateHighlight(body, { partial: false });
  if (!parsed.ok) {
    return NextResponse.json(
      { error: "Invalid field.", field: parsed.field },
      { status: 400 },
    );
  }
  const repo = getRepos().highlightStats;
  if ((await repo.list()).length >= MAX_HIGHLIGHT_STATS) {
    return NextResponse.json(
      { error: "Limit reached.", code: "limit", max: MAX_HIGHLIGHT_STATS },
      { status: 409 },
    );
  }
  const stat = await repo.create(parsed.value as HighlightStatInput);
  return NextResponse.json({ stat }, { status: 201 });
}
