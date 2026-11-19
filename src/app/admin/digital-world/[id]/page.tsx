
import { notFound } from "next/navigation";
import { AdminShell } from "@/components/admin/AdminShell";
import { DigitalWorldForm } from "@/components/admin/forms/OtherForms";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { deleteDigitalItem } from "@/lib/admin/actions/digital";
import { adminDb } from "@/lib/admin/db";


export const instant = false;
type Props = { params: Promise<{ id: string }> };

export default async function AdminDigitalEditPage({ params }: Props) {
  const { id } = await params;
  const supabase = await adminDb();
  const { data } = await supabase.from("digital_world_items").select("*").eq("id", id).maybeSingle();
  if (!data) notFound();
  return (
    <AdminShell title="Edit digital world item">
      <DigitalWorldForm initial={data} />
      <form action={deleteDigitalItem} className="mt-6">
        <input type="hidden" name="id" value={data.id} />
        <DeleteButton label="Delete item" />
      </form>
    </AdminShell>
  );
}
