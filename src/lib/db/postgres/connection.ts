/**
 * Postgres connection helper.
 *
 * Only used when KABA_DATA_ADAPTER=postgres. Builds with the memory default
 * never open a pool and never require DATABASE_URL.
 */

import "server-only";

import { Pool, type QueryResult, type QueryResultRow } from "pg";

let pool: Pool | null = null;

/**
 * Neon sometimes appends channel_binding=require, which breaks node-pg on
 * serverless. Strip it; keep sslmode and other params.
 */
export function normalizeDatabaseUrl(url: string): string {
  try {
    const u = new URL(url);
    u.searchParams.delete("channel_binding");
    return u.toString();
  } catch {
    return url.replace(/([?&])channel_binding=[^&]*&?/g, "$1").replace(/[?&]$/, "");
  }
}

export function getDatabaseUrl(): string | null {
  const url = process.env.DATABASE_URL?.trim();
  return url ? normalizeDatabaseUrl(url) : null;
}

export function isDatabaseUrlConfigured(): boolean {
  return Boolean(process.env.DATABASE_URL?.trim());
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
  const isNeon = /\.neon\.tech$/i.test(
    (() => {
      try {
        return new URL(connectionString).hostname;
      } catch {
        return "";
      }
    })(),
  );
  pool = new Pool({
    connectionString,
    // Small pool — admin scaffold, not high traffic. Keep low on serverless.
    max: 1,
    idleTimeoutMillis: 10_000,
    connectionTimeoutMillis: 15_000,
    // Neon requires TLS; node-pg honors sslmode=require in the URL, but
    // explicit ssl avoids flaky serverless handshakes.
    ...(isNeon ? { ssl: { rejectUnauthorized: true } } : {}),
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
