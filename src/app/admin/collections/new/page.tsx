
import { AdminShell } from "@/components/admin/AdminShell";
import { CollectionForm } from "@/components/admin/forms/OtherForms";


export const instant = false;
export default function AdminCollectionNewPage() {
  return (
    <AdminShell title="New collection item">
      <CollectionForm initial={{ item_type: "discovery", is_public: true }} />
    </AdminShell>
  );
}
