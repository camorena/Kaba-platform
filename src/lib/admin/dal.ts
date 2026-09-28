/**
 * Data Access Layer skeleton — authorization pattern toward requireRole.
 *
 * Next.js DAL guidance: server-only checks, minimal DTOs, every Server Action
 * starts with a role gate. Prior Kaba Fence (camorena/kaba-fence) used
 * getUser()+profiles.role; this module documents the same shape without ripping
 * out the ADMIN_PASSWORD cookie stub.
 *
 * Today:
 *   - Session is the shared password cookie (see auth.ts).
 *   - Effective role is always "owner" (single shared gate).
 *   - requireAdminSession() redirects unauthenticated page renders.
 *   - requireRole() throws Forbidden (action-safe); with the stub, only
 *     "owner" is reachable and always passes once authenticated.
 *
 * Later (when replacing the stub):
 *   - Resolve user via real auth (Auth.js / Clerk / Supabase getUser — not
 *     getSession).
 *   - Load role from DB (never a forged JWT claim alone).
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
  /** True while ADMIN_PASSWORD cookie stub is the only gate. */
  readonly stub: true;
};

const RANK: Readonly<Record<AppRole, number>> = {
  viewer: 0,
  editor: 1,
  owner: 2,
};

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

/** Password env configured? Useful for launch-blocker honesty. */
export function isStubAuthConfigured(): boolean {
  return Boolean(getAdminPassword());
}

export { RANK as APP_ROLE_RANK };
