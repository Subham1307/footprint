
import { AdminShell } from "@/components/admin/AdminShell";
import { InterestForm } from "@/components/admin/forms/InterestForm";


export const instant = false;
export default function AdminInterestNewPage() {
  return (
    <AdminShell title="New interest">
      <InterestForm initial={{ is_public: true, sort_order: 0 }} />
    </AdminShell>
  );
}
