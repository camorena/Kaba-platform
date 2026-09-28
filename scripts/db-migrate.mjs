#!/usr/bin/env node
/**
 * Apply SQL migrations in db/migrations/ (sorted by filename).
 * Requires DATABASE_URL. Does not open a pool in the Next.js app.
 *
 *   DATABASE_URL=postgres://kaba:kaba@127.0.0.1:5432/kaba_fence npm run db:migrate
 *
 * Vercel / Neon / Supabase: paste the host DATABASE_URL (often needs ?sslmode=require).
 * Memory adapter needs no migrate — default build stays URL-free.
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
      "Local:  DATABASE_URL=postgres://kaba:kaba@127.0.0.1:5432/kaba_fence npm run db:migrate\n" +
      "Cloud:  paste your provider URL (often ?sslmode=require). Do not invent a DB — supply your own.\n" +
      "Default app adapter is memory (no DATABASE_URL needed to build).",
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
      "Could not connect to Postgres. Check DATABASE_URL, network, and that the server is up.\n" +
        (err?.message || err),
    );
    process.exitCode = 1;
    return;
  }

  await client.query(`
    create table if not exists schema_migrations (
      id text primary key,
      applied_at timestamptz not null default now()
    )
  `);

  if (!fs.existsSync(migrationsDir)) {
    console.error(`Migrations directory missing: ${migrationsDir}`);
    process.exitCode = 1;
    return;
  }

  const files = fs
    .readdirSync(migrationsDir)
    .filter((f) => f.endsWith(".sql"))
    .sort();

  if (!files.length) {
    console.log("No migration files in db/migrations/");
    return;
  }

  let applied = 0;
  let skipped = 0;

  for (const file of files) {
    const { rows } = await client.query(
      `select 1 from schema_migrations where id = $1`,
      [file],
    );
    if (rows.length) {
      console.log(`skip  ${file} (already applied)`);
      skipped += 1;
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
      applied += 1;
    } catch (err) {
      await client.query("rollback");
      console.error(`FAIL  ${file}:`, err.message);
      process.exitCode = 1;
      break;
    }
  }

  if (process.exitCode) return;
  console.log(`done  applied=${applied} skipped=${skipped} total=${files.length}`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(() => client.end().catch(() => {}));
