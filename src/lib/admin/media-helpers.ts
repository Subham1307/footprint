import type { MediaItem } from "@/components/admin/EntityMediaSection";
import { storagePublicUrl } from "@/lib/supabase/media-url";
import type { SupabaseClient } from "@supabase/supabase-js";

type AssetRow = {
  media_id: string;
  media_assets: {
    id: string;
    filename: string | null;
    storage_path: string;
    bucket: string;
  } | null;
};

function mapAssets(rows: AssetRow[] | null, baseUrl?: string): MediaItem[] {
  return (rows ?? [])
    .filter((row) => row.media_assets)
    .map((row) => {
      const asset = row.media_assets!;
      const url = asset.storage_path ? storagePublicUrl(asset.storage_path, asset.bucket) : "";
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
    .select("media_id, media_assets(id, filename, storage_path, bucket)")
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
    .select("media_id, media_assets(id, filename, storage_path, bucket)")
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
    .select("media_id, media_assets(id, filename, storage_path, bucket)")
    .eq("memory_id", memoryId);
  return mapAssets(data as AssetRow[] | null, baseUrl);
}