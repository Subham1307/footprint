"use server";

import { revalidatePublicContent } from "@/lib/admin/revalidate-public";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin/auth";
import { slugify } from "@/lib/slug";

function parseTags(raw: string): string[] {
  return raw
    .split(",")
    .map((t) => t.trim().toLowerCase())
    .filter(Boolean);
}

export async function saveJournalEntry(formData: FormData) {
  const { supabase } = await requireAdmin();

  const id = formData.get("id")?.toString();
  const title = formData.get("title")?.toString()?.trim();
  const body = formData.get("body")?.toString() ?? "";
  const excerpt = formData.get("excerpt")?.toString()?.trim() ?? "";
  const category = formData.get("category")?.toString() as
    | "thought"
    | "idea"
    | "observation"
    | "reflection";
  const status = formData.get("status")?.toString() as "draft" | "published" | "archived";
  const isPublic = formData.get("is_public") === "on";
  const eventDate = formData.get("event_date")?.toString();
  const tags = parseTags(formData.get("tags")?.toString() ?? "");

  if (!title || !category || !status || !eventDate) {
    throw new Error("Missing required fields");
  }

  const slugBase = slugify(formData.get("slug")?.toString() || title);
  const payload = {
    title,
    slug: slugBase,
    body_markdown: body,
    excerpt,
    category,
    status,
    is_public: isPublic,
    event_date: eventDate,
    updated_at: new Date().toISOString(),
  };

  let entryId = id;
  if (id) {
    const { error } = await supabase.from("journal_entries").update(payload).eq("id", id);
    if (error) throw new Error(error.message);
  } else {
    const { data, error } = await supabase
      .from("journal_entries")
      .insert({ ...payload, recorded_at: new Date().toISOString() })
      .select("id")
      .single();
    if (error) throw new Error(error.message);
    entryId = data.id;
  }

  if (!entryId) throw new Error("Could not resolve entry id");

  await supabase.from("journal_entry_tags").delete().eq("journal_entry_id", entryId);
  if (tags.length) {
    const { error } = await supabase.from("journal_entry_tags").insert(
      tags.map((tag) => ({ journal_entry_id: entryId, tag })),
    );
    if (error) throw new Error(error.message);
  }

  revalidatePublicContent("/", "/journal", "/archive");
  redirect("/admin/journal");
}

export async function deleteJournalEntry(formData: FormData) {
  const { supabase } = await requireAdmin();
  const id = formData.get("id")?.toString();
  if (!id) throw new Error("Missing id");
  const { error } = await supabase.from("journal_entries").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePublicContent("/journal", "/");
  redirect("/admin/journal");
}