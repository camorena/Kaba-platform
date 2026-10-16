import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin/auth";
import { getCustomer, updateCustomer } from "@/lib/admin/quotes-store";
import { CustomerEmailTakenError } from "@/lib/db/customer-errors";
import { CUSTOMER_PATCH_FIELDS, type CustomerPatch } from "@/lib/db/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_LEN: Record<(typeof CUSTOMER_PATCH_FIELDS)[number], number> = {
  name: 200,
  email: 254,
  phone: 40,
  notes: 8000,
  company: 200,
  street: 200,
  city: 100,
  state: 50,
  zip: 20,
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }
  const { id } = await context.params;
  const customer = await getCustomer(id);
  if (!customer) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }
  return NextResponse.json({ customer });
}

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { id } = await context.params;
  const current = await getCustomer(id);
  if (!current) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid body." }, { status: 400 });
  }

  const patch: CustomerPatch = {};
  for (const field of CUSTOMER_PATCH_FIELDS) {
    const value = body[field];
    if (value === undefined) continue;
    if (typeof value !== "string") {
      return NextResponse.json({ error: `Invalid ${field}.` }, { status: 400 });
    }
    const trimmed = field === "notes" ? value.trim() : value.replace(/\s+/g, " ").trim();
    patch[field] = trimmed.slice(0, MAX_LEN[field]);
  }
  if (patch.email !== undefined) patch.email = patch.email.toLowerCase();
  if (patch.state !== undefined) patch.state = patch.state.toUpperCase();

  if (Object.keys(patch).length === 0) {
    return NextResponse.json({ error: "No fields to update." }, { status: 400 });
  }

  const next = { ...current, ...patch };
  if (!next.name.trim()) {
    return NextResponse.json(
      { error: "Name is required.", field: "name" },
      { status: 400 },
    );
  }
  if (next.email && !EMAIL_RE.test(next.email)) {
    return NextResponse.json(
      { error: "Invalid email.", field: "email" },
      { status: 400 },
    );
  }
  if (!next.email.trim() && !next.phone.trim()) {
    return NextResponse.json(
      { error: "Email or phone is required.", field: "contact" },
      { status: 400 },
    );
  }

  try {
    const customer = await updateCustomer(id, patch);
    if (!customer) {
      return NextResponse.json({ error: "Not found." }, { status: 404 });
    }
    return NextResponse.json({ customer });
  } catch (err) {
    if (err instanceof CustomerEmailTakenError) {
      return NextResponse.json(
        { error: err.message, field: "email" },
        { status: 409 },
      );
    }
    throw err;
  }
}
