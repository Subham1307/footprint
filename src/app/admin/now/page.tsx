import { AdminShell } from "@/components/admin/AdminShell";
import { LifePeriodForm } from "@/components/admin/forms/OtherForms";
import { adminDb } from "@/lib/admin/db";

export const instant = false;

export default async function AdminNowPage() {
  const supabase = await adminDb();
  const { data: periods } = await supabase
    .from("life_periods")
    .select("*, life_period_items(*)")
    .order("effective_from", { ascending: false });

  return (
    <AdminShell title="Currently" description="Historical snapshots — updating creates a new period and closes the previous one.">
      <LifePeriodForm />
      <section className="mt-10 space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--text-muted)]">History</h2>
        {(periods ?? []).map((period) => (
          <div key={period.id} className="surface-card p-5">
            <p className="text-sm font-medium">
              {period.effective_from}
              {period.effective_to ? ` → ${period.effective_to}` : " → present"}
              {period.is_current ? " · current" : ""}
            </p>
            <ul className="mt-3 space-y-1 text-sm text-[var(--text-secondary)]">
              {(period.life_period_items ?? []).map((item: { id: string; item_type: string; content: string }) => (
                <li key={item.id}>
                  <span className="text-[var(--text-muted)]">{item.item_type}:</span> {item.content}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>
    </AdminShell>
  );
}