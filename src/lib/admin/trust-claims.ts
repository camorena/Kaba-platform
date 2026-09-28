/**
 * Owner-asserted trust claims — Settings toggles + client fallback.
 *
 * Prefer the server API (`/api/admin/trust-claims`) which writes through the
 * data adapter (memory or Postgres site_settings). localStorage remains a
 * fallback when the API is unreachable.
 *
 * Public marketing still uses `site.ts` trustPoints until badges call
 * getTrustClaimsForPublic() (server adapter). Do not wire the public hero
 * bar to localStorage.
 */

import { DEFAULT_TRUST_CLAIMS } from "@/lib/db/memory/trust-claims";
import type { TrustClaimsRecord } from "@/lib/db/types";

export type TrustClaims = TrustClaimsRecord;

export const TRUST_CLAIMS_STORAGE_KEY = "kaba-admin-trust-claims-v1";

export { DEFAULT_TRUST_CLAIMS };

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
