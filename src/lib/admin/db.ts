import { connection } from "next/server";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export async function adminDb() {
  await connection();
  if (!isSupabaseConfigured()) {
    redirect("/admin/setup");
  }
  return createClient();
}