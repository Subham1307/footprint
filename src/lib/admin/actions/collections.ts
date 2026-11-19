"use server";

import { revalidatePublicContent } from "@/lib/admin/revalidate-public";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin/auth";

export async function saveCollectionItem(formData: FormData) {
  const { supabase } = await requireAdmin();
  const id = formData.get("id")?.toString();
  const title = formData.get("title")?.toString()?.trim();
  if (!title) throw new Error("Title required");

  const tags = (formData.get("tags")?.toString() ?? "")
    .split(",")
    .map((t) => t.trim().toLowerCase())
    .filter(Boolean);

  const payload = {
    title,
    description: formData.get("description")?.toString() ?? "",
    item_type: formData.get("item_type")?.toString() ?? "discovery",
    external_url: formData.get("external_url")?.toString() || null,
    personal_rating: formData.get("personal_rating")
      ? Number(formData.get("personal_rating"))
      : null,
    notes: formData.get("notes")?.toString() ?? "",
    is_public: formData.get("is_public") === "on",
    event_date: formData.get("event_date")?.toString() || null,
    updated_at: new Date().toISOString(),
  };

  let itemId = id;
  if (id) {
    const { error } = await supabase.from("collection_items").update(payload).eq("id", id);
    if (error) throw new Error(error.message);
  } else {
    const { data, error } = await supabase
      .from("collection_items")
      .insert({ ...payload, recorded_at: new Date().toISOString() })
      .select("id")
      .single();
    if (error) throw new Error(error.message);
    itemId = data.id;
  }

  if (!itemId) throw new Error("Missing item id");
  await supabase.from("collection_item_tags").delete().eq("collection_item_id", itemId);
  if (tags.length) {
    await supabase
      .from("collection_item_tags")
      .insert(tags.map((tag) => ({ collection_item_id: itemId, tag })));
  }

  revalidatePublicContent("/collections", "/");
  redirect("/admin/collections");
}

export async function deleteCollectionItem(formData: FormData) {
  const { supabase } = await requireAdmin();
  const id = formData.get("id")?.toString();
  if (!id) throw new Error("Missing id");
  await supabase.from("collection_items").delete().eq("id", id);
  revalidatePublicContent("/collections", "/");
  redirect("/admin/collections");
}