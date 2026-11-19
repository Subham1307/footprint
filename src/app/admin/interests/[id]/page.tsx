
import { notFound } from "next/navigation";
import { AdminShell } from "@/components/admin/AdminShell";
import { InterestForm } from "@/components/admin/forms/InterestForm";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { deleteInterest } from "@/lib/admin/actions/interests";
import { adminDb } from "@/lib/admin/db";


export const instant = false;
type Props = { params: Promise<{ id: string }> };

export default async function AdminInterestEditPage({ params }: Props) {
  const { id } = await params;
  const supabase = await adminDb();
  const { data } = await supabase
    .from("interests")
    .select("*, interest_highlights(content, sort_order)")
    .eq("id", id)
    .maybeSingle();
  if (!data) notFound();

  const highlights = (data.interest_highlights ?? [])
    .sort((a: { sort_order: number }, b: { sort_order: number }) => a.sort_order - b.sort_order)
    .map((h: { content: string }) => h.content);

  return (
    <AdminShell title="Edit interest">
      <InterestForm initial={{ ...data, highlightsText: highlights.join("\n") }} />
      <form action={deleteInterest} className="mt-6">
        <input type="hidden" name="id" value={data.id} />
        <DeleteButton label="Delete interest" />
      </form>
    </AdminShell>
  );
}
