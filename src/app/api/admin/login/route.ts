import { NextResponse } from "next/server";
import {
  ADMIN_SESSION_COOKIE,
  ADMIN_SESSION_VALUE,
  getAdminPassword,
  getAuthMode,
  isAuthConfigured,
  issueCredentialsSessionValue,
  sessionCookieOptions,
  verifyAdminPassword,
} from "@/lib/admin/auth";
import { verifyPassword } from "@/lib/admin/password";
import { getRepos } from "@/lib/db/adapter";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  if (!isAuthConfigured()) {
    const mode = getAuthMode();
    return NextResponse.json(
      {
        error:
          mode === "credentials"
            ? "AUTH_SECRET is not set. Add it to the environment for credentials mode."
            : "ADMIN_PASSWORD is not set. Add it to the environment before using the admin stub.",
      },
      { status: 503 },
    );
  }

  let body: { password?: string; email?: string };
  try {
    body = (await request.json()) as { password?: string; email?: string };
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  const password = String(body.password ?? "");
  const email = String(body.email ?? "").trim();
  const mode = getAuthMode();

  if (mode === "credentials") {
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 },
      );
    }
    try {
      const profile = await getRepos().profiles.getByEmail(email);
      if (
        !profile ||
        !profile.isActive ||
        !profile.passwordHash ||
        !verifyPassword(password, profile.passwordHash)
      ) {
        return NextResponse.json(
          { error: "Incorrect email or password." },
          { status: 401 },
        );
      }
      const res = NextResponse.json({
        ok: true,
        mode: "credentials",
        role: profile.role,
      });
      res.cookies.set({
        name: ADMIN_SESSION_COOKIE,
        value: issueCredentialsSessionValue(profile.id),
        ...sessionCookieOptions(),
      });
      return res;
    } catch (err) {
      console.error("[login] credentials verify failed:", err);
      return NextResponse.json(
        {
          error:
            "Could not verify credentials. Check the data adapter / DATABASE_URL.",
        },
        { status: 503 },
      );
    }
  }

  // stub mode
  if (!getAdminPassword()) {
    return NextResponse.json(
      {
        error:
          "ADMIN_PASSWORD is not set. Add it to the environment before using the admin stub.",
      },
      { status: 503 },
    );
  }
  if (!verifyAdminPassword(password)) {
    return NextResponse.json({ error: "Incorrect password." }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true, mode: "stub" });
  res.cookies.set({
    name: ADMIN_SESSION_COOKIE,
    value: ADMIN_SESSION_VALUE,
    ...sessionCookieOptions(),
  });
  return res;
}
