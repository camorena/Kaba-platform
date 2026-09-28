import "server-only";
import { requireDatabaseUrl } from "@/lib/db/postgres/connection";
import { createPostgresCustomersRepo } from "@/lib/db/postgres/customers";
import { createPostgresInvoicesRepo } from "@/lib/db/postgres/invoices";
import { createPostgresPaymentsRepo } from "@/lib/db/postgres/payments";
import { createPostgresQuotesRepo } from "@/lib/db/postgres/quotes";
import { createPostgresTrustClaimsRepo } from "@/lib/db/postgres/trust-claims";
import type { DataRepos } from "@/lib/db/repos/types";

/**
 * Build the Postgres DataRepos.
 * Validates DATABASE_URL immediately so missing config fails closed with a
 * clear message (rather than on the first query).
 * Does NOT open a TCP connection until a repo method runs — safe for import.
 */
export function createPostgresRepos(): DataRepos {
  requireDatabaseUrl();
  return {
    adapter: "postgres",
    quotes: createPostgresQuotesRepo(),
    invoices: createPostgresInvoicesRepo(),
    payments: createPostgresPaymentsRepo(),
    customers: createPostgresCustomersRepo(),
    trustClaims: createPostgresTrustClaimsRepo(),
  };
}

export {
  closePool,
  getDatabaseUrl,
  getPool,
  isDatabaseUrlConfigured,
  requireDatabaseUrl,
} from "@/lib/db/postgres/connection";
