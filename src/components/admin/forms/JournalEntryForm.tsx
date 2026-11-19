"use client";

import { saveJournalEntry } from "@/lib/admin/actions/journal";
import { RichTextBodyField } from "@/components/admin/RichTextBodyField";
import { CheckRow, Field, FormCard, Select, TextArea, TextInput } from "@/components/admin/AdminForm";

type Initial = {
  id?: string;
  title?: string;
  slug?: string;
  excerpt?: string;
  body?: string;
  category?: string;
  status?: string;
  is_public?: boolean;
  event_date?: string;
  tags?: string;
};

export function JournalEntryForm({ initial }: { initial: Initial }) {
  return (
    <FormCard action={saveJournalEntry} title={initial.id ? "Edit entry" : "Create entry"}>
      {initial.id ? <input type="hidden" name="id" value={initial.id} /> : null}
      <Field label="Title">
        <TextInput name="title" required defaultValue={initial.title} />
      </Field>
      <Field label="Slug" hint="Leave blank to auto-generate from title.">
        <TextInput name="slug" defaultValue={initial.slug} />
      </Field>
      <div className="grid gap-4 md:grid-cols-3">
        <Field label="Event date (when it happened)">
          <TextInput name="event_date" type="date" required defaultValue={initial.event_date} />
        </Field>
        <Field label="Category">
          <Select name="category" defaultValue={initial.category ?? "thought"}>
            <option value="thought">Thought</option>
            <option value="idea">Idea</option>
            <option value="observation">Observation</option>
            <option value="reflection">Reflection</option>
          </Select>
        </Field>
        <Field label="Status">
          <Select name="status" defaultValue={initial.status ?? "published"}>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </Select>
        </Field>
      </div>
      <Field label="Excerpt">
        <TextArea name="excerpt" rows={2} defaultValue={initial.excerpt} />
      </Field>
      <Field label="Body">
        <RichTextBodyField defaultValue={initial.body ?? ""} />
      </Field>
      <Field label="Tags" hint="Comma-separated">
        <TextInput name="tags" defaultValue={initial.tags} />
      </Field>
      <CheckRow name="is_public" label="Visible on public site" defaultChecked={initial.is_public ?? true} />
    </FormCard>
  );
}