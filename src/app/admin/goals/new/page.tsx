
import { AdminShell } from "@/components/admin/AdminShell";
import { GoalForm } from "@/components/admin/forms/OtherForms";


export const instant = false;
export default function AdminGoalNewPage() {
  return (
    <AdminShell title="New goal">
      <GoalForm initial={{ status: "active", goal_type: "personal" }} />
    </AdminShell>
  );
}
