import type { PublicMemory } from "@/lib/content/types";
import { FadeIn } from "@/components/animations/FadeIn";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { cn } from "@/lib/utils";

const typeColor = {
  milestone: "border-violet-400/50",
  trip: "border-sky-400/50",
  memory: "border-emerald-400/50",
  shift: "border-amber-400/50",
};

export function TimelineSection({ memories }: { memories: PublicMemory[] }) {
  return (
    <section id="timeline" className="scroll-mt-24 pt-20">
      <FadeIn>
        <SectionHeading
          eyebrow="Chapters"
          title="Timeline"
          description="Milestones, trips, and small pivots along the way."
        />
      </FadeIn>
      <ol className="relative border-l border-[var(--border)] pl-6 md:pl-8">
        {memories.map((event, i) => (
          <FadeIn key={event.id} delay={i * 0.06}>
            <li className="relative pb-10 last:pb-0">
              <span
                className={cn(
                  "absolute -left-[25px] top-1.5 h-3 w-3 rounded-full border-2 bg-[var(--bg-deep)] md:-left-[29px]",
                  typeColor[event.type],
                )}
                aria-hidden
              />
              <p className="text-xs font-medium uppercase tracking-wider text-[var(--text-muted)]">
                {event.year || event.eventDate.slice(0, 4)}
              </p>
              <h3 className="mt-1 text-lg font-semibold text-[var(--text-primary)]">{event.title}</h3>
              <p className="mt-1 max-w-xl text-sm leading-relaxed text-[var(--text-secondary)]">
                {event.description}
              </p>
            </li>
          </FadeIn>
        ))}
      </ol>
    </section>
  );
}