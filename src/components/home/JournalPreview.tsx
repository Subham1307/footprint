import Link from "next/link";
import type { PublicJournalEntry } from "@/lib/content/types";
import { readingTime, formatDate } from "@/lib/utils";
import { FadeIn } from "@/components/animations/FadeIn";
import { BentoCard } from "@/components/ui/BentoCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ArrowRight } from "lucide-react";


const categoryStyles: Record<string, string> = {
  thought: "text-violet-400",
  idea: "text-blue-400",
  observation: "text-emerald-400",
  reflection: "text-amber-400",
};

export function JournalPreview({ entries }: { entries: PublicJournalEntry[] }) {
  const recent = entries.slice(0, 3);
  return (
    <section id="journal" className="scroll-mt-24 pt-20">
      <FadeIn>
        <div className="mb-8 flex flex-col gap-4 md:mb-10 md:flex-row md:items-end md:justify-between">
          <SectionHeading
            className="mb-0"
            eyebrow="Brain dump"
            title="Journal"
            description="Unpolished notes, receipts from the mind."
          />
          <Link
            href="/journal"
            className="inline-flex items-center gap-2 text-sm font-medium text-[var(--accent-violet)] hover:underline"
          >
            Search all entries
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </FadeIn>
      <div className="grid gap-4 lg:grid-cols-3">
        {recent.map((entry, i) => (
          <FadeIn key={entry.slug} delay={i * 0.08}>
            <BentoCard href={`/journal/${entry.slug}`} className="flex h-full flex-col">
              <div className="mb-3 flex flex-wrap items-center gap-2 text-xs text-[var(--text-muted)]">
                <time dateTime={entry.eventDate}>{formatDate(entry.eventDate)}</time>
                <span>·</span>
                <span className={categoryStyles[entry.category]}>{entry.category}</span>
                <span>·</span>
                <span>{readingTime(entry.body)} min read</span>
              </div>
              <h3 className="text-lg font-semibold text-[var(--text-primary)]">{entry.title}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-[var(--text-secondary)]">
                {entry.excerpt}
              </p>
            </BentoCard>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}