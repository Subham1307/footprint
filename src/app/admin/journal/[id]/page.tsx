
import { notFound } from "next/navigation";
import { AdminShell } from "@/components/admin/AdminShell";
import { JournalEntryForm } from "@/components/admin/forms/JournalEntryForm";
import { EntityMediaSection } from "@/components/admin/EntityMediaSection";
import { getJournalMedia } from "@/lib/admin/media-helpers";
import { getSupabaseUrl, isSupabaseConfigured } from "@/lib/supabase/config";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { deleteJournalEntry } from "@/lib/admin/actions/journal";
import { adminDb } from "@/lib/admin/db";


export const instant = false;
type Props = { params: Promise<{ id: string }> };

export default async function AdminJournalEditPage({ params }: Props) {
  const { id } = await params;
  const supabase = await adminDb();
  const { data: entry } = await supabase
    .from("journal_entries")
    .select("*, journal_entry_tags(tag)")
    .eq("id", id)
    .maybeSingle();

  if (!entry) notFound();

  const images = await getJournalMedia(
    supabase,
    entry.id,
    isSupabaseConfigured() ? getSupabaseUrl() : undefined,
  );

  return (
    <AdminShell title="Edit journal entry">
      <JournalEntryForm
        initial={{
          id: entry.id,
          title: entry.title,
          slug: entry.slug,
          excerpt: entry.excerpt ?? "",
          body: entry.body_markdown,
          category: entry.category,
          status: entry.status,
          is_public: entry.is_public,
          event_date: entry.event_date,
          tags: entry.journal_entry_tags?.map((t: { tag: string }) => t.tag).join(", ") ?? "",
        }}
      />
      <div className="mt-8">
        <EntityMediaSection entityType="journal" entityId={entry.id} images={images} />
      </div>
      <form action={deleteJournalEntry} className="mt-8">
        <input type="hidden" name="id" value={entry.id} />
        <DeleteButton confirmMessage="Delete this journal entry permanently?" label="Delete entry" />
      </form>
    </AdminShell>
  );
}
