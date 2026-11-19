"use server";

import { revalidatePublicContent } from "@/lib/admin/revalidate-public";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin/auth";
import { slugify } from "@/lib/slug";

export async function saveInterest(formData: FormData) {
  const { supabase } = await requireAdmin();
  const id = formData.get("id")?.toString();
  const title = formData.get("title")?.toString()?.trim();
  if (!title) throw new Error("Title required");

  const highlights = (formData.get("highlights")?.toString() ?? "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  const payload = {
    title,
    slug: slugify(formData.get("slug")?.toString() || title),
    tagline: formData.get("tagline")?.toString() ?? "",
    description: formData.get("description")?.toString() ?? "",
    icon: formData.get("icon")?.toString() ?? "sparkles",
    gradient_class:
      formData.get("gradient_class")?.toString() ?? "from-violet-500/15 to-transparent",
    accent_color: formData.get("accent_color")?.toString() ?? "#8b7cf8",
    is_public: formData.get("is_public") === "on",
    sort_order: Number(formData.get("sort_order") ?? 0),
    updated_at: new Date().toISOString(),
  };

  let interestId = id;
  if (id) {
    const { error } = await supabase.from("interests").update(payload).eq("id", id);
    if (error) throw new Error(error.message);
  } else {
    const { data, error } = await supabase
      .from("interests")
      .insert(payload)
      .select("id")
      .single();
    if (error) throw new Error(error.message);
    interestId = data.id;
  }

  if (!interestId) throw new Error("Missing interest id");

  await supabase.from("interest_highlights").delete().eq("interest_id", interestId);
  if (highlights.length) {
    const { error } = await supabase.from("interest_highlights").insert(
      highlights.map((content, sort_order) => ({
        interest_id: interestId,
        content,
        sort_order,
      })),
    );
    if (error) throw new Error(error.message);
  }

  revalidatePublicContent("/", `/interests/${payload.slug}`);
  redirect("/admin/interests");
}

export async function deleteInterest(formData: FormData) {
  const { supabase } = await requireAdmin();
  const id = formData.get("id")?.toString();
  if (!id) throw new Error("Missing id");
  await supabase.from("interests").delete().eq("id", id);
  revalidatePublicContent("/");
  redirect("/admin/interests");
}