import { getSupabaseUrl } from "@/lib/supabase/config";

export function storagePublicUrl(storagePath: string, bucket = "footprint-media"): string {
  return `${getSupabaseUrl()}/storage/v1/object/public/${bucket}/${storagePath}`;
}