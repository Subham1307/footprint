function normalizeProjectUrl(url: string): string {
  return url
    .trim()
    .replace(/\/rest\/v1\/?$/i, "")
    .replace(/\/$/, "");
}

/** Static env reads so Next.js inlines NEXT_PUBLIC_* in client bundles (dynamic process.env[key] does not). */
function publicSupabaseUrl(): string | undefined {
  return process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
}

function publicSupabaseAnonKey(): string | undefined {
  return (
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim()
  );
}

export function isSupabaseConfigured(): boolean {
  const url = publicSupabaseUrl();
  const key = publicSupabaseAnonKey();
  return Boolean(url && key && url.startsWith("http"));
}

export function getSupabaseUrl(): string {
  const url = publicSupabaseUrl();
  if (!url) throw new Error("NEXT_PUBLIC_SUPABASE_URL is not set");
  return normalizeProjectUrl(url);
}

export function getSupabaseAnonKey(): string {
  const key = publicSupabaseAnonKey();
  if (!key) {
    throw new Error(
      "Set NEXT_PUBLIC_SUPABASE_ANON_KEY (or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY)",
    );
  }
  return key;
}

export function getSupabaseServiceRoleKey(): string | undefined {
  return (
    process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() ||
    process.env.SUPABASE_SECRET_KEY?.trim()
  );
}