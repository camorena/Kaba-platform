#!/usr/bin/env node
/**
 * Apply SQL seeds in db/seeds/ (sorted by filename).
 * Requires DATABASE_URL. Migrations must already be applied.
 *
 *   DATABASE_URL=postgres://kaba:kaba@127.0.0.1:5432/kaba_fence npm run db:seed
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
      "Example: DATABASE_URL=postgres://kaba:kaba@127.0.0.1:5432/kaba_fence npm run db:seed",
  );
  process.exit(1);
}

const client = new pg.Client({ connectionString: url });

async function main() {
  await client.connect();

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
          console.log(`  ${row.entity.padEnd(14)} ${row.n}`);
        }
      }
      console.log(`ok    ${file}`);
    } catch (err) {
      console.error(`FAIL  ${file}:`, err.message);
      process.exitCode = 1;
      break;
    }
  }
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(() => client.end());
