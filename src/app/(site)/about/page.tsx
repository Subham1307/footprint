import Link from "next/link";
import { PageShell } from "@/components/layout/PageShell";
import { FadeIn } from "@/components/animations/FadeIn";
import { BentoCard } from "@/components/ui/BentoCard";
import { MarkdownBody } from "@/components/content/MarkdownBody";
import { getSiteMeta } from "@/lib/content/site";

export const metadata = { title: "About" };

export default async function AboutPage() {
  const { data: site } = await getSiteMeta();
  const firstName = site.owner.split(" ")[0];

  return (
    <PageShell
      eyebrow="Human"
      title={`About ${firstName}`}
      description="Not a résumé — just context for why this site exists and how I like to move through the world."
    >
      <div className="grid gap-4 lg:grid-cols-3">
        <FadeIn className="lg:col-span-2">
          <BentoCard gradient="from-violet-500/12 via-transparent to-blue-500/8">
            {site.aboutMarkdown ? (
              <MarkdownBody content={site.aboutMarkdown} />
            ) : (
              <div className="text-base leading-relaxed text-[var(--text-secondary)]">
                <p className="text-[var(--text-primary)]">
                  I&apos;m {firstName} — an engineer who also collects rabbit holes, mountain playlists,
                  and football stories that don&apos;t fit spreadsheets.
                </p>
                <p className="mt-4">
                  {site.name} is my digital HQ: a home for what I&apos;m learning, where I&apos;ve been, what I
                  keep on my shelf, and thoughts too half-baked for anywhere else.
                </p>
                <p className="mt-4">
                  It grows slowly and on purpose — a notebook on the desk rather than a stage.
                </p>
              </div>
            )}
          </BentoCard>
        </FadeIn>
        <FadeIn delay={0.1}>
          <BentoCard>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--text-muted)]">
              Quick links
            </h2>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <Link href="/journal" className="text-[var(--accent-violet)] hover:underline">
                  Read the journal
                </Link>
              </li>
              <li>
                <Link href="/archive" className="text-[var(--accent-blue)] hover:underline">
                  Browse by year
                </Link>
              </li>
              <li>
                <Link href="/collections" className="text-[var(--text-primary)] hover:underline">
                  Explore the collection
                </Link>
              </li>
            </ul>
          </BentoCard>
        </FadeIn>
      </div>
    </PageShell>
  );
}