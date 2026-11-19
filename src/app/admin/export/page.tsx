import { AdminShell } from "@/components/admin/AdminShell";
import Link from "next/link";

export const instant = false;

export default function AdminExportPage() {
  return (
    <AdminShell
      title="Export data"
      description="Download a JSON bundle of your archive tables. CSV per-table exports coming next — JSON is complete today."
    >
      <div className="surface-card max-w-xl space-y-4 p-6">
        <p className="text-sm text-[var(--text-secondary)]">
          Exports run server-side with your authenticated admin session. Files include private entries.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/api/admin/export?format=json"
            className="rounded-full bg-[var(--accent-violet)] px-5 py-2.5 text-sm text-white"
          >
            Download JSON
          </Link>
          <Link
            href="/api/admin/export?format=csv&table=journal_entries"
            className="rounded-full border border-[var(--border)] px-5 py-2.5 text-sm"
          >
            Journal CSV
          </Link>
        </div>
        <p className="text-xs text-[var(--text-muted)]">
          Tip: schedule Supabase backups in addition to these exports. See docs/SUPABASE_SETUP.md.
        </p>
      </div>
    </AdminShell>
  );
}