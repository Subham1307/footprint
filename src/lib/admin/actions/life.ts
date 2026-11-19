"use server";

import { revalidatePublicContent } from "@/lib/admin/revalidate-public";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin/auth";

const ITEM_TYPES = [
  "learning",
  "building",
  "focus",
  "interests",
  "goals",
  "book",
  "movie",
  "show",
  "routine",
] as const;

export async function startNewLifePeriod(formData: FormData) {
  const { supabase } = await requireAdmin();
  const effectiveFrom = formData.get("effective_from")?.toString() ?? new Date().toISOString().slice(0, 10);
  const label = formData.get("label")?.toString() ?? "";

  const { data: current } = await supabase
    .from("life_periods")
    .select("id")
    .eq("is_current", true)
    .maybeSingle();

  if (current) {
    await supabase
      .from("life_periods")
      .update({ is_current: false, effective_to: effectiveFrom })
      .eq("id", current.id);
  }

  const { data: period, error } = await supabase
    .from("life_periods")
    .insert({
      label,
      effective_from: effectiveFrom,
      is_current: true,
      recorded_at: new Date().toISOString(),
    })
    .select("id")
    .single();

  if (error || !period) throw new Error(error?.message ?? "Failed to create period");

  const items = ITEM_TYPES.flatMap((type) => {
    const content = formData.get(`item_${type}`)?.toString()?.trim();
    if (!content) return [];
    return [
      {
        period_id: period.id,
        item_type: type,
        content,
        label: formData.get(`label_${type}`)?.toString() ?? null,
        sort_order: ITEM_TYPES.indexOf(type),
      },
    ];
  });

  if (items.length) {
    const { error: itemsError } = await supabase.from("life_period_items").insert(items);
    if (itemsError) throw new Error(itemsError.message);
  }

  revalidatePublicContent("/");
  redirect("/admin/now");
}