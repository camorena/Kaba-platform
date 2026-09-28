/**
 * Server-side trust claims memory store.
 * Written by PUT /api/admin/trust-claims; read by getTrustClaimsForPublic().
 */

import type { TrustClaimsRepo } from "@/lib/db/repos/types";
import type { TrustClaimsRecord } from "@/lib/db/types";

export const DEFAULT_TRUST_CLAIMS: TrustClaimsRecord = {
  claimFreeEstimates: false,
  claimLocallyOwned: false,
  updatedAt: null,
};

declare global {
  // eslint-disable-next-line no-var
  var __kabaTrustClaims: TrustClaimsRecord | undefined;
}

function store(): TrustClaimsRecord {
  if (!globalThis.__kabaTrustClaims) {
    globalThis.__kabaTrustClaims = { ...DEFAULT_TRUST_CLAIMS };
  }
  return globalThis.__kabaTrustClaims;
}

export const memoryTrustClaimsRepo: TrustClaimsRepo = {
  async get() {
    return { ...store() };
  },

  async save(patch) {
    const next: TrustClaimsRecord = {
      claimFreeEstimates: patch.claimFreeEstimates,
      claimLocallyOwned: patch.claimLocallyOwned,
      updatedAt: new Date().toISOString(),
    };
    globalThis.__kabaTrustClaims = next;
    return { ...next };
  },
};
