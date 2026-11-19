import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ArrowLeft } from "lucide-react";
import { FadeIn } from "@/components/animations/FadeIn";
import { MarkdownBody } from "@/components/content/MarkdownBody";
import { formatDate } from "@/lib/utils";
import {
  getPublicJournalBySlug,
  getPublicJournalEntries,
  readingTime as rt,
} from "@/lib/content/journal";

type Props = { params: Promise<{ slug: string }> };

export const instant = false;

export async function generateStaticParams() {
  const { entries } = await getPublicJournalEntries();
  // Cache Components requires at least one param; the placeholder renders the 404 page.
  if (entries.length === 0) return [{ slug: "none" }];
  return entries.map((entry) => ({ slug: entry.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const { entry } = await getPublicJournalBySlug(slug);
  if (!entry) return { title: "Journal" };
  return { title: entry.title, description: entry.excerpt };
}

export default function JournalEntryPage({ params }: Props) {
  return (
    <Suspense
      fallback={
        <article className="mx-auto w-full max-w-3xl flex-1 px-4 py-10 md:px-6 md:py-14">
          <p className="text-sm text-[var(--text-muted)]">Loading…</p>
        </article>
      }
    >
      <JournalEntryPageContent params={params} />
    </Suspense>
  );
}

async function JournalEntryPageContent({ params }: Props) {
  const { slug } = await params;
  const { entry } = await getPublicJournalBySlug(slug);
  if (!entry) notFound();

  const minutes = rt(entry.body);

  return (
    <article className="mx-auto w-full max-w-3xl flex-1 px-4 py-10 md:px-6 md:py-14">
      <FadeIn>
        <Link
          href="/journal"
          className="mb-8 inline-flex items-center gap-2 text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to journal
        </Link>
        <p className="text-xs font-medium uppercase tracking-wider text-[var(--text-muted)]">
          Happened {formatDate(entry.eventDate)} · Logged{" "}
          {entry.recordedAt ? formatDate(entry.recordedAt) : formatDate(entry.eventDate)} ·{" "}
          {entry.category} · {minutes} min read
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-[var(--text-primary)] md:text-4xl">
          {entry.title}
        </h1>
        <p className="mt-4 text-lg text-[var(--text-secondary)]">{entry.excerpt}</p>
      </FadeIn>
      <FadeIn delay={0.1} className="mt-10">
        <MarkdownBody content={entry.body} />
      </FadeIn>
    </article>
  );
}