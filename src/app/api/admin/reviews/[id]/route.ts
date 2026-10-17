import { NextResponse } from "next/server";
import { guardAdmin, readJson } from "@/lib/admin/api-guard";
import { getRepos } from "@/lib/db/adapter";
import { validateReview } from "@/lib/reviews/model";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ id: string }> };

const notFound = () => NextResponse.json({ error: "Not found." }, { status: 404 });

export async function GET(_request: Request, context: Ctx) {
  const denied = await guardAdmin("viewer");
  if (denied) return denied;
  const { id } = await context.params;
  const review = await getRepos().reviews.get(id);
  return review ? NextResponse.json({ review }) : notFound();
}

export async function PATCH(request: Request, context: Ctx) {
  const denied = await guardAdmin("editor");
  if (denied) return denied;
  const { id } = await context.params;
  const repos = getRepos();
  if (!(await repos.reviews.get(id))) return notFound();
  const body = await readJson(request);
  if (body === undefined) {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }
  const parsed = validateReview(body, {
    partial: true,
    allowNonUuidCustomer: repos.adapter === "memory",
  });
  if (!parsed.ok) {
    return NextResponse.json(
      { error: "Invalid field.", field: parsed.field },
      { status: 400 },
    );
  }
  const patch = parsed.value;
  if (patch.customerId && !(await repos.customers.get(patch.customerId))) {
    return NextResponse.json(
      { error: "Customer not found.", field: "customerId" },
      { status: 400 },
    );
  }
  const review = await repos.reviews.update(id, patch);
  return review ? NextResponse.json({ review }) : notFound();
}

export async function DELETE(_request: Request, context: Ctx) {
  const denied = await guardAdmin("editor");
  if (denied) return denied;
  const { id } = await context.params;
  const removed = await getRepos().reviews.remove(id);
  return removed ? NextResponse.json({ ok: true }) : notFound();
}
