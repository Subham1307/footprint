import Link from "next/link";

export default function NotFound() {
  return (
    <main className="relative isolate mx-auto flex min-h-screen w-full min-w-0 max-w-lg flex-1 flex-col items-center justify-center overflow-hidden px-4 py-20 text-center">
      <div className="aurora" aria-hidden>
        <span />
        <span />
        <span />
      </div>
      <p className="text-shimmer text-6xl font-semibold tracking-tighter sm:text-8xl md:text-9xl">404</p>
      <h1 className="mt-4 text-2xl font-semibold text-[var(--text-primary)]">
        This room isn&apos;t built yet
      </h1>
      <p className="mt-3 text-sm text-[var(--text-secondary)]">
        The link might be old, or the page is still somewhere in the future changelog.
      </p>
      <Link
        href="/"
        className="mt-8 rounded-full border border-[var(--border)] bg-[var(--bg-elevated)] px-5 py-2.5 text-sm font-medium text-[var(--text-primary)] transition hover:-translate-y-0.5 hover:border-[var(--border-strong)]"
      >
        Back home
      </Link>
    </main>
  );
}