/**
 * Password hashing for credentials-mode profiles (Node scrypt — no paid deps).
 * Encoding: scrypt$n=<N>$r=<r>$p=<p>$<salt_b64url>$<hash_b64url>
 */

import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";

const N = 16384;
const R = 8;
const P = 1;
const KEYLEN = 32;
const MAXMEM = 64 * 1024 * 1024;

export function hashPassword(password: string): string {
  const salt = randomBytes(16);
  const derived = scryptSync(password, salt, KEYLEN, {
    N,
    r: R,
    p: P,
    maxmem: MAXMEM,
  });
  return `scrypt$n=${N}$r=${R}$p=${P}$${salt.toString("base64url")}$${derived.toString("base64url")}`;
}

export function verifyPassword(password: string, encoded: string): boolean {
  if (!encoded || !password) return false;
  const parts = encoded.split("$");
  if (parts.length !== 6 || parts[0] !== "scrypt") return false;
  const n = Number(parts[1].slice(2));
  const r = Number(parts[2].slice(2));
  const p = Number(parts[3].slice(2));
  if (!Number.isFinite(n) || !Number.isFinite(r) || !Number.isFinite(p)) {
    return false;
  }
  let salt: Buffer;
  let expected: Buffer;
  try {
    salt = Buffer.from(parts[4], "base64url");
    expected = Buffer.from(parts[5], "base64url");
  } catch {
    return false;
  }
  if (!salt.length || !expected.length) return false;
  try {
    const derived = scryptSync(password, salt, expected.length, {
      N: n,
      r,
      p,
      maxmem: MAXMEM,
    });
    if (derived.length !== expected.length) return false;
    return timingSafeEqual(derived, expected);
  } catch {
    return false;
  }
}
