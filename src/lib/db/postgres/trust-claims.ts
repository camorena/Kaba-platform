/**
 * Postgres TrustClaimsRepo — site_settings singleton row.
 */

import { DEFAULT_TRUST_CLAIMS } from "@/lib/db/memory/trust-claims";
import { query } from "@/lib/db/postgres/connection";
import {
  mapTrustClaims,
  type SiteSettingsRow,
} from "@/lib/db/postgres/mappers";
import type { TrustClaimsRepo } from "@/lib/db/repos/types";

export function createPostgresTrustClaimsRepo(): TrustClaimsRepo {
  return {
    async get() {
      const { rows } = await query<SiteSettingsRow>(
        `select claim_free_estimates, claim_locally_owned, updated_at
         from site_settings where id = true`,
      );
      if (!rows[0]) return { ...DEFAULT_TRUST_CLAIMS };
      return mapTrustClaims(rows[0]);
    },

    async save(patch) {
      const { rows } = await query<SiteSettingsRow>(
        `insert into site_settings (id, claim_free_estimates, claim_locally_owned, updated_at)
         values (true, $1, $2, now())
         on conflict (id) do update set
           claim_free_estimates = excluded.claim_free_estimates,
           claim_locally_owned = excluded.claim_locally_owned,
           updated_at = now()
         returning claim_free_estimates, claim_locally_owned, updated_at`,
        [patch.claimFreeEstimates, patch.claimLocallyOwned],
      );
      return mapTrustClaims(rows[0]);
    },
  };
}
