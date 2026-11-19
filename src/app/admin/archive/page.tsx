import Link from "next/link";
import { AdminShell } from "@/components/admin/AdminShell";
import { getArchiveYears } from "@/lib/content/archive";

export const instant = false;

export default async function AdminArchiveIndexPage() {
  const years = await getArchiveYears();
  return (
    <AdminShell title="Year archive" description="Includes private entries — public archive hides those.">
      <div className="flex flex-wrap gap-2">
        {years.map((year) => (
          <Link
            key={year}
            href={`/admin/archive/${year}`}
            className="rounded-full border border-[var(--border)] bg-[var(--bg-elevated)] px-4 py-2 text-sm hover:border-[var(--border-strong)]"
          >
            {year}
          </Link>
        ))}
      </div>
    </AdminShell>
  );
}