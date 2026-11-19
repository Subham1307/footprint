import { adminDb } from "@/lib/admin/db";

export type DashboardStats = {
  journal: number;
  memories: number;
  places: number;
  collections: number;
  goals: number;
  journalByCategory: { category: string; count: number }[];
  recent: {
    type: string;
    title: string;
    at: string;
    href: string;
  }[];
};

export async function getDashboardStats(): Promise<DashboardStats> {
  const supabase = await adminDb();

  const [
    journal,
    memories,
    places,
    collections,
    goals,
    recentJournal,
    recentMemories,
  ] = await Promise.all([
    supabase.from("journal_entries").select("id", { count: "exact", head: true }),
    supabase.from("memories").select("id", { count: "exact", head: true }),
    supabase.from("places").select("id", { count: "exact", head: true }),
    supabase.from("collection_items").select("id", { count: "exact", head: true }),
    supabase.from("goals").select("id", { count: "exact", head: true }),
    supabase
      .from("journal_entries")
      .select("id, title, created_at")
      .order("created_at", { ascending: false })
      .limit(5),
    supabase
      .from("memories")
      .select("id, title, created_at")
      .order("created_at", { ascending: false })
      .limit(5),
  ]);

  const { data: catRows } = await supabase.from("journal_entries").select("category");
  const counts = new Map<string, number>();
  catRows?.forEach((row) => counts.set(row.category, (counts.get(row.category) ?? 0) + 1));

  const recent = [
    ...(recentJournal.data ?? []).map((j) => ({
      type: "Journal",
      title: j.title,
      at: j.created_at,
      href: `/admin/journal/${j.id}`,
    })),
    ...(recentMemories.data ?? []).map((m) => ({
      type: "Memory",
      title: m.title,
      at: m.created_at,
      href: `/admin/memories/${m.id}`,
    })),
  ]
    .sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime())
    .slice(0, 8);

  return {
    journal: journal.count ?? 0,
    memories: memories.count ?? 0,
    places: places.count ?? 0,
    collections: collections.count ?? 0,
    goals: goals.count ?? 0,
    journalByCategory: Array.from(counts.entries()).map(([category, count]) => ({
      category,
      count,
    })),
    recent,
  };
}