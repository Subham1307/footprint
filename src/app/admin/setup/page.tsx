import Link from "next/link";
import { AdminShell } from "@/components/admin/AdminShell";

export default function AdminSetupPage() {
  return (
    <AdminShell
      title="Configure Supabase"
      description="The admin portal needs a Supabase project before authentication and archive features can run."
    >
      <div className="surface-card max-w-2xl space-y-4 p-6 text-sm leading-relaxed text-[var(--text-secondary)]">
        <ol className="list-decimal space-y-3 pl-5">
          <li>Create a Supabase project and copy the project URL + anon key.</li>
          <li>
            Add them to <code className="rounded bg-[var(--bg-subtle)] px-1">.env.local</code> (see{" "}
            <code className="rounded bg-[var(--bg-subtle)] px-1">docs/SUPABASE_SETUP.md</code>).
          </li>
          <li>Run the SQL migration in <code>supabase/migrations/</code>.</li>
          <li>
            Sign up at <Link href="/admin/login">/admin/login</Link> and add your user to{" "}
            <code>admin_users</code>.
          </li>
        </ol>
        <p className="text-xs text-[var(--text-muted)]">
          The public website continues to use static sample data until Supabase is connected.
        </p>
      </div>
    </AdminShell>
  );
}