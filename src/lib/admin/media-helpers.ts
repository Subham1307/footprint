import type { MediaItem } from "@/components/admin/EntityMediaSection";
import type { SupabaseClient } from "@supabase/supabase-js";

type AssetRow = {
  media_id: string;
  media_assets: { id: string; public_url: string | null; filename: string | null; storage_path: string } | null;
};

function mapAssets(rows: AssetRow[] | null, baseUrl?: string): MediaItem[] {
  return (rows ?? [])
    .filter((row) => row.media_assets)
    .map((row) => {
      const asset = row.media_assets!;
      const url =
        asset.public_url ??
        (baseUrl ? `${baseUrl}/storage/v1/object/public/footprint-media/${asset.storage_path}` : "");
      return {
        mediaId: asset.id,
        url,
        filename: asset.filename ?? undefined,
      };
    });
}

export async function getJournalMedia(
  supabase: SupabaseClient,
  journalId: string,
  baseUrl?: string,
): Promise<MediaItem[]> {
  const { data } = await supabase
    .from("journal_entry_media")
    .select("media_id, media_assets(id, public_url, filename, storage_path)")
    .eq("journal_entry_id", journalId);
  return mapAssets(data as AssetRow[] | null, baseUrl);
}

export async function getPlaceMedia(
  supabase: SupabaseClient,
  placeId: string,
  baseUrl?: string,
): Promise<MediaItem[]> {
  const { data } = await supabase
    .from("place_media")
    .select("media_id, media_assets(id, public_url, filename, storage_path)")
    .eq("place_id", placeId);
  return mapAssets(data as AssetRow[] | null, baseUrl);
}

export async function getMemoryMedia(
  supabase: SupabaseClient,
  memoryId: string,
  baseUrl?: string,
): Promise<MediaItem[]> {
  const { data } = await supabase
    .from("memory_media")
    .select("media_id, media_assets(id, public_url, filename, storage_path)")
    .eq("memory_id", memoryId);
  return mapAssets(data as AssetRow[] | null, baseUrl);
}