/**
 * Data adapter selection.
 *
 *   KABA_DATA_ADAPTER=memory   (default) — in-process stores, seeded demo data
 *   KABA_DATA_ADAPTER=postgres — reserved; throws until Postgres repos land
 *
 * Builds and demos never require DATABASE_URL. Flip later by implementing
 * createPostgresRepos() and setting the env + applying db/migrations.
 */

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

let cached: DataRepos | null = null;

export function getRepos(): DataRepos {
  if (cached) return cached;

  const name = getDataAdapterName();
  if (name === "postgres") {
    throw new Error(
      "KABA_DATA_ADAPTER=postgres is not implemented yet. " +
        "Apply db/migrations/0001_ops_foundation.sql, implement Postgres repos " +
        "in src/lib/db/, then wire createPostgresRepos(). " +
        "Until then keep KABA_DATA_ADAPTER=memory (default).",
    );
  }

  cached = createMemoryRepos();
  return cached;
}

/** Test helper — drop the singleton between cases. */
export function resetReposCache(): void {
  cached = null;
}
