
import { notFound } from "next/navigation";
import { AdminShell } from "@/components/admin/AdminShell";
import { MemoryForm } from "@/components/admin/forms/OtherForms";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { EntityMediaSection } from "@/components/admin/EntityMediaSection";
import { deleteMemory } from "@/lib/admin/actions/memories";
import { getMemoryMedia } from "@/lib/admin/media-helpers";
import { adminDb } from "@/lib/admin/db";
import { getSupabaseUrl, isSupabaseConfigured } from "@/lib/supabase/config";


export const instant = false;
type Props = { params: Promise<{ id: string }> };

export default async function AdminMemoryEditPage({ params }: Props) {
  const { id } = await params;
  const supabase = await adminDb();
  const { data } = await supabase.from("memories").select("*").eq("id", id).maybeSingle();
  if (!data) notFound();
  const images = await getMemoryMedia(
    supabase,
    data.id,
    isSupabaseConfigured() ? getSupabaseUrl() : undefined,
  );
  return (
    <AdminShell title="Edit memory">
      <MemoryForm initial={data} />
      <div className="mt-8">
        <EntityMediaSection entityType="memory" entityId={data.id} images={images} />
      </div>
      <form action={deleteMemory} className="mt-6">
        <input type="hidden" name="id" value={data.id} />
        <DeleteButton label="Delete memory" />
      </form>
    </AdminShell>
  );
}
