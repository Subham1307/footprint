import { journalEntries as staticEntries, getJournalEntry as staticGet } from "@/data/journal";
import { readingTime } from "@/lib/utils";
import { cacheTag } from "next/cache";
import { FOOTPRINT_CONTENT_TAG } from "@/lib/content/cache-tags";
import { tryCreatePublicClient } from "@/lib/supabase/public";
import type { ContentSource, PublicJournalEntry } from "@/lib/content/types";

function mapStatic(): PublicJournalEntry[] {
  return staticEntries.map((e) => ({
    id: e.slug,
    slug: e.slug,
    title: e.title,
    excerpt: e.excerpt,
    body: e.body,
    category: e.category,
    publishedAt: e.publishedAt,
    eventDate: e.publishedAt,
    tags: [],
    isPublic: true,
  }));
}

function rowToPublic(
  row: {
    id: string;
    slug: string;
    title: string;
    excerpt: string | null;
    body_markdown: string;
    category: PublicJournalEntry["category"];
    event_date: string;
    recorded_at: string;
    is_public: boolean;
    journal_entry_tags?: { tag: string }[];
  },
): PublicJournalEntry {
  const body = row.body_markdown;
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt ?? body.slice(0, 160),
    body,
    category: row.category,
    publishedAt: row.event_date,
    eventDate: row.event_date,
    recordedAt: row.recorded_at,
    tags: row.journal_entry_tags?.map((t) => t.tag) ?? [],
    isPublic: row.is_public,
  };
}

export async function getPublicJournalEntries(): Promise<{
  entries: PublicJournalEntry[];
  source: ContentSource;
}> {
  "use cache";
  cacheTag(FOOTPRINT_CONTENT_TAG);

  const supabase = tryCreatePublicClient();
  if (!supabase) {
    return { entries: mapStatic(), source: "static" };
  }

  const { data, error } = await supabase
    .from("journal_entries")
    .select("*, journal_entry_tags(tag)")
    .eq("is_public", true)
    .eq("status", "published")
    .order("event_date", { ascending: false });

  if (error) {
    return { entries: [], source: "database" };
  }
  if (!data?.length) {
    return { entries: [], source: "database" };
  }

  return { entries: data.map((row) => rowToPublic(row)), source: "database" };
}

export async function getPublicJournalBySlug(slug: string): Promise<{
  entry: PublicJournalEntry | null;
  source: ContentSource;
}> {
  "use cache";
  cacheTag(FOOTPRINT_CONTENT_TAG);

  const supabase = tryCreatePublicClient();
  if (!supabase) {
    const e = staticGet(slug);
    if (!e) return { entry: null, source: "static" };
    return {
      entry: {
        id: e.slug,
        slug: e.slug,
        title: e.title,
        excerpt: e.excerpt,
        body: e.body,
        category: e.category,
        publishedAt: e.publishedAt,
        eventDate: e.publishedAt,
        tags: [],
        isPublic: true,
      },
      source: "static",
    };
  }

  const { data, error } = await supabase
    .from("journal_entries")
    .select("*, journal_entry_tags(tag)")
    .eq("slug", slug)
    .eq("is_public", true)
    .eq("status", "published")
    .maybeSingle();

  if (error || !data) {
    const e = staticGet(slug);
    if (!e) return { entry: null, source: "static" };
    return {
      entry: {
        id: e.slug,
        slug: e.slug,
        title: e.title,
        excerpt: e.excerpt,
        body: e.body,
        category: e.category,
        publishedAt: e.publishedAt,
        eventDate: e.publishedAt,
        tags: [],
        isPublic: true,
      },
      source: "static",
    };
  }

  return { entry: rowToPublic(data), source: "database" };
}

export { readingTime };