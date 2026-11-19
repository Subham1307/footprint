import { PageShell } from "@/components/layout/PageShell";
import { JournalExplorer } from "@/components/journal/JournalExplorer";
import { FadeIn } from "@/components/animations/FadeIn";
import { getPublicJournalEntries } from "@/lib/content/journal";

export const metadata = { title: "Journal" };

export default async function JournalPage() {
  const { entries } = await getPublicJournalEntries();
  return (
    <PageShell
      eyebrow="Brain dump"
      title="Journal"
      description="Searchable reflections — populated from your archive when Supabase is connected."
    >
      <FadeIn>
        <JournalExplorer entries={entries} />
      </FadeIn>
    </PageShell>
  );
}