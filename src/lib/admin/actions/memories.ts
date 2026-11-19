"use server";

import { revalidatePublicContent } from "@/lib/admin/revalidate-public";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin/auth";

export async function saveMemory(formData: FormData) {
  const { supabase } = await requireAdmin();
  const id = formData.get("id")?.toString();
  const title = formData.get("title")?.toString()?.trim();
  const description = formData.get("description")?.toString() ?? "";
  const eventDate = formData.get("event_date")?.toString();
  const location = formData.get("location")?.toString() ?? "";
  const category = formData.get("category")?.toString();
  const isPublic = formData.get("is_public") === "on";

  if (!title || !eventDate || !category) throw new Error("Missing required fields");

  const payload = {
    title,
    description,
    event_date: eventDate,
    location,
    category,
    is_public: isPublic,
    updated_at: new Date().toISOString(),
  };

  if (id) {
    const { error } = await supabase.from("memories").update(payload).eq("id", id);
    if (error) throw new Error(error.message);
  } else {
    const { error } = await supabase
      .from("memories")
      .insert({ ...payload, recorded_at: new Date().toISOString() });
    if (error) throw new Error(error.message);
  }

  revalidatePublicContent("/", "/archive");
  redirect("/admin/memories");
}

export async function deleteMemory(formData: FormData) {
  const { supabase } = await requireAdmin();
  const id = formData.get("id")?.toString();
  if (!id) throw new Error("Missing id");
  await supabase.from("memories").delete().eq("id", id);
  revalidatePublicContent("/");
  redirect("/admin/memories");
}