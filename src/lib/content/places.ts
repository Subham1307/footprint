import { places as staticPlaces } from "@/data/places";
import { cacheTag } from "next/cache";
import { FOOTPRINT_CONTENT_TAG } from "@/lib/content/cache-tags";
import { tryCreatePublicClient } from "@/lib/supabase/public";
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
    .select("*, place_media(sort_order, media_assets(public_url, storage_path))")
    .eq("is_public", true)
    .order("name");

  if (error || !data?.length) return { places: [], source: "database" };

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
        p.place_media?.map(
          (m: { media_assets: { public_url: string | null; storage_path: string } }) =>
            m.media_assets.public_url ??
            `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/footprint-media/${m.media_assets.storage_path}`,
        ) ?? [],
    })),
  };
}