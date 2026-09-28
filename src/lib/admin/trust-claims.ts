/**
 * Owner-asserted trust claims — Settings toggles shaped for a future DB row.
 *
 * Today:
 *   - Browser localStorage stub for Settings UI (client).
 *   - Server memory singleton (memoryTrustClaimsRepo) for getTrustClaimsForPublic().
 * Public marketing still uses `site.ts` trustPoints until a durable store feeds
 * the public reader; do not wire the public hero bar to localStorage.
 *
 * API shape (stable for DB swap):
 *   TrustClaims { claimFreeEstimates, claimLocallyOwned, updatedAt }
 *   getTrustClaimsForPublic() — server-safe reader
 *   read/writeTrustClaimsClient() — Settings UI only
 */

import {
  DEFAULT_TRUST_CLAIMS,
  memoryTrustClaimsRepo,
} from "@/lib/db/memory/trust-claims";
import type { TrustClaimsRecord } from "@/lib/db/types";

export type TrustClaims = TrustClaimsRecord;

export const TRUST_CLAIMS_STORAGE_KEY = "kaba-admin-trust-claims-v1";

export { DEFAULT_TRUST_CLAIMS };

/**
 * Server / public reader.
 * Memory adapter today; when Postgres site_settings lands, point this at
 * getRepos().trustClaims.get() (or keep memoryTrustClaimsRepo as the memory path).
 */
export function getTrustClaimsForPublic(): TrustClaims {
  return memoryTrustClaimsRepo.get();
}

export function readTrustClaimsClient(): TrustClaims {
  if (typeof window === "undefined") return { ...DEFAULT_TRUST_CLAIMS };
  try {
    const raw = window.localStorage.getItem(TRUST_CLAIMS_STORAGE_KEY);
    if (!raw) return { ...DEFAULT_TRUST_CLAIMS };
    const parsed = JSON.parse(raw) as Partial<TrustClaims>;
    return {
      claimFreeEstimates: Boolean(parsed.claimFreeEstimates),
      claimLocallyOwned: Boolean(parsed.claimLocallyOwned),
      updatedAt:
        typeof parsed.updatedAt === "string" ? parsed.updatedAt : null,
    };
  } catch {
    return { ...DEFAULT_TRUST_CLAIMS };
  }
}

export function writeTrustClaimsClient(
  patch: Pick<TrustClaims, "claimFreeEstimates" | "claimLocallyOwned">,
): TrustClaims {
  const next: TrustClaims = {
    claimFreeEstimates: patch.claimFreeEstimates,
    claimLocallyOwned: patch.claimLocallyOwned,
    updatedAt: new Date().toISOString(),
  };
  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(TRUST_CLAIMS_STORAGE_KEY, JSON.stringify(next));
    } catch {
      /* quota / private mode — UI still shows saved-in-session toast */
    }
  }
  return next;
}
