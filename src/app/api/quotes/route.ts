import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin/auth";
import { addQuote, listQuotes } from "@/lib/admin/quotes-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json(
      { error: "Unauthorized. Admin session required." },
      { status: 401 },
    );
  }
  return NextResponse.json({ quotes: listQuotes() });
}

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

  const quote = addQuote({
    name,
    phone,
    email,
    serviceType,
    address,
    description,
    preferredContact,
    source,
  });

  return NextResponse.json({ ok: true, id: quote.id }, { status: 201 });
}
