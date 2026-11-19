import { PageShell } from "@/components/layout/PageShell";
import { FadeIn } from "@/components/animations/FadeIn";
import { BentoCard } from "@/components/ui/BentoCard";
import { getArchiveYears } from "@/lib/content/archive";

export const metadata = { title: "Archive" };

export default async function ArchiveIndexPage() {
  const years = await getArchiveYears();
  return (
    <PageShell
      eyebrow="Time capsule"
      title="Life by year"
      description="Browse what you recorded and what happened in each chapter — journals, milestones, collections, and “currently” snapshots."
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {years.map((year, i) => (
          <FadeIn key={year} delay={i * 0.05}>
            <BentoCard href={`/archive/${year}`} gradient="from-violet-500/12 to-blue-500/5">
              <p className="text-3xl font-semibold tracking-tight text-[var(--text-primary)]">
                {year}
              </p>
              <p className="mt-2 text-sm text-[var(--text-secondary)]">
                Open the {year} time capsule →
              </p>
            </BentoCard>
          </FadeIn>
        ))}
      </div>
      <p className="mt-8 text-xs text-[var(--text-muted)]">
        Archives filter primarily by <strong>event date</strong> (when something happened), not only
        when it was uploaded. Connect Supabase to unlock full history.
      </p>
    </PageShell>
  );
}