/**
 * Dual-mode admin auth.
 *
 *   stub (default) — ADMIN_PASSWORD + cookie value "stub-ok"
 *   credentials    — when AUTH_SECRET is set: email/password against profiles,
 *                    signed session cookie (HMAC). Role loaded from DB in dal.ts.
 *
 * AUTH_SECRET unset ⇒ stub remains the only path (build/demo safe).
 * Do not treat either mode as full production hardening (MFA / audit / CSRF).
 *
 * Auth.js is intentionally not required: this credentials path is free, uses
 * profiles.role, and matches the DAL SessionAdmin contract. Wire Auth.js later
 * if you want OAuth providers — keep getCurrentAdmin() as the single resolver.
 */

import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

export const ADMIN_SESSION_COOKIE = "kaba_admin_session";
export const ADMIN_SESSION_VALUE = "stub-ok";
export const ADMIN_SESSION_MAX_AGE_SEC = 60 * 60 * 12; // 12 hours

export type AuthMode = "stub" | "credentials";

export type CredentialsSessionPayload = {
  readonly sub: string;
  readonly exp: number;
};

export function getAuthMode(): AuthMode {
  return process.env.AUTH_SECRET?.trim() ? "credentials" : "stub";
}

export function isCredentialsMode(): boolean {
  return getAuthMode() === "credentials";
}

export function getAuthSecret(): string | null {
  const s = process.env.AUTH_SECRET?.trim();
  return s ? s : null;
}

export function getAdminPassword(): string | null {
  const pw = process.env.ADMIN_PASSWORD?.trim();
  return pw ? pw : null;
}

/** True when the active mode has what it needs to accept a login. */
export function isAuthConfigured(): boolean {
  if (isCredentialsMode()) return Boolean(getAuthSecret());
  return Boolean(getAdminPassword());
}

export function verifyAdminPassword(input: string): boolean {
  const expected = getAdminPassword();
  if (!expected) return false;
  if (input.length !== expected.length) return false;
  let mismatch = 0;
  for (let i = 0; i < expected.length; i++) {
    mismatch |= input.charCodeAt(i) ^ expected.charCodeAt(i);
  }
  return mismatch === 0;
}

function b64url(buf: Buffer): string {
  return buf.toString("base64url");
}

function fromB64url(s: string): Buffer {
  return Buffer.from(s, "base64url");
}

function sign(payloadB64: string, secret: string): string {
  return b64url(createHmac("sha256", secret).update(payloadB64).digest());
}

/** Issue a signed credentials session cookie value for a profile id. */
export function issueCredentialsSessionValue(profileId: string): string {
  const secret = getAuthSecret();
  if (!secret) {
    throw new Error("AUTH_SECRET is required to issue credentials sessions.");
  }
  const payload: CredentialsSessionPayload = {
    sub: profileId,
    exp: Math.floor(Date.now() / 1000) + ADMIN_SESSION_MAX_AGE_SEC,
  };
  const payloadB64 = b64url(Buffer.from(JSON.stringify(payload), "utf8"));
  const sig = sign(payloadB64, secret);
  return `cred.v1.${payloadB64}.${sig}`;
}

/** Parse + verify credentials session; null if invalid / expired / wrong mode. */
export function parseCredentialsSessionValue(
  value: string | undefined | null,
): CredentialsSessionPayload | null {
  if (!value || !value.startsWith("cred.v1.")) return null;
  const secret = getAuthSecret();
  if (!secret) return null;
  const parts = value.split(".");
  // cred.v1.<payload>.<sig>
  if (parts.length !== 4 || parts[0] !== "cred" || parts[1] !== "v1") {
    return null;
  }
  const payloadB64 = parts[2];
  const sig = parts[3];
  const expected = sign(payloadB64, secret);
  try {
    const a = fromB64url(sig);
    const b = fromB64url(expected);
    if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  } catch {
    return null;
  }
  try {
    const raw = JSON.parse(
      fromB64url(payloadB64).toString("utf8"),
    ) as CredentialsSessionPayload;
    if (!raw?.sub || typeof raw.sub !== "string") return null;
    if (typeof raw.exp !== "number" || raw.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }
    return { sub: raw.sub, exp: raw.exp };
  } catch {
    return null;
  }
}

export type SessionCookieKind = "stub" | "credentials" | "none";

export async function readSessionCookie(): Promise<{
  kind: SessionCookieKind;
  value: string | null;
  credentials: CredentialsSessionPayload | null;
}> {
  const jar = await cookies();
  const value = jar.get(ADMIN_SESSION_COOKIE)?.value ?? null;
  if (!value) return { kind: "none", value: null, credentials: null };

  if (value === ADMIN_SESSION_VALUE) {
    return { kind: "stub", value, credentials: null };
  }

  const credentials = parseCredentialsSessionValue(value);
  if (credentials) {
    return { kind: "credentials", value, credentials };
  }

  return { kind: "none", value, credentials: null };
}

/**
 * Cookie presence check — prefer getCurrentAdmin() for role-aware gates.
 * Stub cookie only counts in stub mode; credentials token only in credentials mode.
 */
export async function isAdminAuthenticated(): Promise<boolean> {
  const session = await readSessionCookie();
  const mode = getAuthMode();
  if (mode === "stub") {
    if (!getAdminPassword()) return false;
    return session.kind === "stub";
  }
  // credentials mode
  return session.kind === "credentials" && session.credentials !== null;
}

export function sessionCookieOptions(maxAge: number = ADMIN_SESSION_MAX_AGE_SEC) {
  return {
    httpOnly: true as const,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge,
  };
}
