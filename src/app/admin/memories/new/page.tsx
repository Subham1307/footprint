
import { AdminShell } from "@/components/admin/AdminShell";
import { MemoryForm } from "@/components/admin/forms/OtherForms";


export const instant = false;
export default function AdminMemoryNewPage() {
  return (
    <AdminShell title="New memory">
      <MemoryForm initial={{ event_date: "2026-11-19", category: "memory", is_public: true }} />
    </AdminShell>
  );
}
