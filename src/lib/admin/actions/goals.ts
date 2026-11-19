"use server";

import { revalidatePublicContent } from "@/lib/admin/revalidate-public";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin/auth";

export async function saveGoal(formData: FormData) {
  const { supabase } = await requireAdmin();
  const id = formData.get("id")?.toString();
  const title = formData.get("title")?.toString()?.trim();
  if (!title) throw new Error("Title required");

  const newStatus = formData.get("status")?.toString() ?? "active";
  const statusNote = formData.get("status_note")?.toString() ?? "";

  let previousStatus: string | null = null;
  if (id) {
    const { data } = await supabase.from("goals").select("status").eq("id", id).single();
    previousStatus = data?.status ?? null;
  }

  const payload = {
    title,
    description: formData.get("description")?.toString() ?? "",
    goal_type: formData.get("goal_type")?.toString() ?? "personal",
    status: newStatus,
    target_date: formData.get("target_date")?.toString() || null,
    started_on: formData.get("started_on")?.toString() || null,
    completed_on:
      newStatus === "completed"
        ? formData.get("completed_on")?.toString() || new Date().toISOString().slice(0, 10)
        : null,
    is_public: formData.get("is_public") === "on",
    updated_at: new Date().toISOString(),
  };

  let goalId = id;
  if (id) {
    const { error } = await supabase.from("goals").update(payload).eq("id", id);
    if (error) throw new Error(error.message);
  } else {
    const { data, error } = await supabase
      .from("goals")
      .insert({ ...payload, recorded_at: new Date().toISOString() })
      .select("id")
      .single();
    if (error) throw new Error(error.message);
    goalId = data.id;
    previousStatus = null;
  }

  if (goalId && previousStatus !== newStatus) {
    await supabase.from("goal_status_events").insert({
      goal_id: goalId,
      from_status: previousStatus,
      to_status: newStatus,
      note: statusNote || null,
    });
  }

  revalidatePublicContent("/archive");
  redirect("/admin/goals");
}

export async function deleteGoal(formData: FormData) {
  const { supabase } = await requireAdmin();
  const id = formData.get("id")?.toString();
  if (!id) throw new Error("Missing id");
  await supabase.from("goals").delete().eq("id", id);
  redirect("/admin/goals");
}