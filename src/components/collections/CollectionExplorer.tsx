"use client";

import { useMemo, useState } from "react";
import { Search, ExternalLink } from "lucide-react";
import type { PublicCollectionItem } from "@/lib/content/types";
import { BentoCard } from "@/components/ui/BentoCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { cn } from "@/lib/utils";

const types = [
  "all",
  "website",
  "tool",
  "book",
  "article",
  "music",
  "movie",
  "discovery",
] as const;

type Props = {
  items: PublicCollectionItem[];
};

export function CollectionExplorer({ items }: Props) {
  const [query, setQuery] = useState("");
  const [type, setType] = useState<(typeof types)[number]>("all");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((item) => {
      const matchesType = type === "all" ? true : item.type === type;
      if (!matchesType) return false;
      if (!q) return true;
      return (
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.tags.some((t) => t.toLowerCase().includes(q))
      );
    });
  }, [items, query, type]);

  if (items.length === 0) {
    return (
      <EmptyState
        title="The shelf is empty — for now"
        description="Tools, books, films and corners of the internet worth bookmarking will show up here."
        action={{ href: "/", label: "Back home" }}
      />
    );
  }

  return (
    <div className="space-y-8">
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-elevated)] p-4 md:p-5">
        <label htmlFor="collection-search" className="sr-only">
          Search collection
        </label>
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-muted)]" />
          <input
            id="collection-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search tools, tags, titles…"
            className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg-subtle)]/60 py-3 pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-[var(--accent-violet)]"
          />
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {types.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setType(t)}
              className={cn(
                "rounded-full border px-3 py-1.5 text-xs font-medium capitalize transition",
                type === t
                  ? "border-[var(--border-strong)] bg-[var(--bg-subtle)] text-[var(--text-primary)]"
                  : "border-transparent text-[var(--text-muted)] hover:text-[var(--text-secondary)]",
              )}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="text-center text-sm text-[var(--text-muted)]">Nothing matches that search.</p>
      ) : null}

      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((item) => (
          <li key={item.id}>
            <BentoCard className="h-full">
              <div className="flex h-full flex-col gap-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-medium uppercase tracking-wide text-[var(--text-muted)]">
                    {item.type}
                  </span>
                  {item.url ? (
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Visit ${item.title}`}
                      className="text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  ) : null}
                </div>
                <h2 className="text-base font-semibold text-[var(--text-primary)]">{item.title}</h2>
                <p className="text-sm text-[var(--text-secondary)]">{item.description}</p>
                <div className="mt-auto flex flex-wrap gap-1.5 pt-2">
                  {item.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-md bg-[var(--bg-subtle)] px-2 py-0.5 text-[10px] text-[var(--text-muted)]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </BentoCard>
          </li>
        ))}
      </ul>
    </div>
  );
}