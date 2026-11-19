import Link from "next/link";
import { AdminShell } from "@/components/admin/AdminShell";
import { getDashboardStats } from "@/lib/admin/dashboard";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { redirect } from "next/navigation";


export const instant = false;
export default async function AdminDashboardPage() {
  if (!isSupabaseConfigured()) redirect("/admin/setup");

  const stats = await getDashboardStats();

  return (
    <AdminShell
      title="Dashboard"
      description="Overview of your archive — counts, quick actions, and recent changes."
      actions={
        <>
          <Link
            href="/admin/journal/new"
            className="rounded-full border border-[var(--border)] bg-[var(--bg-elevated)] px-4 py-2 text-sm hover:border-[var(--border-strong)]"
          >
            + Journal
          </Link>
          <Link
            href="/admin/memories/new"
            className="rounded-full border border-[var(--border)] bg-[var(--bg-elevated)] px-4 py-2 text-sm"
          >
            + Memory
          </Link>
        </>
      }
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard label="Journal" value={stats.journal} href="/admin/journal" />
        <StatCard label="Memories" value={stats.memories} href="/admin/memories" />
        <StatCard label="Places" value={stats.places} href="/admin/places" />
        <StatCard label="Collection" value={stats.collections} href="/admin/collections" />
        <StatCard label="Goals" value={stats.goals} href="/admin/goals" />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <section className="surface-card p-5">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--text-muted)]">
            Recent activity
          </h2>
          <ul className="mt-4 space-y-3">
            {stats.recent.length ? (
              stats.recent.map((item) => (
                <li key={`${item.type}-${item.title}-${item.at}`}>
                  <Link href={item.href} className="flex items-start justify-between gap-3 text-sm hover:underline">
                    <span>
                      <span className="text-[var(--text-muted)]">{item.type} ·</span> {item.title}
                    </span>
                    <time className="shrink-0 text-xs text-[var(--text-muted)]">
                      {new Date(item.at).toLocaleDateString()}
                    </time>
                  </Link>
                </li>
              ))
            ) : (
              <li className="text-sm text-[var(--text-muted)]">No activity yet — add your first entry.</li>
            )}
          </ul>
        </section>

        <section className="surface-card p-5">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--text-muted)]">
            Journal by category
          </h2>
          <ul className="mt-4 space-y-2">
            {stats.journalByCategory.map((row) => (
              <li key={row.category} className="flex items-center justify-between text-sm capitalize">
                <span>{row.category}</span>
                <span className="rounded-full bg-[var(--bg-subtle)] px-2 py-0.5 text-xs">{row.count}</span>
              </li>
            ))}
            {!stats.journalByCategory.length ? (
              <li className="text-sm text-[var(--text-muted)]">No journal entries yet.</li>
            ) : null}
          </ul>
        </section>
      </div>
    </AdminShell>
  );
}

function StatCard({ label, value, href }: { label: string; value: number; href: string }) {
  return (
    <Link href={href} className="surface-card block p-5 transition hover:border-[var(--border-strong)]">
      <p className="text-xs uppercase tracking-wider text-[var(--text-muted)]">{label}</p>
      <p className="mt-2 text-3xl font-semibold">{value}</p>
    </Link>
  );
}
