import { NextResponse } from "next/server";
import { guardAdmin, readJson } from "@/lib/admin/api-guard";
import { getRepos } from "@/lib/db/adapter";
import { validateHighlight } from "@/lib/stats/highlights";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ id: string }> };

const notFound = () => NextResponse.json({ error: "Not found." }, { status: 404 });

export async function GET(_request: Request, context: Ctx) {
  const denied = await guardAdmin("viewer");
  if (denied) return denied;
  const { id } = await context.params;
  const stat = (await getRepos().highlightStats.list()).find((s) => s.id === id);
  return stat ? NextResponse.json({ stat }) : notFound();
}

export async function PATCH(request: Request, context: Ctx) {
  const denied = await guardAdmin("editor");
  if (denied) return denied;
  const { id } = await context.params;
  const body = await readJson(request);
  if (body === undefined) {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }
  const parsed = validateHighlight(body, { partial: true });
  if (!parsed.ok) {
    return NextResponse.json(
      { error: "Invalid field.", field: parsed.field },
      { status: 400 },
    );
  }
  const stat = await getRepos().highlightStats.update(id, parsed.value);
  return stat ? NextResponse.json({ stat }) : notFound();
}

export async function DELETE(_request: Request, context: Ctx) {
  const denied = await guardAdmin("editor");
  if (denied) return denied;
  const { id } = await context.params;
  const removed = await getRepos().highlightStats.remove(id);
  return removed ? NextResponse.json({ ok: true }) : notFound();
}
