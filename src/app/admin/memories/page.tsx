import Link from "next/link";
import { AdminShell } from "@/components/admin/AdminShell";
import { AdminResourceList } from "@/components/admin/AdminResourceList";
import { adminDb } from "@/lib/admin/db";

export const instant = false;

export default async function AdminMemoriesPage() {
  const supabase = await adminDb();
  const { data } = await supabase.from("memories").select("id, title, event_date, is_public").order("event_date", { ascending: false });
  return (
    <AdminShell
      title="Memories & timeline"
      actions={<Link href="/admin/memories/new" className="rounded-full bg-[var(--accent-violet)] px-4 py-2 text-sm text-white">New</Link>}
    >
      <AdminResourceList empty="No memories yet." rows={(data ?? []).map((r) => ({ id: r.id, title: r.title, href: `/admin/memories/${r.id}`, meta: `${r.event_date}${r.is_public ? "" : " · private"}` }))} />
    </AdminShell>
  );
}