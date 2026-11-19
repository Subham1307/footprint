import { saveMemory } from "@/lib/admin/actions/memories";
import { startNewLifePeriod } from "@/lib/admin/actions/life";
import { savePlace } from "@/lib/admin/actions/places";
import { saveCollectionItem } from "@/lib/admin/actions/collections";
import { saveGoal } from "@/lib/admin/actions/goals";
import { saveSiteProfile } from "@/lib/admin/actions/profile";
import { saveDigitalItem } from "@/lib/admin/actions/digital";
import { CheckRow, Field, FormCard, Select, TextArea, TextInput } from "@/components/admin/AdminForm";

export function MemoryForm({ initial }: { initial: Record<string, unknown> }) {
  return (
    <FormCard action={saveMemory}>
      {initial.id ? <input type="hidden" name="id" value={String(initial.id)} /> : null}
      <Field label="Title"><TextInput name="title" required defaultValue={String(initial.title ?? "")} /></Field>
      <Field label="Event date"><TextInput name="event_date" type="date" required defaultValue={String(initial.event_date ?? "")} /></Field>
      <Field label="Location"><TextInput name="location" defaultValue={String(initial.location ?? "")} /></Field>
      <Field label="Category">
        <Select name="category" defaultValue={String(initial.category ?? "memory")}>
          <option value="milestone">Milestone</option>
          <option value="trip">Trip</option>
          <option value="memory">Memory</option>
          <option value="shift">Shift</option>
        </Select>
      </Field>
      <Field label="Description"><TextArea name="description" rows={5} defaultValue={String(initial.description ?? "")} /></Field>
      <CheckRow name="is_public" label="Public" defaultChecked={Boolean(initial.is_public ?? true)} />
    </FormCard>
  );
}

export function LifePeriodForm() {
  const types = ["learning", "building", "focus", "interests", "goals", "book", "movie", "show", "routine"] as const;
  return (
    <FormCard action={startNewLifePeriod} title="Start new “Currently” snapshot">
      <p className="text-sm text-[var(--text-secondary)]">
        Closes the current period and preserves it in history. New items apply from the effective date.
      </p>
      <Field label="Effective from">
        <TextInput name="effective_from" type="date" defaultValue="2026-11-19" required />
      </Field>
      <Field label="Period label (optional)"><TextInput name="label" placeholder="Late 2026 focus" /></Field>
      {types.map((type) => (
        <Field key={type} label={type}>
          <TextArea name={`item_${type}`} rows={2} />
        </Field>
      ))}
    </FormCard>
  );
}

export function PlaceForm({ initial }: { initial: Record<string, unknown> }) {
  return (
    <FormCard action={savePlace}>
      {initial.id ? <input type="hidden" name="id" value={String(initial.id)} /> : null}
      <Field label="Name"><TextInput name="name" required defaultValue={String(initial.name ?? "")} /></Field>
      <Field label="Slug"><TextInput name="slug" defaultValue={String(initial.slug ?? "")} /></Field>
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Region"><TextInput name="region" defaultValue={String(initial.region ?? "")} /></Field>
        <Field label="Country"><TextInput name="country" defaultValue={String(initial.country ?? "")} /></Field>
      </div>
      <Field label="Status">
        <Select name="place_status" defaultValue={String(initial.place_status ?? "visited")}>
          <option value="visited">Visited</option>
          <option value="wishlist">Wishlist</option>
        </Select>
      </Field>
      <Field label="First visited"><TextInput name="first_visited_date" type="date" defaultValue={String(initial.first_visited_date ?? "")} /></Field>
      <Field label="Mood"><TextInput name="mood" defaultValue={String(initial.mood ?? "")} /></Field>
      <Field label="Gradient classes (Tailwind)"><TextInput name="gradient_class" defaultValue={String(initial.gradient_class ?? "from-slate-800 to-slate-950")} /></Field>
      <Field label="Description"><TextArea name="description" rows={4} defaultValue={String(initial.description ?? "")} /></Field>
      <CheckRow name="is_public" label="Public" defaultChecked={Boolean(initial.is_public ?? true)} />
    </FormCard>
  );
}

