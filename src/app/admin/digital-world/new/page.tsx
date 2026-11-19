
import { AdminShell } from "@/components/admin/AdminShell";
import { DigitalWorldForm } from "@/components/admin/forms/OtherForms";


export const instant = false;
export default function AdminDigitalNewPage() {
  return (
    <AdminShell title="New digital world item">
      <DigitalWorldForm initial={{ category: "software", is_public: true }} />
    </AdminShell>
  );
}
