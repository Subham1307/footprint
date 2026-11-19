"use server";

import { revalidatePublicContent } from "@/lib/admin/revalidate-public";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin/auth";
import { slugify } from "@/lib/slug";

export async function savePlace(formData: FormData) {
  const { supabase } = await requireAdmin();
  const id = formData.get("id")?.toString();
  const name = formData.get("name")?.toString()?.trim();
  if (!name) throw new Error("Name required");

  const payload = {
    name,
    slug: slugify(formData.get("slug")?.toString() || name),
    region: formData.get("region")?.toString() ?? "",
    country: formData.get("country")?.toString() ?? "",
    description: formData.get("description")?.toString() ?? "",
    mood: formData.get("mood")?.toString() ?? "",
    gradient_class: formData.get("gradient_class")?.toString() ?? "from-slate-800 to-slate-950",
    place_status: formData.get("place_status")?.toString() as "visited" | "wishlist",
    is_public: formData.get("is_public") === "on",
    first_visited_date: formData.get("first_visited_date")?.toString() || null,
    updated_at: new Date().toISOString(),
  };

  if (id) {
    const { error } = await supabase.from("places").update(payload).eq("id", id);
    if (error) throw new Error(error.message);
  } else {
    const { error } = await supabase
      .from("places")
      .insert({ ...payload, recorded_at: new Date().toISOString() });
    if (error) throw new Error(error.message);
  }

  revalidatePublicContent("/places", "/");
  redirect("/admin/places");
}

export async function deletePlace(formData: FormData) {
  const { supabase } = await requireAdmin();
  const id = formData.get("id")?.toString();
  if (!id) throw new Error("Missing id");
  await supabase.from("places").delete().eq("id", id);
  revalidatePublicContent("/places", "/");
  redirect("/admin/places");
}