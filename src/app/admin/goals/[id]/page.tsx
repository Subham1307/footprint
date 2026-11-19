
import { notFound } from "next/navigation";
import { AdminShell } from "@/components/admin/AdminShell";
import { GoalForm } from "@/components/admin/forms/OtherForms";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { deleteGoal } from "@/lib/admin/actions/goals";
import { adminDb } from "@/lib/admin/db";


export const instant = false;
type Props = { params: Promise<{ id: string }> };

export default async function AdminGoalEditPage({ params }: Props) {
  const { id } = await params;
  const supabase = await adminDb();
  const { data } = await supabase.from("goals").select("*").eq("id", id).maybeSingle();
  if (!data) notFound();

  const { data: events } = await supabase
    .from("goal_status_events")
    .select("*")
    .eq("goal_id", id)
    .order("changed_at", { ascending: false });

  return (
    <AdminShell title="Edit goal">
      <GoalForm initial={data} />
      {events?.length ? (
        <div className="surface-card mt-8 p-5">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--text-muted)]">Status history</h3>
          <ul className="mt-3 space-y-2 text-sm">
            {events.map((e) => (
              <li key={e.id}>
                {e.from_status ?? "—"} → {e.to_status}
                {e.note ? ` · ${e.note}` : ""}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
      <form action={deleteGoal} className="mt-6">
        <input type="hidden" name="id" value={data.id} />
        <DeleteButton label="Delete goal" />
      </form>
    </AdminShell>
  );
}
