import { interests as staticInterests, getInterestBySlug as staticBySlug } from "@/data/interests";
import { cacheTag } from "next/cache";
import { FOOTPRINT_CONTENT_TAG } from "@/lib/content/cache-tags";
import { tryCreatePublicClient } from "@/lib/supabase/public";
import type { ContentSource, PublicInterest } from "@/lib/content/types";

function mapStatic(): PublicInterest[] {
  return staticInterests.map((i) => ({
    slug: i.slug,
    title: i.title,
    tagline: i.tagline,
    description: i.description,
    icon: i.icon,
    gradient: i.gradient,
    accent: i.accent,
    highlights: i.highlights,
  }));
}

export async function getPublicInterests(): Promise<{
  interests: PublicInterest[];
  source: ContentSource;
}> {
  "use cache";
  cacheTag(FOOTPRINT_CONTENT_TAG);

  const supabase = tryCreatePublicClient();
  if (!supabase) return { interests: mapStatic(), source: "static" };

  const { data, error } = await supabase
    .from("interests")
    .select("*, interest_highlights(content, sort_order)")
    .eq("is_public", true)
    .order("sort_order");

  if (error || !data?.length) return { interests: [], source: "database" };

  return {
    source: "database",
    interests: data.map((row) => ({
      slug: row.slug,
      title: row.title,
      tagline: row.tagline ?? "",
      description: row.description ?? "",
      icon: row.icon,
      gradient: row.gradient_class ?? "from-violet-500/15 to-transparent",
      accent: row.accent_color ?? "#8b7cf8",
      highlights:
        row.interest_highlights
          ?.sort((a: { sort_order: number }, b: { sort_order: number }) => a.sort_order - b.sort_order)
          .map((h: { content: string }) => h.content) ?? [],
    })),
  };
}

export async function getPublicInterestBySlug(slug: string): Promise<{
  interest: PublicInterest | null;
  source: ContentSource;
}> {
  "use cache";
  cacheTag(FOOTPRINT_CONTENT_TAG);

  const supabase = tryCreatePublicClient();
  if (!supabase) {
    const i = staticBySlug(slug);
    if (!i) return { interest: null, source: "static" };
    return {
      interest: {
        slug: i.slug,
        title: i.title,
        tagline: i.tagline,
        description: i.description,
        icon: i.icon,
        gradient: i.gradient,
        accent: i.accent,
        highlights: i.highlights,
      },
      source: "static",
    };
  }

  const { data } = await supabase
    .from("interests")
    .select("*, interest_highlights(content, sort_order)")
    .eq("slug", slug)
    .eq("is_public", true)
    .maybeSingle();

  if (!data) {
    const i = staticBySlug(slug);
    if (!i) return { interest: null, source: "static" };
    return {
      interest: {
        slug: i.slug,
        title: i.title,
        tagline: i.tagline,
        description: i.description,
        icon: i.icon,
        gradient: i.gradient,
        accent: i.accent,
        highlights: i.highlights,
      },
      source: "static",
    };
  }

  return {
    source: "database",
    interest: {
      slug: data.slug,
      title: data.title,
      tagline: data.tagline ?? "",
      description: data.description ?? "",
      icon: data.icon,
      gradient: data.gradient_class ?? "from-violet-500/15 to-transparent",
      accent: data.accent_color ?? "#8b7cf8",
      highlights:
        data.interest_highlights
          ?.sort((a: { sort_order: number }, b: { sort_order: number }) => a.sort_order - b.sort_order)
          .map((h: { content: string }) => h.content) ?? [],
    },
  };
}