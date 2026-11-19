
import { AdminShell } from "@/components/admin/AdminShell";
import { JournalEntryForm } from "@/components/admin/forms/JournalEntryForm";


export const instant = false;
export default function AdminJournalNewPage() {
  const today = "2026-11-19";
  return (
    <AdminShell title="New journal entry" description="Event date = when it happened. Saving sets recorded_at automatically.">
      <JournalEntryForm
        initial={{
          event_date: today,
          status: "published",
          is_public: true,
          category: "thought",
        }}
      />
    </AdminShell>
  );
}
