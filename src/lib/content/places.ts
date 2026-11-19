import { places as staticPlaces } from "@/data/places";
import { cacheTag } from "next/cache";
import { FOOTPRINT_CONTENT_TAG } from "@/lib/content/cache-tags";
import { tryCreatePublicClient } from "@/lib/supabase/public";
import { storagePublicUrl } from "@/lib/supabase/media-url";
import type { ContentSource, PublicPlace } from "@/lib/content/types";

function mapStatic(): PublicPlace[] {
  return staticPlaces.map((p) => ({
    id: p.id,
    name: p.name,
    region: p.region,
    description: p.description,
    category: p.category,
    mood: p.mood,
    gradient: p.gradient,
  }));
}

export async function getPublicPlaces(): Promise<{
  places: PublicPlace[];
  source: ContentSource;
}> {
  "use cache";
  cacheTag(FOOTPRINT_CONTENT_TAG);

  const supabase = tryCreatePublicClient();
  if (!supabase) return { places: mapStatic(), source: "static" };

  const { data, error } = await supabase
    .from("places")
    .select("*, place_media(sort_order, media_assets(storage_path, bucket))")
    .eq("is_public", true)
    .order("name");

  if (error) return { places: [], source: "database" };
  if (!data?.length) return { places: [], source: "database" };

  return {
    source: "database",
    places: data.map((p) => ({
      id: p.id,
      name: p.name,
      region: [p.region, p.country].filter(Boolean).join(", "),
      description: p.description ?? "",
      category: p.place_status,
      mood: p.mood ?? "",
      gradient: p.gradient_class ?? "from-slate-800 to-slate-950",
      imageUrls:
        p.place_media
          ?.map(
            (m: { media_assets: { storage_path: string; bucket: string } | null }) => {
              if (!m.media_assets?.storage_path) return null;
              return storagePublicUrl(m.media_assets.storage_path, m.media_assets.bucket);
            },
          )
          .filter((url): url is string => Boolean(url)) ?? [],
    })),
  };
}