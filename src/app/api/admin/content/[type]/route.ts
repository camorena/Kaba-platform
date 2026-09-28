import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin/auth";
import {
  getContent,
  listContent,
  resolveContentType,
  updateContent,
  type ContentFieldValue,
} from "@/lib/cms";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  context: { params: Promise<{ type: string }> },
) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }
  const { type } = await context.params;
  if (!resolveContentType(type)) {
    return NextResponse.json({ error: "Unknown content type." }, { status: 404 });
  }
  return NextResponse.json({ documents: listContent(type) });
}

export async function PATCH(
  request: Request,
  context: { params: Promise<{ type: string }> },
) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }
  const { type } = await context.params;
  if (!resolveContentType(type)) {
    return NextResponse.json({ error: "Unknown content type." }, { status: 404 });
  }

  let body: {
    id?: unknown;
    status?: unknown;
    fields?: unknown;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  const id = typeof body.id === "string" ? body.id : "";
  if (!id) {
    return NextResponse.json({ error: "Provide id." }, { status: 400 });
  }

  const existing = getContent(type, id);
  if (!existing) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }

  const status =
    body.status === "published" || body.status === "draft"
      ? body.status
      : undefined;
  const fields =
    body.fields && typeof body.fields === "object" && !Array.isArray(body.fields)
      ? (body.fields as Record<string, ContentFieldValue>)
      : undefined;

  const document = updateContent(type, id, { status, fields });
  if (!document) {
    return NextResponse.json({ error: "Update failed." }, { status: 500 });
  }
  return NextResponse.json({ ok: true, document });
}
