#!/usr/bin/env node
/**
 * Apply SQL migrations in db/migrations/ (sorted by filename).
 * Requires DATABASE_URL. Does not open a pool in the Next.js app.
 *
 *   DATABASE_URL=postgres://kaba:kaba@127.0.0.1:5432/kaba_fence npm run db:migrate
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import pg from "pg";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const migrationsDir = path.join(root, "db", "migrations");

const url = process.env.DATABASE_URL?.trim();
if (!url) {
  console.error(
    "DATABASE_URL is required.\n" +
      "Example: DATABASE_URL=postgres://kaba:kaba@127.0.0.1:5432/kaba_fence npm run db:migrate",
  );
  process.exit(1);
}

const client = new pg.Client({ connectionString: url });

async function main() {
  await client.connect();
  await client.query(`
    create table if not exists schema_migrations (
      id text primary key,
      applied_at timestamptz not null default now()
    )
  `);

  const files = fs
    .readdirSync(migrationsDir)
    .filter((f) => f.endsWith(".sql"))
    .sort();

  if (!files.length) {
    console.log("No migration files in db/migrations/");
    return;
  }

  for (const file of files) {
    const { rows } = await client.query(
      `select 1 from schema_migrations where id = $1`,
      [file],
    );
    if (rows.length) {
      console.log(`skip  ${file} (already applied)`);
      continue;
    }
    const sql = fs.readFileSync(path.join(migrationsDir, file), "utf8");
    console.log(`apply ${file} …`);
    await client.query("begin");
    try {
      await client.query(sql);
      await client.query(
        `insert into schema_migrations (id) values ($1)`,
        [file],
      );
      await client.query("commit");
      console.log(`ok    ${file}`);
    } catch (err) {
      await client.query("rollback");
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