export function CollectionForm({ initial }: { initial: Record<string, unknown> }) {
  return (
    <FormCard action={saveCollectionItem}>
      {initial.id ? <input type="hidden" name="id" value={String(initial.id)} /> : null}
      <Field label="Title"><TextInput name="title" required defaultValue={String(initial.title ?? "")} /></Field>
      <Field label="Type">
        <Select name="item_type" defaultValue={String(initial.item_type ?? "discovery")}>
          {["website","tool","book","article","music","movie","show","software","gadget","discovery"].map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </Select>
      </Field>
      <Field label="Event / discovered date"><TextInput name="event_date" type="date" defaultValue={String(initial.event_date ?? "")} /></Field>
      <Field label="URL"><TextInput name="external_url" type="url" defaultValue={String(initial.external_url ?? "")} /></Field>
      <Field label="Rating (1-5)"><TextInput name="personal_rating" type="number" min={1} max={5} defaultValue={String(initial.personal_rating ?? "")} /></Field>
      <Field label="Description"><TextArea name="description" rows={3} defaultValue={String(initial.description ?? "")} /></Field>
      <Field label="Notes"><TextArea name="notes" rows={3} defaultValue={String(initial.notes ?? "")} /></Field>
      <Field label="Tags"><TextInput name="tags" defaultValue={String(initial.tags ?? "")} /></Field>
      <CheckRow name="is_public" label="Public" defaultChecked={Boolean(initial.is_public ?? true)} />
    </FormCard>
  );
}

export function GoalForm({ initial }: { initial: Record<string, unknown> }) {
  return (
    <FormCard action={saveGoal}>
      {initial.id ? <input type="hidden" name="id" value={String(initial.id)} /> : null}
      <Field label="Title"><TextInput name="title" required defaultValue={String(initial.title ?? "")} /></Field>
      <Field label="Description"><TextArea name="description" rows={3} defaultValue={String(initial.description ?? "")} /></Field>
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Type">
          <Select name="goal_type" defaultValue={String(initial.goal_type ?? "personal")}>
            <option value="personal">Personal</option>
            <option value="professional">Professional</option>
          </Select>
        </Field>
        <Field label="Status">
          <Select name="status" defaultValue={String(initial.status ?? "active")}>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
            <option value="paused">Paused</option>
            <option value="abandoned">Abandoned</option>
          </Select>
        </Field>
      </div>
      <Field label="Status change note"><TextInput name="status_note" placeholder="Why you paused / completed / abandoned" /></Field>
      <div className="grid gap-4 md:grid-cols-3">
        <Field label="Started"><TextInput name="started_on" type="date" defaultValue={String(initial.started_on ?? "")} /></Field>
        <Field label="Target"><TextInput name="target_date" type="date" defaultValue={String(initial.target_date ?? "")} /></Field>
        <Field label="Completed"><TextInput name="completed_on" type="date" defaultValue={String(initial.completed_on ?? "")} /></Field>
      </div>
      <CheckRow name="is_public" label="Show on public archive" defaultChecked={Boolean(initial.is_public ?? false)} />
    </FormCard>
  );
}

export function ProfileForm({ initial }: { initial: Record<string, unknown> }) {
  return (
    <FormCard action={saveSiteProfile} title="Site profile & about">
      <Field label="Owner name"><TextInput name="owner_name" defaultValue={String(initial.owner_name ?? "")} required /></Field>
      <Field label="Wordmark"><TextInput name="wordmark" defaultValue={String(initial.wordmark ?? "")} /></Field>
      <Field label="Site name"><TextInput name="site_name" defaultValue={String(initial.site_name ?? "")} /></Field>
      <Field label="Email"><TextInput name="email" type="email" defaultValue={String(initial.email ?? "")} /></Field>
      <Field label="Tagline"><TextArea name="tagline" rows={2} defaultValue={String(initial.tagline ?? "")} /></Field>
      <Field label="About (Markdown)"><TextArea name="about_markdown" rows={8} defaultValue={String(initial.about_markdown ?? "")} /></Field>
      <Field label="Availability label"><TextInput name="availability_label" defaultValue={String(initial.availability_label ?? "")} /></Field>
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Timezone"><TextInput name="timezone" defaultValue={String(initial.timezone ?? "Asia/Kolkata")} /></Field>
        <Field label="Copyright year"><TextInput name="copyright_year" type="number" defaultValue={String(initial.copyright_year ?? "2026")} /></Field>
      </div>
      <CheckRow name="is_public" label="Public profile" defaultChecked={Boolean(initial.is_public ?? true)} />
    </FormCard>
  );
}

export function DigitalWorldForm({ initial }: { initial: Record<string, unknown> }) {
  return (
    <FormCard action={saveDigitalItem}>
      {initial.id ? <input type="hidden" name="id" value={String(initial.id)} /> : null}
      <Field label="Name"><TextInput name="name" required defaultValue={String(initial.name ?? "")} /></Field>
      <Field label="Category">
        <Select name="category" defaultValue={String(initial.category ?? "software")}>
          <option value="device">Device</option>
          <option value="os">OS</option>
          <option value="software">Software</option>
          <option value="devtool">Dev tool</option>
        </Select>
      </Field>
      <Field label="Detail"><TextArea name="detail" rows={2} defaultValue={String(initial.detail ?? "")} /></Field>
      <div className="grid gap-4 md:grid-cols-3">
        <Field label="Valid from"><TextInput name="valid_from" type="date" defaultValue={String(initial.valid_from ?? "")} /></Field>
        <Field label="Valid to"><TextInput name="valid_to" type="date" defaultValue={String(initial.valid_to ?? "")} /></Field>
        <Field label="Sort order"><TextInput name="sort_order" type="number" defaultValue={String(initial.sort_order ?? "0")} /></Field>
      </div>
      <CheckRow name="is_public" label="Public" defaultChecked={Boolean(initial.is_public ?? true)} />
    </FormCard>
  );
}