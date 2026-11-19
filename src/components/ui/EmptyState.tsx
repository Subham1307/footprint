import Link from "next/link";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  title: string;
  description: string;
  action?: { href: string; label: string };
  className?: string;
};

export function EmptyState({ title, description, action, className }: Props) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-3xl border border-dashed border-[var(--border-strong)] bg-[var(--bg-elevated)]/50 px-6 py-14 text-center",
        className,
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,var(--glow),transparent_70%)]"
      />
      <div className="relative mx-auto flex max-w-md flex-col items-center">
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[var(--border)] bg-[var(--bg-subtle)] text-[var(--accent-violet)]">
          <Sparkles className="h-5 w-5 animate-pulse-soft" />
        </span>
        <h2 className="mt-5 text-lg font-semibold text-[var(--text-primary)]">{title}</h2>
        <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">{description}</p>
        {action ? (
          <Link
            href={action.href}
            className="mt-6 rounded-full border border-[var(--border)] bg-[var(--bg-elevated)] px-4 py-2 text-sm font-medium text-[var(--text-primary)] transition hover:border-[var(--border-strong)]"
          >
            {action.label}
          </Link>
        ) : null}
      </div>
    </div>
  );
}