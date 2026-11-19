import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ArrowLeft } from "lucide-react";
import { DynamicIcon } from "@/components/icons/icon-map";
import { FadeIn } from "@/components/animations/FadeIn";
import { BentoCard } from "@/components/ui/BentoCard";
import { getPublicInterestBySlug, getPublicInterests } from "@/lib/content/interests";

type Props = { params: Promise<{ slug: string }> };

export const instant = false;

export async function generateStaticParams() {
  const { interests } = await getPublicInterests();
  // Cache Components requires at least one param; the placeholder renders the 404 page.
  if (interests.length === 0) return [{ slug: "none" }];
  return interests.map((interest) => ({ slug: interest.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const { interest } = await getPublicInterestBySlug(slug);
  if (!interest) return { title: "Interests" };
  return { title: interest.title, description: interest.description };
}

export default function InterestPage({ params }: Props) {
  return (
    <Suspense
      fallback={
        <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-10 md:px-6 md:py-14">
          <p className="text-sm text-[var(--text-muted)]">Loading…</p>
        </main>
      }
    >
      <InterestPageContent params={params} />
    </Suspense>
  );
}

async function InterestPageContent({ params }: Props) {
  const { slug } = await params;
  const { interest } = await getPublicInterestBySlug(slug);
  if (!interest) notFound();

  return (
    <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-10 md:px-6 md:py-14">
      <FadeIn>
        <Link
          href="/#interests"
          className="mb-8 inline-flex items-center gap-2 text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to interests
        </Link>
        <div
          className="inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-[var(--border)] bg-[var(--bg-elevated)]"
          style={{ color: interest.accent }}
        >
          <DynamicIcon name={interest.icon} className="h-6 w-6" />
        </div>
        <p className="mt-6 text-sm uppercase tracking-wider text-[var(--text-muted)]">
          {interest.tagline}
        </p>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight text-[var(--text-primary)]">
          {interest.title}
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-[var(--text-secondary)]">
          {interest.description}
        </p>
      </FadeIn>
      <FadeIn delay={0.1} className="mt-10">
        <BentoCard gradient={interest.gradient}>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--text-muted)]">
            On my mind lately
          </h2>
          <ul className="mt-4 space-y-3">
            {interest.highlights.map((line) => (
              <li
                key={line}
                className="flex gap-3 text-base text-[var(--text-primary)] before:mt-2 before:h-1.5 before:w-1.5 before:shrink-0 before:rounded-full before:bg-[var(--accent-violet)]"
              >
                {line}
              </li>
            ))}
          </ul>
        </BentoCard>
      </FadeIn>
    </main>
  );
}