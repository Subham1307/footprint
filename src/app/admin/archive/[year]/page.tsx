
import { notFound } from "next/navigation";
import { AdminShell } from "@/components/admin/AdminShell";
import { getYearArchive } from "@/lib/content/archive";


export const instant = false;
type Props = { params: Promise<{ year: string }> };

export default async function AdminArchiveYearPage({ params }: Props) {
  const { year: y } = await params;
  const year = Number(y);
  if (!Number.isFinite(year)) notFound();
  const archive = await getYearArchive(year, { includePrivate: true });

  return (
    <AdminShell title={`${year} archive (admin)`}>
      <div className="grid gap-6 md:grid-cols-2">
        <ArchiveBlock title="Journal" items={archive.journals.map((j) => j.title)} />
        <ArchiveBlock title="Memories" items={archive.memories.map((m) => m.title)} />
        <ArchiveBlock title="Collections" items={archive.collections.map((c) => c.title)} />
        <ArchiveBlock title="Goals" items={archive.goals.map((g) => `${g.title} (${g.status})`)} />
        <ArchiveBlock
          title="Life periods"
          items={archive.lifePeriods.map((p) => `${p.effectiveFrom} → ${p.effectiveTo ?? "now"}`)}
        />
      </div>
    </AdminShell>
  );
}

function ArchiveBlock({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="surface-card p-5">
      <h2 className="text-sm font-semibold">
        {title} <span className="text-[var(--text-muted)]">({items.length})</span>
      </h2>
      <ul className="mt-3 space-y-1 text-sm text-[var(--text-secondary)]">
        {items.length ? items.map((item) => <li key={item}>{item}</li>) : <li className="text-[var(--text-muted)]">—</li>}
      </ul>
    </div>
  );
}
