
import { AdminShell } from "@/components/admin/AdminShell";
import { PlaceForm } from "@/components/admin/forms/OtherForms";


export const instant = false;
export default function AdminPlaceNewPage() {
  return (
    <AdminShell title="New place">
      <PlaceForm initial={{ place_status: "visited", is_public: true }} />
    </AdminShell>
  );
}
