/**
 * In-memory staff profiles — demo owner for credentials mode without Postgres.
 * Password: change-me-owner (same as db/seeds/0002_owner_profile.sql).
 */

import type { ProfilesRepo } from "@/lib/db/repos/types";
import type { ProfileRecord } from "@/lib/db/types";

/** Fixed scrypt hash for "change-me-owner" — matches seed 0002. */
export const DEMO_OWNER_PASSWORD_HASH =
  "scrypt$n=16384$r=8$p=1$XdfdfwyViUvItHBd-XT0QA$qhM_xvZWCjGqFl3AOZbV63_o7Kw3RP83qUNtk8C8--Q";

export const DEMO_OWNER_EMAIL = "owner@kabafence.example";

const DEMO_OWNER: ProfileRecord = {
  id: "c3000001-0001-4000-8000-000000000001",
  email: DEMO_OWNER_EMAIL,
  fullName: "Ops Lead",
  role: "owner",
  isActive: true,
  passwordHash: DEMO_OWNER_PASSWORD_HASH,
  createdAt: new Date("2026-01-01T00:00:00.000Z").toISOString(),
  updatedAt: new Date("2026-01-01T00:00:00.000Z").toISOString(),
};

declare global {
  // eslint-disable-next-line no-var
  var __kabaProfiles: ProfileRecord[] | undefined;
}

function store(): ProfileRecord[] {
  if (!globalThis.__kabaProfiles) {
    globalThis.__kabaProfiles = [{ ...DEMO_OWNER }];
  }
  return globalThis.__kabaProfiles;
}

export const memoryProfilesRepo: ProfilesRepo = {
  async getById(id) {
    return store().find((p) => p.id === id);
  },

  async getByEmail(email) {
    const needle = email.trim().toLowerCase();
    return store().find((p) => p.email.toLowerCase() === needle);
  },

  async list() {
    return store().map((p) => ({ ...p }));
  },
};
