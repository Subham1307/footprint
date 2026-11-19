import { PageShell } from "@/components/layout/PageShell";
import { CollectionExplorer } from "@/components/collections/CollectionExplorer";
import { FadeIn } from "@/components/animations/FadeIn";
import { getPublicCollections } from "@/lib/content/collections";

export const metadata = { title: "Collections" };

export default async function CollectionsPage() {
  const { items } = await getPublicCollections();
  return (
    <PageShell
      eyebrow="Shelf"
      title="Digital collection"
      description="Websites, tools, media, and odd discoveries — curated in your archive."
    >
      <FadeIn>
        <CollectionExplorer items={items} />
      </FadeIn>
    </PageShell>
  );
}