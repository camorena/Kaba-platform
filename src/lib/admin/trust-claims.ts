/**
 * Owner-asserted trust claims — Settings toggles shaped for a future DB row.
 *
 * Today: browser localStorage stub (same honesty pattern as the price book).
 * Public marketing still uses `site.ts` trustPoints until a durable store exists;
 * do not wire the public hero bar to localStorage (server cannot read it).
 *
 * API shape (stable for DB swap):
 *   TrustClaims { claimFreeEstimates, claimLocallyOwned, updatedAt }
 *   getTrustClaimsForPublic() — server-safe reader (defaults until DB)
 *   read/writeTrustClaimsClient() — Settings UI only
 */

export type TrustClaims = {
  /** Owner confirms estimates are genuinely free (no minimum / travel fee). */
  claimFreeEstimates: boolean;
  /** Owner confirms locally owned (not a branch/franchise). */
  claimLocallyOwned: boolean;
  /** ISO timestamp of last Settings save, or null if never saved. */
  updatedAt: string | null;
};

export const TRUST_CLAIMS_STORAGE_KEY = "kaba-admin-trust-claims-v1";

/** Defaults stay off — we will not assert a claim the owner has not confirmed. */
export const DEFAULT_TRUST_CLAIMS: TrustClaims = {
  claimFreeEstimates: false,
  claimLocallyOwned: false,
  updatedAt: null,
};

/**
 * Server / public reader.
 * Until Postgres (or equivalent) holds site_settings, returns defaults.
 * Marketing pages keep using `trustPoints` in site.ts; this is the swap point.
 */
export function getTrustClaimsForPublic(): TrustClaims {
  return { ...DEFAULT_TRUST_CLAIMS };
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
