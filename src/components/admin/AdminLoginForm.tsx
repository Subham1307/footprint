"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";

type AdminLoginFormProps = {
  supabaseConfigured: boolean;
};

export function AdminLoginForm({ supabaseConfigured }: AdminLoginFormProps) {
  const router = useRouter();
  const params = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(
    params.get("error") === "not_admin"
      ? "Signed in, but this account is not in admin_users."
      : null,
  );
  const [loading, setLoading] = useState(false);

  if (!supabaseConfigured) {
    return (
      <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-4 py-16">
        <h1 className="text-2xl font-semibold">Admin login</h1>
        <p className="mt-3 text-sm text-[var(--text-secondary)]">
          Supabase is not configured.{" "}
          <Link href="/admin/setup" className="text-[var(--accent-violet)] hover:underline">
            View setup steps
          </Link>
        </p>
      </main>
    );
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const supabase = createBrowserSupabaseClient();
      const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
      if (signInError) throw signInError;
      router.push(params.get("next") || "/admin");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Authentication failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-4 py-16">
      <p className="text-xs uppercase tracking-[0.2em] text-[var(--text-muted)]">Private</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">Admin login</h1>
      <p className="mt-2 text-sm text-[var(--text-secondary)]">
        This area is for the site owner only.
      </p>

      <form onSubmit={onSubmit} className="mt-8 space-y-4">
        <label className="block space-y-1 text-sm">
          Email
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] px-3 py-2.5"
          />
        </label>
        <label className="block space-y-1 text-sm">
          Password
          <input
            type="password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] px-3 py-2.5"
          />
        </label>
        {error ? <p className="text-sm text-rose-400">{error}</p> : null}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-[var(--accent-violet)] py-3 text-sm font-medium text-white disabled:opacity-60"
        >
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>

      <Link href="/" className="mt-8 text-sm text-[var(--text-muted)] hover:underline">
        ← Back to public site
      </Link>
    </main>
  );
}