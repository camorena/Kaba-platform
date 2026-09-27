import { cookies } from "next/headers";

/**
 * DEV / STAGING AUTH ONLY — NOT production security.
 *
 * This is a documented password stub so the /admin shell can be gated while
 * the real auth (Clerk/Auth.js + roles) is pending. Do not treat a successful
 * login here as evidence the admin is hardened for the public internet.
 *
 * Set ADMIN_PASSWORD in the environment. If unset, /admin shows a setup
 * notice and rejects login attempts.
 */
export const ADMIN_SESSION_COOKIE = "kaba_admin_session";
export const ADMIN_SESSION_VALUE = "stub-ok";

export function getAdminPassword(): string | null {
  const pw = process.env.ADMIN_PASSWORD?.trim();
  return pw ? pw : null;
}

export async function isAdminAuthenticated(): Promise<boolean> {
  if (!getAdminPassword()) return false;
  const jar = await cookies();
  return jar.get(ADMIN_SESSION_COOKIE)?.value === ADMIN_SESSION_VALUE;
}

export function verifyAdminPassword(input: string): boolean {
  const expected = getAdminPassword();
  if (!expected) return false;
  // Constant-time-ish compare for the stub (still not a substitute for real auth)
  if (input.length !== expected.length) return false;
  let mismatch = 0;
  for (let i = 0; i < expected.length; i++) {
    mismatch |= input.charCodeAt(i) ^ expected.charCodeAt(i);
  }
  return mismatch === 0;
}
