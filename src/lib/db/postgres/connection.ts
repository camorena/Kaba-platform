/**
 * Postgres connection helper.
 *
 * Only used when KABA_DATA_ADAPTER=postgres. Builds with the memory default
 * never open a pool and never require DATABASE_URL.
 */

import "server-only";

import { Pool, type QueryResult, type QueryResultRow } from "pg";

let pool: Pool | null = null;

export function getDatabaseUrl(): string | null {
  const url = process.env.DATABASE_URL?.trim();
  return url ? url : null;
}

export function isDatabaseUrlConfigured(): boolean {
  return Boolean(getDatabaseUrl());
}

/**
 * Require DATABASE_URL when the postgres adapter is selected.
 * Throws a clear, actionable error — never a silent empty connection.
 */
export function requireDatabaseUrl(): string {
  const url = getDatabaseUrl();
  if (!url) {
    throw new Error(
      "KABA_DATA_ADAPTER=postgres requires DATABASE_URL. " +
        "Set DATABASE_URL to a Postgres connection string " +
        "(e.g. postgres://kaba:kaba@localhost:5432/kaba_fence), " +
        "apply db/migrations/0001_ops_foundation.sql, then seed with " +
        "npm run db:seed — or set KABA_DATA_ADAPTER=memory (default).",
    );
  }
  return url;
}

export function getPool(): Pool {
  if (pool) return pool;
  const connectionString = requireDatabaseUrl();
  pool = new Pool({
    connectionString,
    // Small pool — admin scaffold, not high traffic.
    max: 5,
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: 10_000,
  });
  pool.on("error", (err) => {
    console.error("[kaba-db] unexpected Postgres pool error:", err.message);
  });
  return pool;
}

export async function query<T extends QueryResultRow = QueryResultRow>(
  text: string,
  params?: unknown[],
): Promise<QueryResult<T>> {
  return getPool().query<T>(text, params);
}

/** Test / shutdown helper. */
export async function closePool(): Promise<void> {
  if (!pool) return;
  const p = pool;
  pool = null;
  await p.end();
}
