"use server";

import { revalidatePublicContent } from "@/lib/admin/revalidate-public";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin/auth";

export async function saveDigitalItem(formData: FormData) {
  const { supabase } = await requireAdmin();
  const id = formData.get("id")?.toString();
  const name = formData.get("name")?.toString()?.trim();
  if (!name) throw new Error("Name required");

  const payload = {
    name,
    detail: formData.get("detail")?.toString() ?? "",
    category: formData.get("category")?.toString() as "device" | "os" | "software" | "devtool",
    is_public: formData.get("is_public") === "on",
    valid_from: formData.get("valid_from")?.toString() || null,
    valid_to: formData.get("valid_to")?.toString() || null,
    sort_order: Number(formData.get("sort_order") ?? 0),
    updated_at: new Date().toISOString(),
  };

  if (id) {
    const { error } = await supabase.from("digital_world_items").update(payload).eq("id", id);
    if (error) throw new Error(error.message);
  } else {
    const { error } = await supabase
      .from("digital_world_items")
      .insert({ ...payload, recorded_at: new Date().toISOString() });
    if (error) throw new Error(error.message);
  }

  revalidatePublicContent("/");
  redirect("/admin/digital-world");
}

export async function deleteDigitalItem(formData: FormData) {
  const { supabase } = await requireAdmin();
  const id = formData.get("id")?.toString();
  if (!id) throw new Error("Missing id");
  await supabase.from("digital_world_items").delete().eq("id", id);
  revalidatePublicContent("/");
  redirect("/admin/digital-world");
}