import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  description,
  className,
  id,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  className?: string;
  id?: string;
}) {
  return (
    <header className={cn("mb-8 md:mb-10", className)}>
      {eyebrow ? (
        <p className="mb-2 text-xs font-medium uppercase tracking-[0.2em] text-[var(--text-muted)]">
          {eyebrow}
        </p>
      ) : null}
      <h2
        id={id}
        className="text-2xl font-semibold tracking-tight text-[var(--text-primary)] md:text-3xl"
      >
        {title}
      </h2>
      {description ? (
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-[var(--text-secondary)]">
          {description}
        </p>
      ) : null}
    </header>
  );
}