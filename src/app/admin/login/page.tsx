import { Suspense } from "react";
import { AdminLoginForm } from "@/components/admin/AdminLoginForm";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export default function AdminLoginPage() {
  const supabaseConfigured = isSupabaseConfigured();

  return (
    <Suspense fallback={<p className="p-8 text-sm text-[var(--text-muted)]">Loading…</p>}>
      <AdminLoginForm supabaseConfigured={supabaseConfigured} />
    </Suspense>
  );
}