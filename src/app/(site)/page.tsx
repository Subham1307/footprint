import { HeroSection } from "@/components/home/HeroSection";
import { CurrentlySection } from "@/components/home/CurrentlySection";
import { InterestsGrid } from "@/components/home/InterestsGrid";
import { JournalPreview } from "@/components/home/JournalPreview";
import { PlacesPreview } from "@/components/home/PlacesPreview";
import { CollectionsPreview } from "@/components/home/CollectionsPreview";
import { DigitalWorldSection } from "@/components/home/DigitalWorldSection";
import { TimelineSection } from "@/components/home/TimelineSection";
import { EmptyState } from "@/components/ui/EmptyState";
import { getSiteMeta } from "@/lib/content/site";
import { getCurrentLifeItems } from "@/lib/content/now";
import { getPublicInterests } from "@/lib/content/interests";
import { getPublicJournalEntries } from "@/lib/content/journal";
import { getPublicPlaces } from "@/lib/content/places";
import { getPublicCollections } from "@/lib/content/collections";
import { getPublicDigitalWorld } from "@/lib/content/digital-world";
import { getPublicMemories } from "@/lib/content/memories";

export default async function HomePage() {
  const [site, now, interests, journal, places, collections, digital, memories] =
    await Promise.all([
      getSiteMeta(),
      getCurrentLifeItems(),
      getPublicInterests(),
      getPublicJournalEntries(),
      getPublicPlaces(),
      getPublicCollections(),
      getPublicDigitalWorld(),
      getPublicMemories(),
    ]);

  const sections = [
    { id: "currently", label: "Currently", show: now.items.length > 0 },
    { id: "interests", label: "Interests", show: interests.interests.length > 0 },
    { id: "journal", label: "Journal", show: journal.entries.length > 0 },
    { id: "places", label: "Places", show: places.places.length > 0 },
    { id: "collections", label: "Collection", show: collections.items.length > 0 },
    { id: "digital-world", label: "Digital world", show: digital.items.length > 0 },
    { id: "timeline", label: "Timeline", show: memories.memories.length > 0 },
  ];
  const visible = new Set(sections.filter((s) => s.show).map((s) => s.id));

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 pb-8 md:px-6">
      <HeroSection
        owner={site.data.owner}
        tagline={site.data.tagline}
        timezone={now.availability.timezone}
        availabilityLabel={now.availability.label}
        sections={sections.filter((s) => s.show)}
      />
      {visible.size === 0 ? (
        <EmptyState
          title="Moving in — boxes still being unpacked"
          description="Journal notes, places, favourite finds and the odd milestone are on their way. Check back soon."
        />
      ) : null}
      {visible.has("currently") ? <CurrentlySection items={now.items} /> : null}
      {visible.has("interests") ? <InterestsGrid interests={interests.interests} /> : null}
      {visible.has("journal") ? <JournalPreview entries={journal.entries} /> : null}
      {visible.has("places") ? <PlacesPreview places={places.places} /> : null}
      {visible.has("collections") ? <CollectionsPreview items={collections.items} /> : null}
      {visible.has("digital-world") ? <DigitalWorldSection items={digital.items} /> : null}
      {visible.has("timeline") ? <TimelineSection memories={memories.memories} /> : null}
    </main>
  );
}