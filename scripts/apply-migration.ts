/**
 * Applies supabase/migrations/*.sql using a direct Postgres connection.
 * Requires SUPABASE_DB_URL or DATABASE_URL in .env.local (Dashboard → Database → URI).
 *
 * Usage: npx tsx scripts/apply-migration.ts
 */
import { config } from "dotenv";
import { readFileSync } from "fs";
import { resolve } from "path";
import pg from "pg";

config({ path: resolve(process.cwd(), ".env.local") });

const connectionString =
  process.env.SUPABASE_DB_URL ?? process.env.DATABASE_URL;

if (!connectionString) {
  console.error(
    "Missing SUPABASE_DB_URL or DATABASE_URL in .env.local.\n" +
      "Supabase Dashboard → Project Settings → Database → Connection string (URI).\n" +
      "Use the password you set when creating the project (not the API secret key).",
  );
  process.exit(1);
}

const migrationPath = resolve(
  process.cwd(),
  "supabase/migrations/20260319000000_initial_footprint_schema.sql",
);
const sql = readFileSync(migrationPath, "utf8");

async function main() {
  const client = new pg.Client({
    connectionString,
    ssl: { rejectUnauthorized: false },
  });
  await client.connect();
  try {
    await client.query(sql);
    console.log("Migration applied:", migrationPath);
  } finally {
    await client.end();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});