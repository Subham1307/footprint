import Link from "next/link";
import { AdminShell } from "@/components/admin/AdminShell";
import { AdminResourceList } from "@/components/admin/AdminResourceList";
import { adminDb } from "@/lib/admin/db";

export const instant = false;

export default async function AdminJournalListPage() {
  const supabase = await adminDb();
  const { data } = await supabase
    .from("journal_entries")
    .select("id, title, status, is_public, event_date, updated_at")
    .order("event_date", { ascending: false });

  return (
    <AdminShell
      title="Journal"
      description="Brain dump entries with event vs recorded dates, drafts, and visibility."
      actions={
        <Link
          href="/admin/journal/new"
          className="rounded-full bg-[var(--accent-violet)] px-4 py-2 text-sm text-white"
        >
          New entry
        </Link>
      }
    >
      <AdminResourceList
        empty="No entries yet."
        rows={(data ?? []).map((row) => ({
          id: row.id,
          title: row.title,
          href: `/admin/journal/${row.id}`,
          meta: `${row.event_date} · ${row.status}${row.is_public ? "" : " · private"}`,
        }))}
      />
    </AdminShell>
  );
}