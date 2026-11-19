import { site } from "@/data/site";
import { cacheTag } from "next/cache";
import { FOOTPRINT_CONTENT_TAG } from "@/lib/content/cache-tags";
import { tryCreateClient } from "@/lib/supabase/server";
import { tryCreatePublicClient } from "@/lib/supabase/public";
import type { YearArchiveBundle } from "@/lib/content/types";
import { getPublicJournalEntries } from "@/lib/content/journal";
import { getPublicMemories } from "@/lib/content/memories";
import { getPublicPlaces } from "@/lib/content/places";
import { getPublicCollections } from "@/lib/content/collections";
import { getLifePeriodsForYear } from "@/lib/content/now";

function inYear(dateStr: string | undefined, year: number): boolean {
  if (!dateStr) return false;
  return new Date(dateStr).getFullYear() === year;
}

export async function getYearArchive(
  year: number,
  options?: { includePrivate?: boolean },
): Promise<YearArchiveBundle> {
  if (options?.includePrivate) {
    return getYearArchiveIncludingPrivate(year);
  }
  return getPublicYearArchive(year);
}

async function getPublicYearArchive(year: number): Promise<YearArchiveBundle> {
  "use cache";
  cacheTag(FOOTPRINT_CONTENT_TAG);

  const [journals, memories, , collections] = await Promise.all([
    getPublicJournalEntries(),
    getPublicMemories(),
    getPublicPlaces(),
    getPublicCollections(),
  ]);

  const lifePeriodsRaw = await getLifePeriodsForYear(year);
  return {
    year,
    journals: journals.entries.filter((j) => inYear(j.eventDate, year)),
    memories: memories.memories.filter((m) => inYear(m.eventDate, year)),
    places: [],
    collections: collections.items.filter((c) => inYear(c.eventDate, year)),
    goals: [],
    lifePeriods: lifePeriodsRaw.map((p) => ({
      id: p.id,
      effectiveFrom: p.effective_from,
      effectiveTo: p.effective_to ?? undefined,
      items: (p.life_period_items ?? []).map(
        (item: { item_type: string; label: string | null; content: string }) => ({
          type: item.item_type,
          label: item.label ?? undefined,
          content: item.content,
        }),
      ),
    })),
  };
}

async function getYearArchiveIncludingPrivate(year: number): Promise<YearArchiveBundle> {
  const supabase = await tryCreateClient();
  if (!supabase) {
    return getPublicYearArchive(year);
  }

  const yStart = `${year}-01-01`;
  const yEnd = `${year}-12-31`;

  const [journalRes, memoryRes, placeRes, collectionRes, goalRes, periodRes] =
    await Promise.all([
      supabase
        .from("journal_entries")
        .select("*, journal_entry_tags(tag)")
        .gte("event_date", yStart)
        .lte("event_date", yEnd)
        .order("event_date", { ascending: false }),
      supabase
        .from("memories")
        .select("*")
        .gte("event_date", yStart)
        .lte("event_date", yEnd)
        .order("event_date", { ascending: false }),
      supabase
        .from("places")
        .select("*")
        .or(
          `and(first_visited_date.gte.${yStart},first_visited_date.lte.${yEnd}),and(created_at.gte.${yStart},created_at.lte.${yEnd}T23:59:59)`,
        ),
      supabase
        .from("collection_items")
        .select("*, collection_item_tags(tag)")
        .or(`event_date.gte.${yStart},recorded_at.gte.${yStart}`)
        .lte("event_date", yEnd),
      supabase
        .from("goals")
        .select("*")
        .or(`started_on.gte.${yStart},target_date.gte.${yStart}`),
      supabase
        .from("life_periods")
        .select("*, life_period_items(*)")
        .lte("effective_from", yEnd)
        .or(`effective_to.is.null,effective_to.gte.${yStart}`),
    ]);

  return {
    year,
    journals: (journalRes.data ?? []).map((row) => ({
      id: row.id,
      slug: row.slug,
      title: row.title,
      excerpt: row.excerpt ?? "",
      body: row.body_markdown,
      category: row.category,
      publishedAt: row.event_date,
      eventDate: row.event_date,
      recordedAt: row.recorded_at,
      tags: row.journal_entry_tags?.map((t: { tag: string }) => t.tag) ?? [],
      isPublic: row.is_public,
    })),
    memories: (memoryRes.data ?? []).map((m) => ({
      id: m.id,
      year: String(year),
      title: m.title,
      description: m.description ?? "",
      type: m.category,
      eventDate: m.event_date,
      location: m.location ?? undefined,
    })),
    places: (placeRes.data ?? []).map((p) => ({
      id: p.id,
      name: p.name,
      region: [p.region, p.country].filter(Boolean).join(", "),
      description: p.description ?? "",
      category: p.place_status,
      mood: p.mood ?? "",
      gradient: p.gradient_class ?? "from-slate-800 to-slate-950",
    })),
    collections: (collectionRes.data ?? []).map((row) => ({
      id: row.id,
      title: row.title,
      description: row.description ?? "",
      url: row.external_url ?? undefined,
      type: row.item_type,
      tags: row.collection_item_tags?.map((t: { tag: string }) => t.tag) ?? [],
      eventDate: row.event_date ?? undefined,
    })),
    goals: (goalRes.data ?? []).map((g) => ({
      id: g.id,
      title: g.title,
      status: g.status,
      eventDate: g.started_on ?? g.target_date ?? undefined,
    })),
    lifePeriods: (periodRes.data ?? []).map((p) => ({
      id: p.id,
      effectiveFrom: p.effective_from,
      effectiveTo: p.effective_to ?? undefined,
      items: (p.life_period_items ?? []).map(
        (item: { item_type: string; label: string | null; content: string }) => ({
          type: item.item_type,
          label: item.label ?? undefined,
          content: item.content,
        }),
      ),
    })),
  };
}

export async function getArchiveYears(): Promise<number[]> {
  "use cache";
  cacheTag(FOOTPRINT_CONTENT_TAG);

  const current = site.copyrightYear;
  const supabase = tryCreatePublicClient();
  if (!supabase) {
    return [current, current - 1].filter((y, i, a) => a.indexOf(y) === i);
  }

  const { data } = await supabase.from("journal_entries").select("event_date").limit(500);
  const years = new Set<number>([current]);
  data?.forEach((row) => years.add(new Date(row.event_date).getFullYear()));
  return Array.from(years).sort((a, b) => b - a);
}