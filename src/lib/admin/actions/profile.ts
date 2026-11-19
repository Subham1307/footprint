"use server";

import { revalidatePublicContent } from "@/lib/admin/revalidate-public";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin/auth";

export async function saveSiteProfile(formData: FormData) {
  const { supabase } = await requireAdmin();

  const payload = {
    owner_name: formData.get("owner_name")?.toString() ?? "",
    wordmark: formData.get("wordmark")?.toString() ?? "",
    site_name: formData.get("site_name")?.toString() ?? "",
    email: formData.get("email")?.toString() ?? "",
    tagline: formData.get("tagline")?.toString() ?? "",
    about_markdown: formData.get("about_markdown")?.toString() ?? "",
    availability_label: formData.get("availability_label")?.toString() ?? "",
    timezone: formData.get("timezone")?.toString() ?? "Asia/Kolkata",
    copyright_year: Number(formData.get("copyright_year") ?? new Date().getFullYear()),
    is_public: formData.get("is_public") === "on",
    updated_at: new Date().toISOString(),
  };

  const { data: existing } = await supabase.from("site_profile").select("id, *").limit(1).maybeSingle();

  if (existing) {
    await supabase.from("site_profile_versions").insert({
      owner_name: existing.owner_name,
      wordmark: existing.wordmark,
      site_name: existing.site_name,
      email: existing.email,
      tagline: existing.tagline,
      about_markdown: existing.about_markdown,
      availability_label: existing.availability_label,
      timezone: existing.timezone,
      effective_from: (existing.updated_at ?? existing.created_at ?? new Date().toISOString()).slice(0, 10),
      effective_to: new Date().toISOString().slice(0, 10),
      reason: "Profile updated via admin",
    });
    const { error } = await supabase.from("site_profile").update(payload).eq("id", existing.id);
    if (error) throw new Error(error.message);
  } else {
    const { error } = await supabase.from("site_profile").insert(payload);
    if (error) throw new Error(error.message);
  }

  revalidatePublicContent("/", "/about");
  redirect("/admin/profile");
}