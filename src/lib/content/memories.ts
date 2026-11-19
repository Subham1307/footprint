import { timeline as staticTimeline } from "@/data/timeline";
import { cacheTag } from "next/cache";
import { FOOTPRINT_CONTENT_TAG } from "@/lib/content/cache-tags";
import { tryCreatePublicClient } from "@/lib/supabase/public";
import type { ContentSource, PublicMemory } from "@/lib/content/types";

function mapStatic(): PublicMemory[] {
  return staticTimeline.map((t) => ({
    id: t.id,
    year: t.year,
    title: t.title,
    description: t.description,
    type: t.type,
    eventDate: `${t.year}-06-01`,
  }));
}

export async function getPublicMemories(): Promise<{
  memories: PublicMemory[];
  source: ContentSource;
}> {
  "use cache";
  cacheTag(FOOTPRINT_CONTENT_TAG);

  const supabase = tryCreatePublicClient();
  if (!supabase) return { memories: mapStatic(), source: "static" };

  const { data, error } = await supabase
    .from("memories")
    .select("*")
    .eq("is_public", true)
    .order("event_date", { ascending: false });

  if (error || !data?.length) return { memories: [], source: "database" };

  return {
    source: "database",
    memories: data.map((m) => ({
      id: m.id,
      year: String(m.event_year ?? new Date(m.event_date).getFullYear()),
      title: m.title,
      description: m.description ?? "",
      type: m.category,
      eventDate: m.event_date,
      location: m.location ?? undefined,
    })),
  };
}