import { site as staticSite } from "@/data/site";
import { cacheTag } from "next/cache";
import { FOOTPRINT_CONTENT_TAG } from "@/lib/content/cache-tags";
import { tryCreatePublicClient } from "@/lib/supabase/public";
import type { ContentSource, PublicSiteMeta } from "@/lib/content/types";

function staticMeta(): PublicSiteMeta {
  return {
    name: staticSite.name,
    wordmark: staticSite.wordmark,
    owner: staticSite.owner,
    email: staticSite.email,
    tagline: staticSite.tagline,
    copyrightYear: staticSite.copyrightYear,
    social: { ...staticSite.social },
  };
}

export async function getSiteMeta(): Promise<{ data: PublicSiteMeta; source: ContentSource }> {
  "use cache";
  cacheTag(FOOTPRINT_CONTENT_TAG);

  const supabase = tryCreatePublicClient();
  if (!supabase) {
    return { data: staticMeta(), source: "static" };
  }

  const { data, error } = await supabase
    .from("site_profile")
    .select("*")
    .eq("is_public", true)
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error || !data) {
    return { data: staticMeta(), source: "static" };
  }

  return {
    source: "database",
    data: {
      name: data.site_name,
      wordmark: data.wordmark,
      owner: data.owner_name,
      email: data.email ?? staticSite.email,
      tagline: data.tagline ?? staticSite.tagline,
      aboutMarkdown: data.about_markdown ?? undefined,
      copyrightYear: data.copyright_year ?? staticSite.copyrightYear,
      social: { ...staticSite.social },
    },
  };
}