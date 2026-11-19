"use client";

import { Suspense } from "react";
import { motion } from "framer-motion";
import { ArrowDown } from "lucide-react";
import { LiveClock } from "@/components/home/LiveClock";

type Props = {
  owner: string;
  tagline: string;
  timezone?: string;
  availabilityLabel?: string;
  sections: { id: string; label: string }[];
};

const ease = [0.22, 1, 0.36, 1] as const;

export function HeroSection({ owner, tagline, timezone, availabilityLabel, sections }: Props) {
  const firstName = owner.split(" ")[0];

  return (
    <section className="relative isolate overflow-hidden pt-12 pb-16 md:pt-20 md:pb-24">
      <div className="aurora" aria-hidden>
        <span />
        <span />
        <span />
      </div>

      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease }}
        className="mb-5 inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--glass)] px-3 py-1 text-xs font-medium text-[var(--text-secondary)] backdrop-blur"
      >
        <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent-violet)]" />
        Personal digital HQ
      </motion.p>

      <motion.h1
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease, delay: 0.05 }}
        className="max-w-full break-words text-4xl font-semibold tracking-tight text-[var(--text-primary)] sm:text-5xl md:text-7xl md:leading-[1.02]"
      >
        Hey, I&apos;m <span className="text-shimmer">{firstName}</span>.
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease, delay: 0.15 }}
        className="mt-5 text-xl text-[var(--text-secondary)] md:text-2xl"
      >
        Welcome to my little corner of the internet.
      </motion.p>

      {tagline ? (
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease, delay: 0.25 }}
          className="mt-6 max-w-2xl text-base leading-relaxed text-[var(--text-secondary)] md:text-lg"
        >
          {tagline}
        </motion.p>
      ) : null}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="mt-8"
      >
        <Suspense fallback={<p className="text-sm text-[var(--text-muted)]">Loading local time…</p>}>
          <LiveClock timezone={timezone} availabilityLabel={availabilityLabel} />
        </Suspense>
      </motion.div>

      {sections.length > 0 ? (
        <motion.nav
          aria-label="Jump to section"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.55 }}
          className="mt-12 flex flex-wrap items-center gap-2"
        >
          {sections.map((section) => (
            <a
              key={section.id}
              href={`#${section.id}`}
              className="rounded-full border border-[var(--border)] bg-[var(--glass)] px-3.5 py-1.5 text-xs font-medium text-[var(--text-secondary)] backdrop-blur transition hover:-translate-y-0.5 hover:border-[var(--border-strong)] hover:text-[var(--text-primary)]"
            >
              {section.label}
            </a>
          ))}
          <ArrowDown className="ml-1 h-4 w-4 animate-bounce text-[var(--text-muted)]" aria-hidden />
        </motion.nav>
      ) : null}
    </section>
  );
}