import type { PublicNowItem } from "@/lib/content/types";
import { DynamicIcon } from "@/components/icons/icon-map";
import { FadeIn } from "@/components/animations/FadeIn";
import { BentoCard } from "@/components/ui/BentoCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { cn } from "@/lib/utils";

const statusDot = {
  active: "bg-emerald-400",
  paused: "bg-amber-400",
  exploring: "bg-violet-400",
};

export function CurrentlySection({ items }: { items: PublicNowItem[] }) {
  return (
    <section id="currently" className="scroll-mt-24">
      <FadeIn>
        <SectionHeading
          eyebrow="Now"
          title="Currently"
          description="A living snapshot of what I'm paying attention to right now — older snapshots live in the archive."
        />
      </FadeIn>
      <div className="grid gap-4 md:grid-cols-2">
        {items.map((item, i) => (
          <FadeIn key={item.id} delay={i * 0.06}>
            <BentoCard
              className={cn(item.id === "focus" && "md:col-span-2")}
              gradient="from-violet-500/10 via-transparent to-blue-500/5"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-[var(--border)] bg-[var(--bg-subtle)] text-[var(--accent-violet)]">
                  <DynamicIcon name={item.icon} className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="mb-2 flex items-center gap-2">
                    <p className="text-xs font-medium uppercase tracking-wider text-[var(--text-muted)]">
                      {item.label}
                    </p>
                    {item.status ? (
                      <span
                        className={cn(
                          "h-1.5 w-1.5 rounded-full",
                          statusDot[item.status],
                        )}
                        title={item.status}
                      />
                    ) : null}
                  </div>
                  <p className="text-base leading-relaxed text-[var(--text-primary)]">
                    {item.value}
                  </p>
                </div>
              </div>
            </BentoCard>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}