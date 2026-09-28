/**
 * Server-only trust claims reader — uses the selected data adapter.
 */

import "server-only";

import { getRepos } from "@/lib/db/adapter";
import type { TrustClaims } from "@/lib/admin/trust-claims";

export async function getTrustClaimsForPublic(): Promise<TrustClaims> {
  return getRepos().trustClaims.get();
}
