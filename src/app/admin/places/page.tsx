import Link from "next/link";
import { AdminShell } from "@/components/admin/AdminShell";
import { AdminResourceList } from "@/components/admin/AdminResourceList";
import { adminDb } from "@/lib/admin/db";

export const instant = false;

export default async function AdminPlacesPage() {
  const supabase = await adminDb();
  const { data } = await supabase
    .from("places")
    .select("id, name, place_status, latitude, longitude")
    .order("name");
  return (
    <AdminShell title="Places" actions={<Link href="/admin/places/new" className="rounded-full bg-[var(--accent-violet)] px-4 py-2 text-sm text-white">New</Link>}>
      <AdminResourceList
        empty="No places yet."
        rows={(data ?? []).map((r) => ({
          id: r.id,
          title: r.name,
          href: `/admin/places/${r.id}`,
          meta:
            r.latitude != null && r.longitude != null
              ? `${r.place_status} · on globe`
              : `${r.place_status} · needs coords`,
        }))}
      />
    </AdminShell>
  );
}