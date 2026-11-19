import Link from "next/link";
import { AdminShell } from "@/components/admin/AdminShell";
import { AdminResourceList } from "@/components/admin/AdminResourceList";
import { adminDb } from "@/lib/admin/db";

export const instant = false;

export default async function AdminCollectionsPage() {
  const supabase = await adminDb();
  const { data } = await supabase.from("collection_items").select("id, title, item_type").order("title");
  return (
    <AdminShell title="Digital collection" actions={<Link href="/admin/collections/new" className="rounded-full bg-[var(--accent-violet)] px-4 py-2 text-sm text-white">New</Link>}>
      <AdminResourceList empty="No items." rows={(data ?? []).map((r) => ({ id: r.id, title: r.title, href: `/admin/collections/${r.id}`, meta: r.item_type }))} />
    </AdminShell>
  );
}