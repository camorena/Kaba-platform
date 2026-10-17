import { NextResponse } from "next/server";
import { guardAdmin, readJson } from "@/lib/admin/api-guard";
import { getRepos } from "@/lib/db/adapter";
import { validateReview, type ReviewInput } from "@/lib/reviews/model";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const denied = await guardAdmin("viewer");
  if (denied) return denied;
  return NextResponse.json({ reviews: await getRepos().reviews.list() });
}

export async function POST(request: Request) {
  const denied = await guardAdmin("editor");
  if (denied) return denied;
  const body = await readJson(request);
  if (body === undefined) {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }
  const repos = getRepos();
  const parsed = validateReview(body, {
    partial: false,
    allowNonUuidCustomer: repos.adapter === "memory",
  });
  if (!parsed.ok) {
    return NextResponse.json(
      { error: "Invalid field.", field: parsed.field },
      { status: 400 },
    );
  }
  const input = parsed.value as ReviewInput;
  if (input.customerId && !(await repos.customers.get(input.customerId))) {
    return NextResponse.json(
      { error: "Customer not found.", field: "customerId" },
      { status: 400 },
    );
  }
  const review = await repos.reviews.create(input);
  return NextResponse.json({ review }, { status: 201 });
}
