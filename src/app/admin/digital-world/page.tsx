import Link from "next/link";
import { AdminShell } from "@/components/admin/AdminShell";
import { AdminResourceList } from "@/components/admin/AdminResourceList";
import { adminDb } from "@/lib/admin/db";

export const instant = false;

export default async function AdminDigitalWorldPage() {
  const supabase = await adminDb();
  const { data } = await supabase.from("digital_world_items").select("id, name, category").order("sort_order");
  return (
    <AdminShell title="Digital world" actions={<Link href="/admin/digital-world/new" className="rounded-full bg-[var(--accent-violet)] px-4 py-2 text-sm text-white">New</Link>}>
      <AdminResourceList empty="No items." rows={(data ?? []).map((r) => ({ id: r.id, title: r.name, href: `/admin/digital-world/${r.id}`, meta: r.category }))} />
    </AdminShell>
  );
}