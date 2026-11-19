import type { PublicInterest } from "@/lib/content/types";
import { DynamicIcon } from "@/components/icons/icon-map";
import { FadeIn } from "@/components/animations/FadeIn";
import { BentoCard } from "@/components/ui/BentoCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ArrowUpRight } from "lucide-react";

export function InterestsGrid({ interests }: { interests: PublicInterest[] }) {
  return (
    <section id="interests" className="scroll-mt-24 pt-20">
      <FadeIn>
        <SectionHeading
          eyebrow="Curiosities"
          title="Interests"
          description="Each lane has its own mood — tap through when you want the longer version."
        />
      </FadeIn>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {interests.map((interest, i) => (
          <FadeIn key={interest.slug} delay={i * 0.05}>
            <BentoCard
              href={`/interests/${interest.slug}`}
              gradient={interest.gradient}
              className="min-h-[180px]"
            >
              <div className="flex h-full flex-col justify-between gap-6">
                <div className="flex items-start justify-between gap-3">
                  <div
                    className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[var(--border)] bg-[var(--bg-elevated)]"
                    style={{ color: interest.accent }}
                  >
                    <DynamicIcon name={interest.icon} className="h-5 w-5" />
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-[var(--text-muted)] transition group-hover:text-[var(--text-primary)]" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-[var(--text-primary)]">
                    {interest.title}
                  </h3>
                  <p className="mt-1 text-sm text-[var(--text-secondary)]">
                    {interest.tagline}
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