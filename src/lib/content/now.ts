import { nowItems as staticNow, availability as staticAvailability } from "@/data/now";
import { cacheTag } from "next/cache";
import { FOOTPRINT_CONTENT_TAG } from "@/lib/content/cache-tags";
import { tryCreatePublicClient } from "@/lib/supabase/public";
import type { ContentSource, PublicNowItem } from "@/lib/content/types";

const typeToIcon: Record<string, string> = {
  learning: "book-open",
  building: "hammer",
  focus: "target",
  interests: "sparkles",
  goals: "target",
  book: "book-open",
  movie: "clapperboard",
  show: "clapperboard",
  routine: "sparkles",
};

const typeToLabel: Record<string, string> = {
  learning: "Currently learning",
  building: "Currently building",
  focus: "Current focus",
  interests: "Current interests",
  goals: "Current goals",
  book: "Reading",
  movie: "Watching",
  show: "Watching",
  routine: "Routines",
};

function mapStatic(): PublicNowItem[] {
  return staticNow.map((item) => ({
    id: item.id,
    label: item.label,
    value: item.value,
    icon: item.icon,
    status: item.status,
  }));
}

export async function getCurrentLifeItems(): Promise<{
  items: PublicNowItem[];
  availability: { status: "open"; label: string; timezone: string };
  source: ContentSource;
}> {
  "use cache";
  cacheTag(FOOTPRINT_CONTENT_TAG);

  const supabase = tryCreatePublicClient();
  if (!supabase) {
    return {
      items: mapStatic(),
      availability: staticAvailability,
      source: "static",
    };
  }

  const { data: period } = await supabase
    .from("life_periods")
    .select("id")
    .eq("is_current", true)
    .maybeSingle();

  if (!period) {
    return {
      items: [],
      availability: staticAvailability,
      source: "database",
    };
  }

  const { data: items } = await supabase
    .from("life_period_items")
    .select("*")
    .eq("period_id", period.id)
    .order("sort_order");

  const { data: profile } = await supabase.from("site_profile").select("availability_label, timezone").limit(1).maybeSingle();

  if (!items?.length) {
    return {
      items: [],
      availability: {
        status: "open",
        label: profile?.availability_label ?? staticAvailability.label,
        timezone: profile?.timezone ?? staticAvailability.timezone,
      },
      source: "database",
    };
  }

  return {
    source: "database",
    availability: {
      status: "open",
      label: profile?.availability_label ?? staticAvailability.label,
      timezone: profile?.timezone ?? staticAvailability.timezone,
    },
    items: items.map((item) => ({
      id: item.id,
      label: item.label ?? typeToLabel[item.item_type] ?? item.item_type,
      value: item.content,
      icon: typeToIcon[item.item_type] ?? "sparkles",
      status: "active" as const,
    })),
  };
}

export async function getLifePeriodsForYear(year: number) {
  "use cache";
  cacheTag(FOOTPRINT_CONTENT_TAG);

  const supabase = tryCreatePublicClient();
  if (!supabase) return [];
  const start = `${year}-01-01`;
  const end = `${year}-12-31`;
  const { data } = await supabase
    .from("life_periods")
    .select("*, life_period_items(*)")
    .lte("effective_from", end)
    .or(`effective_to.is.null,effective_to.gte.${start}`)
    .order("effective_from", { ascending: false });
  return data ?? [];
}