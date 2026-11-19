import Link from "next/link";

export function AdminResourceList({
  rows,
  empty,
}: {
  empty: string;
  rows: { id: string; title: string; meta?: string; href: string }[];
}) {
  if (!rows.length) {
    return <p className="text-sm text-[var(--text-muted)]">{empty}</p>;
  }
  return (
    <ul className="divide-y divide-[var(--border)] rounded-2xl border border-[var(--border)] bg-[var(--bg-elevated)]">
      {rows.map((row) => (
        <li key={row.id}>
          <Link
            href={row.href}
            className="flex items-center justify-between gap-4 px-4 py-3 text-sm hover:bg-[var(--bg-subtle)]/40"
          >
            <span className="font-medium">{row.title}</span>
            {row.meta ? <span className="text-xs text-[var(--text-muted)]">{row.meta}</span> : null}
          </Link>
        </li>
      ))}
    </ul>
  );
}