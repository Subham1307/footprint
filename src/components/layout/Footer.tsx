import { AtSign, Camera, Code2, Mail, Network } from "lucide-react";
import Link from "next/link";
import { getSiteMeta } from "@/lib/content/site";

export async function Footer() {
  const { data: site } = await getSiteMeta();
  const social = [
    { href: site.social.github, label: "GitHub", icon: Code2 },
    { href: site.social.twitter, label: "X / Twitter", icon: AtSign },
    { href: site.social.linkedin, label: "LinkedIn", icon: Network },
    { href: site.social.instagram, label: "Instagram", icon: Camera },
  ].filter((link) => link.href);

  return (
    <footer className="relative mt-24 border-t border-[var(--border)] bg-[color-mix(in_srgb,var(--bg-elevated)_40%,transparent)]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--accent-violet)] to-transparent opacity-60"
      />
      <div className="mx-auto max-w-6xl px-4 py-12 md:px-6 md:py-16">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-lg font-medium text-[var(--text-primary)]">
              Thanks for wandering through.
            </p>
            <p className="mt-2 max-w-md text-sm leading-relaxed text-[var(--text-secondary)]">
              This space grows slowly — like a notebook you keep on the desk, not a
              performance on a stage.
            </p>
            {site.email ? (
              <a
                href={`mailto:${site.email}`}
                className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-[var(--accent-violet)] hover:underline"
              >
                <Mail className="h-4 w-4" />
                {site.email}
              </a>
            ) : null}
          </div>
          <div className="flex flex-col items-start gap-4 md:items-end">
            {social.length > 0 ? (
              <div className="flex items-center gap-3">
                {social.map(({ href, label, icon: Icon }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border)] text-[var(--text-secondary)] transition hover:-translate-y-0.5 hover:border-[var(--border-strong)] hover:text-[var(--text-primary)]"
                    aria-label={label}
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            ) : null}
            <p className="text-xs text-[var(--text-muted)]">
              © {site.copyrightYear} {site.owner}. Made with curiosity.
            </p>
            <Link href="/archive" className="text-xs text-[var(--text-muted)] hover:text-[var(--text-secondary)]">
              Browse the archive →
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}