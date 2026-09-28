/**
 * Postgres ProfilesRepo — staff accounts for credentials mode.
 */

import { query } from "@/lib/db/postgres/connection";
import {
  mapProfile,
  type ProfileRow,
} from "@/lib/db/postgres/mappers";
import type { ProfilesRepo } from "@/lib/db/repos/types";

export function createPostgresProfilesRepo(): ProfilesRepo {
  return {
    async getById(id) {
      const { rows } = await query<ProfileRow>(
        `select id, email, full_name, role, is_active, password_hash, created_at, updated_at
         from profiles where id = $1`,
        [id],
      );
      return rows[0] ? mapProfile(rows[0]) : undefined;
    },

    async getByEmail(email) {
      const { rows } = await query<ProfileRow>(
        `select id, email, full_name, role, is_active, password_hash, created_at, updated_at
         from profiles where lower(email) = lower($1)`,
        [email.trim()],
      );
      return rows[0] ? mapProfile(rows[0]) : undefined;
    },

    async list() {
      const { rows } = await query<ProfileRow>(
        `select id, email, full_name, role, is_active, password_hash, created_at, updated_at
         from profiles order by created_at asc`,
      );
      return rows.map(mapProfile);
    },
  };
}
