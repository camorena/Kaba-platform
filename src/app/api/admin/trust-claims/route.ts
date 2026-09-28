import { NextResponse } from "next/server";
import { requireRole } from "@/lib/admin/dal";
import { getRepos } from "@/lib/db/adapter";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await requireRole("viewer");
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unauthorized.";
    const status = message.startsWith("Forbidden") ? 403 : 401;
    return NextResponse.json({ error: message }, { status });
  }

  const claims = await getRepos().trustClaims.get();
  return NextResponse.json({
    claims,
    adapter: getRepos().adapter,
    storage: "server",
  });
}

export async function PUT(request: Request) {
  try {
    await requireRole("editor");
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unauthorized.";
    const status = message.startsWith("Forbidden") ? 403 : 401;
    return NextResponse.json({ error: message }, { status });
  }

  let body: {
    claimFreeEstimates?: unknown;
    claimLocallyOwned?: unknown;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  if (
    typeof body.claimFreeEstimates !== "boolean" ||
    typeof body.claimLocallyOwned !== "boolean"
  ) {
    return NextResponse.json(
      {
        error:
          "Provide boolean claimFreeEstimates and claimLocallyOwned.",
      },
      { status: 400 },
    );
  }

  const claims = await getRepos().trustClaims.save({
    claimFreeEstimates: body.claimFreeEstimates,
    claimLocallyOwned: body.claimLocallyOwned,
  });

  return NextResponse.json({
    ok: true,
    claims,
    adapter: getRepos().adapter,
    storage: "server",
  });
}
