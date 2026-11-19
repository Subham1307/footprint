
import { notFound } from "next/navigation";
import { AdminShell } from "@/components/admin/AdminShell";
import { PlaceForm } from "@/components/admin/forms/OtherForms";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { EntityMediaSection } from "@/components/admin/EntityMediaSection";
import { deletePlace } from "@/lib/admin/actions/places";
import { getPlaceMedia } from "@/lib/admin/media-helpers";
import { adminDb } from "@/lib/admin/db";
import { getSupabaseUrl, isSupabaseConfigured } from "@/lib/supabase/config";


export const instant = false;
type Props = { params: Promise<{ id: string }> };

export default async function AdminPlaceEditPage({ params }: Props) {
  const { id } = await params;
  const supabase = await adminDb();
  const { data } = await supabase.from("places").select("*").eq("id", id).maybeSingle();
  if (!data) notFound();
  const images = await getPlaceMedia(
    supabase,
    data.id,
    isSupabaseConfigured() ? getSupabaseUrl() : undefined,
  );
  return (
    <AdminShell title="Edit place">
      <PlaceForm initial={data} />
      <div className="mt-8">
        <EntityMediaSection entityType="place" entityId={data.id} images={images} />
      </div>
      <form action={deletePlace} className="mt-6">
        <input type="hidden" name="id" value={data.id} />
        <DeleteButton label="Delete place" />
      </form>
    </AdminShell>
  );
}
