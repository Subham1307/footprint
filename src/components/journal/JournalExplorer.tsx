"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import type { PublicJournalEntry } from "@/lib/content/types";
import { formatDate, readingTime, cn } from "@/lib/utils";
import { BentoCard } from "@/components/ui/BentoCard";
import { EmptyState } from "@/components/ui/EmptyState";

const categories = ["all", "thought", "idea", "observation", "reflection"] as const;

type Props = {
  entries: PublicJournalEntry[];
};

export function JournalExplorer({ entries }: Props) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<(typeof categories)[number]>("all");
  const isEmpty = entries.length === 0;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return entries.filter((entry) => {
      const matchesCategory =
        category === "all" ? true : entry.category === category;
      if (!matchesCategory) return false;
      if (!q) return true;
      return (
        entry.title.toLowerCase().includes(q) ||
        entry.excerpt.toLowerCase().includes(q) ||
        entry.body.toLowerCase().includes(q)
      );
    });
  }, [entries, query, category]);

  if (isEmpty) {
    return (
      <EmptyState
        title="The first page is still blank"
        description="Notes, half-formed ideas and reflections will land here soon."
        action={{ href: "/", label: "Back home" }}
      />
    );
  }

  return (
    <div className="space-y-8">
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-elevated)] p-4 md:p-5">
        <label htmlFor="journal-search" className="sr-only">
          Search journal
        </label>
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-muted)]" />
          <input
            id="journal-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search title, excerpt, or body…"
            className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg-subtle)]/60 py-3 pl-10 pr-4 text-sm text-[var(--text-primary)] outline-none ring-[var(--accent-violet)] placeholder:text-[var(--text-muted)] focus:ring-2"
          />
        </div>
        <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label="Filter by category">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategory(cat)}
              className={cn(
                "rounded-full border px-3 py-1.5 text-xs font-medium capitalize transition",
                category === cat
                  ? "border-[var(--border-strong)] bg-[var(--bg-subtle)] text-[var(--text-primary)]"
                  : "border-transparent text-[var(--text-muted)] hover:border-[var(--border)] hover:text-[var(--text-secondary)]",
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <p className="text-sm text-[var(--text-secondary)]">
        {filtered.length} {filtered.length === 1 ? "entry" : "entries"}
      </p>

      <ul className="grid gap-4 md:grid-cols-2">
        {filtered.map((entry) => (
          <li key={entry.slug}>
            <BentoCard href={`/journal/${entry.slug}`}>
              <div className="flex flex-col gap-2">
                <div className="flex flex-wrap gap-2 text-xs text-[var(--text-muted)]">
                  <time dateTime={entry.eventDate}>{formatDate(entry.eventDate)}</time>
                  <span>·</span>
                  <span className="capitalize">{entry.category}</span>
                  <span>·</span>
                  <span>{readingTime(entry.body)} min</span>
                </div>
                <h2 className="text-lg font-semibold text-[var(--text-primary)]">{entry.title}</h2>
                <p className="text-sm text-[var(--text-secondary)]">{entry.excerpt}</p>
              </div>
            </BentoCard>
          </li>
        ))}
      </ul>

      {filtered.length === 0 ? (
        <p className="text-center text-sm text-[var(--text-muted)]">No entries match your filters.</p>
      ) : null}
    </div>
  );
}