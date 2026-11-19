
import { notFound } from "next/navigation";
import { AdminShell } from "@/components/admin/AdminShell";
import { CollectionForm } from "@/components/admin/forms/OtherForms";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { deleteCollectionItem } from "@/lib/admin/actions/collections";
import { adminDb } from "@/lib/admin/db";


export const instant = false;
type Props = { params: Promise<{ id: string }> };

export default async function AdminCollectionEditPage({ params }: Props) {
  const { id } = await params;
  const supabase = await adminDb();
  const { data } = await supabase
    .from("collection_items")
    .select("*, collection_item_tags(tag)")
    .eq("id", id)
    .maybeSingle();
  if (!data) notFound();
  return (
    <AdminShell title="Edit collection item">
      <CollectionForm
        initial={{
          ...data,
          tags: data.collection_item_tags?.map((t: { tag: string }) => t.tag).join(", "),
        }}
      />
      <form action={deleteCollectionItem} className="mt-6">
        <input type="hidden" name="id" value={data.id} />
        <DeleteButton label="Delete item" />
      </form>
    </AdminShell>
  );
}
