import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site-url";
import { getPublicJournalEntries } from "@/lib/content/journal";
import { getPublicInterests } from "@/lib/content/interests";
import { getArchiveYears } from "@/lib/content/archive";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getSiteUrl();
  const [{ entries }, { interests }, years] = await Promise.all([
    getPublicJournalEntries(),
    getPublicInterests(),
    getArchiveYears(),
  ]);

  const staticRoutes = ["", "/about", "/journal", "/places", "/collections", "/archive"].map(
    (path) => ({ url: `${base}${path}`, changeFrequency: "weekly" as const, priority: path ? 0.7 : 1 }),
  );

  return [
    ...staticRoutes,
    ...entries.map((entry) => ({
      url: `${base}/journal/${entry.slug}`,
      lastModified: entry.recordedAt ?? entry.eventDate,
      priority: 0.6,
    })),
    ...interests.map((interest) => ({ url: `${base}/interests/${interest.slug}`, priority: 0.5 })),
    ...years.map((year) => ({ url: `${base}/archive/${year}`, priority: 0.4 })),
  ];
}