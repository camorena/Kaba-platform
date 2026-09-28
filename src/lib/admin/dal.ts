/**
 * Data Access Layer — authorization toward requireRole + profiles.role.
 *
 * Dual-mode sessions (see auth.ts):
 *   stub         — ADMIN_PASSWORD cookie → synthetic owner (stub: true)
 *   credentials  — AUTH_SECRET signed cookie → load profiles row (stub: false)
 *
 * Role is never trusted from a client-forged claim alone: credentials mode
 * re-reads profiles.role (and is_active) on every getCurrentAdmin().
 *
 * Auth.js is optional later (OAuth); this DAL shape stays the same.
 */

import { redirect } from "next/navigation";
import {
  getAdminPassword,
  getAuthMode,
  isAuthConfigured,
  isCredentialsMode,
  readSessionCookie,
  type AuthMode,
} from "@/lib/admin/auth";
import { getRepos } from "@/lib/db/adapter";

export type AppRole = "owner" | "editor" | "viewer";

/** Minimal DTO a page may see — no tokens, no raw cookie values, no passwordHash. */
export type SessionAdmin = {
  readonly id: string;
  readonly email: string;
  readonly fullName: string;
  readonly role: AppRole;
  /** True while ADMIN_PASSWORD stub is the active session. */
  readonly stub: boolean;
  readonly authMode: AuthMode;
  /** ISO time the session was resolved (request-scoped). */
  readonly resolvedAt: string;
};

/** Rank for minimum-role checks — higher may do everything lower may do. */
const RANK: Readonly<Record<AppRole, number>> = {
  viewer: 0,
  editor: 1,
  owner: 2,
};

export const APP_ROLE_DESCRIPTIONS: Readonly<
  Record<AppRole, { en: string; es: string }>
> = {
  owner: {
    en: "Full access — users, roles, billing settings, destructive actions.",
    es: "Acceso total: usuarios, roles, facturación y acciones destructivas.",
  },
  editor: {
    en: "Create and edit quotes, invoices, payments, and content. No user admin.",
    es: "Crear y editar cotizaciones, facturas, pagos y contenido. Sin administración de usuarios.",
  },
  viewer: {
    en: "Read-only ops views. No mutations.",
    es: "Vistas operativas de solo lectura. Sin cambios.",
  },
};

/**
 * Optional ops note from env (ADMIN_ROLES_DOC). Shown in Settings → Security.
 * Not a role grant — documentation only.
 */
export function getAdminRolesDoc(): string | null {
  const raw = process.env.ADMIN_ROLES_DOC?.trim();
  return raw ? raw : null;
}

function isAppRole(value: string): value is AppRole {
  return value === "owner" || value === "editor" || value === "viewer";
}

/**
 * Resolve the current admin, or null.
 * Stub mode: stub cookie ⇒ synthetic owner.
 * Credentials mode: signed cookie ⇒ active profile with role from DB.
 */
export async function getCurrentAdmin(): Promise<SessionAdmin | null> {
  const mode = getAuthMode();
  const session = await readSessionCookie();
  const resolvedAt = new Date().toISOString();

  if (mode === "stub") {
    if (!getAdminPassword()) return null;
    if (session.kind !== "stub") return null;
    return {
      id: "stub-admin",
      email: "ops@kabafence.example",
      fullName: "Ops Lead",
      role: "owner",
      stub: true,
      authMode: "stub",
      resolvedAt,
    };
  }

  // credentials mode — ignore stub-ok cookie
  if (session.kind !== "credentials" || !session.credentials) return null;

  try {
    const profile = await getRepos().profiles.getById(session.credentials.sub);
    if (!profile || !profile.isActive) return null;
    if (!isAppRole(profile.role)) return null;
    return {
      id: profile.id,
      email: profile.email,
      fullName: profile.fullName || profile.email,
      role: profile.role,
      stub: false,
      authMode: "credentials",
      resolvedAt,
    };
  } catch (err) {
    console.error("[dal] failed to load profile for session:", err);
    return null;
  }
}

/** Require a signed-in admin for page renders. Redirects to login if not. */
export async function requireAdminSession(): Promise<SessionAdmin> {
  const user = await getCurrentAdmin();
  if (user === null) redirect("/admin/login");
  return user;
}

/**
 * Require at least the given role for Server Actions / mutations.
 * Throws rather than redirects so a direct POST fails closed.
 */
export async function requireRole(minimum: AppRole): Promise<SessionAdmin> {
  const user = await getCurrentAdmin();
  if (user === null) {
    throw new Error("Unauthorized: admin session required.");
  }
  if (RANK[user.role] < RANK[minimum]) {
    throw new Error(`Forbidden: this action requires the ${minimum} role.`);
  }
  return user;
}

/** Page-render variant — redirect home instead of throwing. */
export async function requirePageRole(minimum: AppRole): Promise<SessionAdmin> {
  const user = await requireAdminSession();
  if (RANK[user.role] < RANK[minimum]) redirect("/admin");
  return user;
}

export async function canEdit(): Promise<boolean> {
  const user = await getCurrentAdmin();
  return user !== null && RANK[user.role] >= RANK.editor;
}

export async function canView(): Promise<boolean> {
  const user = await getCurrentAdmin();
  return user !== null && RANK[user.role] >= RANK.viewer;
}

/** Active mode has its required env? Useful for launch-blocker honesty. */
export function isStubAuthConfigured(): boolean {
  return isAuthConfigured();
}

export function roleAtLeast(role: AppRole, minimum: AppRole): boolean {
  return RANK[role] >= RANK[minimum];
}

/** Live auth posture for Settings → Security. */
export function getAuthPosture(): {
  mode: AuthMode;
  configured: boolean;
  credentialsEnabled: boolean;
  stubPasswordConfigured: boolean;
} {
  const mode = getAuthMode();
  return {
    mode,
    configured: isAuthConfigured(),
    credentialsEnabled: isCredentialsMode(),
    stubPasswordConfigured: Boolean(getAdminPassword()),
  };
}

export { RANK as APP_ROLE_RANK };
