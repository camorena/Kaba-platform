/**
 * Data Access Layer — authorization pattern toward requireRole.
 *
 * Next.js DAL guidance: server-only checks, minimal DTOs, every Server Action
 * starts with a role gate. Prior Kaba Fence (camorena/kaba-fence) used
 * getUser()+profiles.role; this module documents the same shape without ripping
 * out the ADMIN_PASSWORD cookie stub.
 *
 * Session contract (stub):
 *   - Cookie `kaba_admin_session=stub-ok` after ADMIN_PASSWORD verify (auth.ts).
 *   - getCurrentAdmin() → SessionAdmin | null (no tokens, no raw cookie).
 *   - SessionAdmin.stub === true while the password gate is the only auth.
 *   - Effective role is always "owner" (single shared gate).
 *   - requireAdminSession() redirects unauthenticated page renders.
 *   - requireRole() throws Forbidden (action-safe); requirePageRole() redirects.
 *
 * Roles roadmap (owner > editor > viewer) — documented in Settings → Security.
 * Optional env ADMIN_ROLES_DOC may hold a short ops note (shown in Settings only).
 * No fake multi-user accounts yet.
 *
 * Later (when replacing the stub):
 *   - Resolve user via real auth (Auth.js / Clerk / Supabase getUser — not
 *     getSession).
 *   - Load role from DB profiles (never a forged JWT claim alone).
 *   - Keep RANK + requireRole / requirePageRole split (throw vs redirect).
 *
 * Do not treat a successful stub login as production security.
 */

import { redirect } from "next/navigation";
import {
  getAdminPassword,
  isAdminAuthenticated,
} from "@/lib/admin/auth";

export type AppRole = "owner" | "editor" | "viewer";

/** Minimal DTO a page may see — no tokens, no raw cookie values. */
export type SessionAdmin = {
  readonly id: string;
  readonly email: string;
  readonly fullName: string;
  readonly role: AppRole;
  /**
   * True while ADMIN_PASSWORD cookie stub is the only gate.
   * When real auth lands, drop `stub` or set stub: false and widen the union.
   */
  readonly stub: true;
  /** ISO time the stub session was resolved (request-scoped, not cookie expiry). */
  readonly resolvedAt: string;
};

/** Rank for minimum-role checks — higher may do everything lower may do. */
const RANK: Readonly<Record<AppRole, number>> = {
  viewer: 0,
  editor: 1,
  owner: 2,
};

/** Human labels for Settings / docs (not i18n — UI uses dictionary keys). */
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

/**
 * Resolve the current admin, or null.
 * Stub: authenticated cookie ⇒ synthetic owner; else null.
 */
export async function getCurrentAdmin(): Promise<SessionAdmin | null> {
  if (!(await isAdminAuthenticated())) return null;
  return {
    id: "stub-admin",
    email: "ops@kabafence.example",
    fullName: "Ops Lead",
    role: "owner",
    stub: true,
    resolvedAt: new Date().toISOString(),
  };
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
  const user = await requireAdminSession();
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

/** Password env configured? Useful for launch-blocker honesty. */
export function isStubAuthConfigured(): boolean {
  return Boolean(getAdminPassword());
}

export function roleAtLeast(role: AppRole, minimum: AppRole): boolean {
  return RANK[role] >= RANK[minimum];
}

export { RANK as APP_ROLE_RANK };
