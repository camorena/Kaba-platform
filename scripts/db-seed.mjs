#!/usr/bin/env node
/**
 * Apply SQL seeds in db/seeds/ (sorted by filename).
 * Requires DATABASE_URL. Migrations must already be applied.
 *
 *   DATABASE_URL=postgres://kaba:kaba@127.0.0.1:5432/kaba_fence npm run db:seed
 *
 * Includes demo owner profile (0002_owner_profile.sql):
 *   email:    owner@kabafence.example
 *   password: change-me-owner
 * Change before production (see Settings → Security).
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import pg from "pg";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const seedsDir = path.join(root, "db", "seeds");

const url = process.env.DATABASE_URL?.trim();
if (!url) {
  console.error(
    "DATABASE_URL is required.\n" +
      "Example: DATABASE_URL=postgres://kaba:kaba@127.0.0.1:5432/kaba_fence npm run db:seed\n" +
      "Run npm run db:migrate first.",
  );
  process.exit(1);
}

const client = new pg.Client({
  connectionString: url,
  connectionTimeoutMillis: 15_000,
});

async function main() {
  try {
    await client.connect();
  } catch (err) {
    console.error(
      "Could not connect to Postgres. Check DATABASE_URL and that migrate already succeeded.\n" +
        (err?.message || err),
    );
    process.exitCode = 1;
    return;
  }

  // Sanity: foundation tables exist
  const { rows: tables } = await client.query(`
    select count(*)::int as n from information_schema.tables
    where table_schema = 'public' and table_name = 'quotes'
  `);
  if (!tables[0]?.n) {
    console.error(
      "quotes table missing — run npm run db:migrate first " +
        "(db/migrations/0001_ops_foundation.sql).",
    );
    process.exitCode = 1;
    return;
  }

  const { rows: profileTable } = await client.query(`
    select count(*)::int as n from information_schema.tables
    where table_schema = 'public' and table_name = 'profiles'
  `);
  if (!profileTable[0]?.n) {
    console.error(
      "profiles table missing — apply migrations through 0002_profiles_credentials.sql before seeding.",
    );
    process.exitCode = 1;
    return;
  }

  if (!fs.existsSync(seedsDir)) {
    console.error(`Seeds directory missing: ${seedsDir}`);
    process.exitCode = 1;
    return;
  }

  const files = fs
    .readdirSync(seedsDir)
    .filter((f) => f.endsWith(".sql"))
    .sort();

  if (!files.length) {
    console.log("No seed files in db/seeds/");
    return;
  }

  for (const file of files) {
    const sql = fs.readFileSync(path.join(seedsDir, file), "utf8");
    console.log(`seed  ${file} …`);
    try {
      const result = await client.query(sql);
      // Last statement may be a SELECT summary — print rows if present
      const last = Array.isArray(result) ? result[result.length - 1] : result;
      if (last?.rows?.length) {
        console.log("counts:");
        for (const row of last.rows) {
          const label = String(row.entity ?? Object.values(row)[0] ?? "?");
          const n = row.n ?? Object.values(row)[1] ?? "";
          console.log(`  ${label.padEnd(14)} ${n}`);
        }
      }
      console.log(`ok    ${file}`);
    } catch (err) {
      console.error(`FAIL  ${file}:`, err.message);
      process.exitCode = 1;
      break;
    }
  }

  if (!process.exitCode) {
    console.log(
      "done  demo owner: owner@kabafence.example / change-me-owner (rotate before production)",
    );
  }
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(() => client.end().catch(() => {}));
