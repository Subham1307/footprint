import Link from "next/link";
import type { PublicCollectionItem } from "@/lib/content/types";
import { FadeIn } from "@/components/animations/FadeIn";
import { BentoCard } from "@/components/ui/BentoCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ExternalLink } from "lucide-react";


const typeLabels: Record<string, string> = {
  website: "Site",
  tool: "Tool",
  book: "Book",
  article: "Article",
  music: "Music",
  movie: "Film",
  discovery: "Discovery",
};

export function CollectionsPreview({ items }: { items: PublicCollectionItem[] }) {
  const preview = items.slice(0, 6);
  return (
    <section id="collections" className="scroll-mt-24 pt-20">
      <FadeIn>
        <SectionHeading
          eyebrow="Shelf"
          title="Digital collection"
          description="Bookmarks with context — things I return to when I need a nudge or a rabbit hole."
        />
      </FadeIn>
      <h3 className="sr-only">Collection items</h3>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {preview.map((item, i) => (
          <FadeIn key={item.id} delay={i * 0.04}>
            <BentoCard className="h-full">
              <div className="flex h-full flex-col gap-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="rounded-full border border-[var(--border)] px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-[var(--text-muted)]">
                    {typeLabels[item.type]}
                  </span>
                  {item.url ? (
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                      aria-label={`Open ${item.title} in new tab`}
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  ) : null}
                </div>
                <h4 className="text-base font-semibold text-[var(--text-primary)]">{item.title}</h4>
                <p className="text-sm leading-relaxed text-[var(--text-secondary)]">{item.description}</p>
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
          </FadeIn>
        ))}
      </div>
      <FadeIn className="mt-6">
        <Link href="/collections" className="text-sm font-medium text-[var(--accent-violet)] hover:underline">
          Browse & filter collection →
        </Link>
      </FadeIn>
    </section>
  );
}