import { collections as staticCollections } from "@/data/collections";
import { cacheTag } from "next/cache";
import { FOOTPRINT_CONTENT_TAG } from "@/lib/content/cache-tags";
import { tryCreatePublicClient } from "@/lib/supabase/public";
import type { ContentSource, PublicCollectionItem } from "@/lib/content/types";

function mapStatic(): PublicCollectionItem[] {
  return staticCollections.map((c) => ({
    id: c.id,
    title: c.title,
    description: c.description,
    url: c.url,
    type: c.type,
    tags: c.tags,
  }));
}

export async function getPublicCollections(): Promise<{
  items: PublicCollectionItem[];
  source: ContentSource;
}> {
  "use cache";
  cacheTag(FOOTPRINT_CONTENT_TAG);

  const supabase = tryCreatePublicClient();
  if (!supabase) return { items: mapStatic(), source: "static" };

  const { data, error } = await supabase
    .from("collection_items")
    .select("*, collection_item_tags(tag)")
    .eq("is_public", true)
    .order("recorded_at", { ascending: false });

  if (error || !data?.length) return { items: [], source: "database" };

  return {
    source: "database",
    items: data.map((row) => ({
      id: row.id,
      title: row.title,
      description: row.description ?? "",
      url: row.external_url ?? undefined,
      type: row.item_type,
      tags: row.collection_item_tags?.map((t: { tag: string }) => t.tag) ?? [],
      eventDate: row.event_date ?? undefined,
    })),
  };
}