/**
 * Data adapter selection.
 *
 *   KABA_DATA_ADAPTER=memory   (default) — in-process stores, seeded demo data
 *   KABA_DATA_ADAPTER=postgres — Postgres repos via DATABASE_URL + db/migrations
 *
 * Builds and demos never require DATABASE_URL. Flip with env + migrate + seed
 * (see preview/REUSE_PORT_v3.md).
 */

import "server-only";

import { createMemoryRepos } from "@/lib/db/memory";
import type { DataRepos } from "@/lib/db/repos/types";

export type DataAdapterName = "memory" | "postgres";

export function getDataAdapterName(): DataAdapterName {
  const raw = (process.env.KABA_DATA_ADAPTER ?? "memory").trim().toLowerCase();
  if (raw === "postgres" || raw === "pg" || raw === "supabase") {
    return "postgres";
  }
  return "memory";
}

/** True when DATABASE_URL is non-empty (does not open a connection). */
export function isDatabaseUrlConfigured(): boolean {
  return Boolean(process.env.DATABASE_URL?.trim());
}

let cached: DataRepos | null = null;

export function getRepos(): DataRepos {
  if (cached) return cached;

  const name = getDataAdapterName();
  if (name === "postgres") {
    // Lazy require so memory-default builds do not touch the pg pool path
    // until postgres is explicitly selected.
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { createPostgresRepos } = require("@/lib/db/postgres") as typeof import("@/lib/db/postgres");
    cached = createPostgresRepos();
    return cached;
  }

  cached = createMemoryRepos();
  return cached;
}

/** Test helper — drop the singleton between cases. */
export function resetReposCache(): void {
  cached = null;
}
