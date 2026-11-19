"use client";

import Link from "next/link";

export default function SiteError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="mx-auto flex max-w-lg flex-1 flex-col items-center justify-center px-4 py-24 text-center">
      <p className="text-xs uppercase tracking-[0.2em] text-[var(--text-muted)]">Hiccup</p>
      <h1 className="mt-3 text-2xl font-semibold text-[var(--text-primary)]">
        Something didn&apos;t load
      </h1>
      <p className="mt-3 text-sm text-[var(--text-secondary)]">
        It&apos;s probably temporary. Try again, or head back to the homepage.
      </p>
      <div className="mt-8 flex gap-3">
        <button
          type="button"
          onClick={reset}
          className="rounded-full bg-[var(--accent-violet)] px-5 py-2.5 text-sm font-medium text-white"
        >
          Try again
        </button>
        <Link
          href="/"
          className="rounded-full border border-[var(--border)] bg-[var(--bg-elevated)] px-5 py-2.5 text-sm font-medium text-[var(--text-primary)]"
        >
          Home
        </Link>
      </div>
    </main>
  );
}