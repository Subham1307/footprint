/**
 * Grants admin for every Auth user (service role). Run after /admin/login signup.
 * Usage: npx tsx scripts/grant-admin.ts
 */
import { config } from "dotenv";
import { resolve } from "path";

config({ path: resolve(process.cwd(), ".env.local") });

import WebSocket from "ws";
import { createClient } from "@supabase/supabase-js";

(globalThis as unknown as { WebSocket: typeof WebSocket }).WebSocket = WebSocket;

const url = (process.env.NEXT_PUBLIC_SUPABASE_URL ?? "")
  .replace(/\/rest\/v1\/?$/i, "")
  .replace(/\/$/, "");
const serviceKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_SECRET_KEY;

if (!url || !serviceKey) {
  console.error("Missing Supabase URL or service/secret key in .env.local");
  process.exit(1);
}

const supabase = createClient(url, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

async function main() {
  const { data: list, error: listErr } = await supabase.auth.admin.listUsers({
    perPage: 100,
  });
  if (listErr) {
    console.error("listUsers:", listErr.message);
    process.exit(1);
  }

  const users = list?.users ?? [];
  if (users.length === 0) {
    console.log("No auth users yet. Sign up at /admin/login, then run this again.");
    return;
  }

  for (const u of users) {
    const email = u.email ?? "unknown@local";
    const { error } = await supabase
      .from("admin_users")
      .upsert({ user_id: u.id, email }, { onConflict: "user_id" });
    if (error) {
      console.error("admin_users", email, error.message);
    } else {
      console.log("Admin granted:", email);
    }
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});