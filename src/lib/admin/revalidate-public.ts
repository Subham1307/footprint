import { revalidatePath, updateTag } from "next/cache";
import { FOOTPRINT_CONTENT_TAG } from "@/lib/content/cache-tags";

/** Invalidate cached public content after admin writes (Server Actions only). */
export function revalidatePublicContent(...paths: string[]) {
  updateTag(FOOTPRINT_CONTENT_TAG);
  for (const path of paths) {
    revalidatePath(path);
  }
}