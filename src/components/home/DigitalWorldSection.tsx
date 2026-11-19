import type { PublicDigitalItem } from "@/lib/content/types";
import { FadeIn } from "@/components/animations/FadeIn";
import { BentoCard } from "@/components/ui/BentoCard";
import { SectionHeading } from "@/components/ui/SectionHeading";

const categoryLabels = {
  device: "Devices",
  os: "Systems",
  software: "Software",
  devtool: "Dev tools",
} as const;

export function DigitalWorldSection({ items }: { items: PublicDigitalItem[] }) {
  const groups = (Object.keys(categoryLabels) as Array<keyof typeof categoryLabels>)
    .map((key) => ({
      key,
      label: categoryLabels[key],
      items: items.filter((d) => d.category === key),
    }))
    .filter((group) => group.items.length > 0);

  return (
    <section id="digital-world" className="scroll-mt-24 pt-20">
      <FadeIn>
        <SectionHeading
          eyebrow="Workbench"
          title="My digital world"
          description="The gear and apps that shape my days — personal, not a spec sheet."
        />
      </FadeIn>
      <div className="grid gap-4 lg:grid-cols-2">
        {groups.map((group, gi) => (
          <FadeIn key={group.key} delay={gi * 0.08}>
            <BentoCard gradient="from-blue-500/8 via-transparent to-violet-500/8">
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                {group.label}
              </h3>
              <ul className="space-y-3">
                {group.items.map((item) => (
                  <li
                    key={item.id}
                    className="rounded-2xl border border-[var(--border)] bg-[var(--bg-subtle)]/50 px-4 py-3"
                  >
                    <p className="font-medium text-[var(--text-primary)]">{item.name}</p>
                    <p className="mt-0.5 text-sm text-[var(--text-secondary)]">{item.detail}</p>
                  </li>
                ))}
              </ul>
            </BentoCard>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}