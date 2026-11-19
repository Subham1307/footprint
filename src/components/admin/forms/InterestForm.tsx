import { saveInterest } from "@/lib/admin/actions/interests";
import { CheckRow, Field, FormCard, TextArea, TextInput } from "@/components/admin/AdminForm";

const iconOptions = [
  "sparkles",
  "cpu",
  "trophy",
  "mountain",
  "dumbbell",
  "music",
  "clapperboard",
  "line-chart",
  "book-open",
];

export function InterestForm({ initial }: { initial: Record<string, unknown> }) {
  const highlights =
    Array.isArray(initial.highlights)
      ? (initial.highlights as string[]).join("\n")
      : String(initial.highlightsText ?? "");

  return (
    <FormCard action={saveInterest} title={initial.id ? "Edit interest" : "New interest"}>
      {initial.id ? <input type="hidden" name="id" value={String(initial.id)} /> : null}
      <Field label="Title">
        <TextInput name="title" required defaultValue={String(initial.title ?? "")} />
      </Field>
      <Field label="Slug">
        <TextInput name="slug" defaultValue={String(initial.slug ?? "")} />
      </Field>
      <Field label="Tagline">
        <TextInput name="tagline" defaultValue={String(initial.tagline ?? "")} />
      </Field>
      <Field label="Description">
        <TextArea name="description" rows={4} defaultValue={String(initial.description ?? "")} />
      </Field>
      <div className="grid gap-4 md:grid-cols-3">
        <Field label="Icon key">
          <select
            name="icon"
            defaultValue={String(initial.icon ?? "sparkles")}
            className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg-subtle)]/50 px-3 py-2.5 text-sm"
          >
            {iconOptions.map((icon) => (
              <option key={icon} value={icon}>
                {icon}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Accent color">
          <TextInput name="accent_color" defaultValue={String(initial.accent_color ?? "#8b7cf8")} />
        </Field>
        <Field label="Sort order">
          <TextInput name="sort_order" type="number" defaultValue={String(initial.sort_order ?? "0")} />
        </Field>
      </div>
      <Field label="Gradient (Tailwind classes)">
        <TextInput
          name="gradient_class"
          defaultValue={String(initial.gradient_class ?? "from-violet-500/15 to-transparent")}
        />
      </Field>
      <Field label="Highlights" hint="One per line — shown on the interest page">
        <TextArea name="highlights" rows={5} defaultValue={highlights} />
      </Field>
      <CheckRow name="is_public" label="Public" defaultChecked={Boolean(initial.is_public ?? true)} />
    </FormCard>
  );
}