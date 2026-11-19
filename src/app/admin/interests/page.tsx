import Link from "next/link";
import { AdminShell } from "@/components/admin/AdminShell";
import { AdminResourceList } from "@/components/admin/AdminResourceList";
import { adminDb } from "@/lib/admin/db";

export const instant = false;

export default async function AdminInterestsPage() {
  const supabase = await adminDb();
  const { data } = await supabase.from("interests").select("id, title, slug, is_public").order("sort_order");
  return (
    <AdminShell
      title="Interests"
      description="Manage interest cards and detail pages on the public site."
      actions={
        <Link href="/admin/interests/new" className="rounded-full bg-[var(--accent-violet)] px-4 py-2 text-sm text-white">
          New interest
        </Link>
      }
    >
      <AdminResourceList
        empty="No interests yet — create one or run the seed script."
        rows={(data ?? []).map((r) => ({
          id: r.id,
          title: r.title,
          href: `/admin/interests/${r.id}`,
          meta: `${r.slug}${r.is_public ? "" : " · private"}`,
        }))}
      />
    </AdminShell>
  );
}