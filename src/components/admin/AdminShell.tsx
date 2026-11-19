import { AdminSidebar } from "@/components/admin/AdminSidebar";
import Link from "next/link";

export function AdminShell({
  title,
  description,
  actions,
  children,
}: {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[var(--bg-deep)] text-[var(--text-primary)] lg:grid lg:grid-cols-[260px_1fr]">
      <AdminSidebar />
      <div className="flex min-h-screen flex-col">
        <header className="border-b border-[var(--border)] bg-[color-mix(in_srgb,var(--bg-elevated)_70%,transparent)] px-4 py-5 md:px-8">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-[var(--text-muted)]">Admin</p>
              <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
              {description ? (
                <p className="mt-1 max-w-2xl text-sm text-[var(--text-secondary)]">{description}</p>
              ) : null}
            </div>
            <div className="flex items-center gap-3">{actions}</div>
          </div>
        </header>
        <main className="flex-1 px-4 py-6 md:px-8 md:py-8">{children}</main>
        <footer className="border-t border-[var(--border)] px-4 py-3 text-xs text-[var(--text-muted)] md:px-8">
          <Link href="/" className="hover:text-[var(--text-secondary)]">
            ← View public site
          </Link>
        </footer>
      </div>
    </div>
  );
}