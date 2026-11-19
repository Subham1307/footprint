import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense, type ReactNode } from "react";
import { PageShell } from "@/components/layout/PageShell";
import { FadeIn } from "@/components/animations/FadeIn";
import { BentoCard } from "@/components/ui/BentoCard";
import { getYearArchive, getArchiveYears } from "@/lib/content/archive";
import { formatDate } from "@/lib/utils";

type Props = { params: Promise<{ year: string }> };

export const instant = false;

export async function generateStaticParams() {
  const years = await getArchiveYears();
  return years.map((year) => ({ year: String(year) }));
}

export default function ArchiveYearPage({ params }: Props) {
  return (
    <Suspense
      fallback={
        <PageShell eyebrow="Time capsule" title="Archive" description="Loading year…">
          <p className="text-sm text-[var(--text-muted)]">Loading…</p>
        </PageShell>
      }
    >
      <ArchiveYearPageContent params={params} />
    </Suspense>
  );
}

async function ArchiveYearPageContent({ params }: Props) {
  const { year: yearParam } = await params;
  const year = Number(yearParam);
  if (!Number.isFinite(year) || year < 1970 || year > 2100) notFound();

  const archive = await getYearArchive(year);

  return (
    <PageShell
      eyebrow="Time capsule"
      title={`${year} archive`}
      description={`Everything tied to ${year} by event date — journals, memories, collections, goals, and life snapshots.`}
    >
      <div className="mb-8 flex flex-wrap gap-2">
        {(await getArchiveYears()).map((y) => (
          <Link
            key={y}
            href={`/archive/${y}`}
            className={`rounded-full border px-3 py-1.5 text-xs ${
              y === year
                ? "border-[var(--border-strong)] bg-[var(--bg-elevated)]"
                : "border-transparent text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
            }`}
          >
            {y}
          </Link>
        ))}
      </div>

      <section className="space-y-10">
        <ArchiveSection title="Journal" count={archive.journals.length}>
          {archive.journals.map((entry) => (
            <BentoCard key={entry.id} href={`/journal/${entry.slug}`}>
              <p className="text-xs text-[var(--text-muted)]">
                {formatDate(entry.eventDate)} · {entry.category}
              </p>
              <h3 className="mt-1 text-lg font-semibold">{entry.title}</h3>
              <p className="mt-1 text-sm text-[var(--text-secondary)]">{entry.excerpt}</p>
            </BentoCard>
          ))}
        </ArchiveSection>

        <ArchiveSection title="Memories & milestones" count={archive.memories.length}>
          {archive.memories.map((m) => (
            <BentoCard key={m.id}>
              <p className="text-xs text-[var(--text-muted)]">{formatDate(m.eventDate)}</p>
              <h3 className="mt-1 text-lg font-semibold">{m.title}</h3>
              <p className="mt-1 text-sm text-[var(--text-secondary)]">{m.description}</p>
            </BentoCard>
          ))}
        </ArchiveSection>

        <ArchiveSection title="Collections" count={archive.collections.length}>
          {archive.collections.map((c) => (
            <BentoCard key={c.id}>
              <p className="text-xs uppercase text-[var(--text-muted)]">{c.type}</p>
              <h3 className="mt-1 font-semibold">{c.title}</h3>
              <p className="text-sm text-[var(--text-secondary)]">{c.description}</p>
            </BentoCard>
          ))}
        </ArchiveSection>

        <ArchiveSection title="Life snapshots (Currently)" count={archive.lifePeriods.length}>
          {archive.lifePeriods.map((period) => (
            <BentoCard key={period.id}>
              <p className="text-xs text-[var(--text-muted)]">
                {formatDate(period.effectiveFrom)}
                {period.effectiveTo ? ` → ${formatDate(period.effectiveTo)}` : " → present"}
              </p>
              <ul className="mt-3 space-y-2 text-sm">
                {period.items.map((item) => (
                  <li key={`${item.type}-${item.content.slice(0, 20)}`}>
                    <span className="text-[var(--text-muted)]">{item.label ?? item.type}:</span>{" "}
                    {item.content}
                  </li>
                ))}
              </ul>
            </BentoCard>
          ))}
        </ArchiveSection>
      </section>
    </PageShell>
  );
}

function ArchiveSection({
  title,
  count,
  children,
}: {
  title: string;
  count: number;
  children: ReactNode;
}) {
  if (count === 0) {
    return (
      <FadeIn>
        <h2 className="text-lg font-semibold text-[var(--text-primary)]">{title}</h2>
        <p className="mt-2 text-sm text-[var(--text-muted)]">Nothing recorded for this year yet.</p>
      </FadeIn>
    );
  }
  return (
    <FadeIn>
      <h2 className="mb-4 text-lg font-semibold text-[var(--text-primary)]">
        {title} <span className="text-sm font-normal text-[var(--text-muted)]">({count})</span>
      </h2>
      <div className="grid gap-3 md:grid-cols-2">{children}</div>
    </FadeIn>
  );
}