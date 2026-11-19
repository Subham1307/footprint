import { digitalWorld as staticItems } from "@/data/digital-world";
import { cacheTag } from "next/cache";
import { FOOTPRINT_CONTENT_TAG } from "@/lib/content/cache-tags";
import { tryCreatePublicClient } from "@/lib/supabase/public";
import type { ContentSource, PublicDigitalItem } from "@/lib/content/types";

function mapStatic(): PublicDigitalItem[] {
  return staticItems.map((d) => ({
    id: d.id,
    name: d.name,
    detail: d.detail,
    category: d.category,
  }));
}

export async function getPublicDigitalWorld(): Promise<{
  items: PublicDigitalItem[];
  source: ContentSource;
}> {
  "use cache";
  cacheTag(FOOTPRINT_CONTENT_TAG);

  const supabase = tryCreatePublicClient();
  if (!supabase) return { items: mapStatic(), source: "static" };

  const { data, error } = await supabase
    .from("digital_world_items")
    .select("*")
    .eq("is_public", true)
    .order("sort_order");

  if (error || !data?.length) return { items: [], source: "database" };

  return {
    source: "database",
    items: data.map((d) => ({
      id: d.id,
      name: d.name,
      detail: d.detail ?? "",
      category: d.category,
    })),
  };
}