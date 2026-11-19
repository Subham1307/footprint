import Link from "next/link";
import { AdminShell } from "@/components/admin/AdminShell";
import { AdminResourceList } from "@/components/admin/AdminResourceList";
import { adminDb } from "@/lib/admin/db";

export const instant = false;

export default async function AdminGoalsPage() {
  const supabase = await adminDb();
  const { data } = await supabase.from("goals").select("id, title, status").order("updated_at", { ascending: false });
  return (
    <AdminShell title="Goals" actions={<Link href="/admin/goals/new" className="rounded-full bg-[var(--accent-violet)] px-4 py-2 text-sm text-white">New</Link>}>
      <AdminResourceList empty="No goals yet." rows={(data ?? []).map((r) => ({ id: r.id, title: r.title, href: `/admin/goals/${r.id}`, meta: r.status }))} />
    </AdminShell>
  );
}