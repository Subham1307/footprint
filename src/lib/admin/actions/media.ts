"use server";

import { randomUUID } from "crypto";
import { revalidatePublicContent } from "@/lib/admin/revalidate-public";
import { requireAdmin } from "@/lib/admin/auth";
import { getSupabaseUrl } from "@/lib/supabase/config";

export async function uploadMedia(formData: FormData) {
  const { supabase, user } = await requireAdmin();
  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    throw new Error("No file provided");
  }

  if (file.size > 8 * 1024 * 1024) {
    throw new Error("File exceeds 8MB limit");
  }

  const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif"];
  if (!allowed.includes(file.type)) {
    throw new Error("Unsupported file type");
  }

  const storagePath = `uploads/${randomUUID()}-${file.name.replace(/\s+/g, "-")}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  const { error: uploadError } = await supabase.storage
    .from("footprint-media")
    .upload(storagePath, buffer, { contentType: file.type, upsert: false });

  if (uploadError) throw new Error(uploadError.message);

  const publicUrl = `${getSupabaseUrl()}/storage/v1/object/public/footprint-media/${storagePath}`;

  const { data, error } = await supabase
    .from("media_assets")
    .insert({
      storage_path: storagePath,
      filename: file.name,
      mime_type: file.type,
      size_bytes: file.size,
      public_url: publicUrl,
      uploaded_by: user.id,
    })
    .select("id, public_url, storage_path, filename")
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function attachJournalMedia(formData: FormData) {
  const { supabase } = await requireAdmin();
  const journalId = formData.get("journal_id")?.toString();
  const mediaId = formData.get("media_id")?.toString();
  if (!journalId || !mediaId) throw new Error("Missing ids");
  const { error } = await supabase.from("journal_entry_media").insert({
    journal_entry_id: journalId,
    media_id: mediaId,
  });
  if (error) throw new Error(error.message);
}

export async function attachPlaceMedia(formData: FormData) {
  const { supabase } = await requireAdmin();
  const placeId = formData.get("place_id")?.toString();
  const mediaId = formData.get("media_id")?.toString();
  if (!placeId || !mediaId) throw new Error("Missing ids");
  const { error } = await supabase.from("place_media").insert({
    place_id: placeId,
    media_id: mediaId,
  });
  if (error) throw new Error(error.message);
}

export async function attachMemoryMedia(formData: FormData) {
  const { supabase } = await requireAdmin();
  const memoryId = formData.get("memory_id")?.toString();
  const mediaId = formData.get("media_id")?.toString();
  if (!memoryId || !mediaId) throw new Error("Missing ids");
  const { error } = await supabase.from("memory_media").insert({
    memory_id: memoryId,
    media_id: mediaId,
  });
  if (error) throw new Error(error.message);
}

export async function detachEntityMedia(formData: FormData) {
  const { supabase } = await requireAdmin();
  const entityType = formData.get("entity_type")?.toString();
  const entityId = formData.get("entity_id")?.toString();
  const mediaId = formData.get("media_id")?.toString();
  if (!entityType || !entityId || !mediaId) throw new Error("Missing fields");

  const table =
    entityType === "journal"
      ? "journal_entry_media"
      : entityType === "place"
        ? "place_media"
        : entityType === "memory"
          ? "memory_media"
          : null;
  if (!table) throw new Error("Invalid entity type");

  const col =
    entityType === "journal" ? "journal_entry_id" : entityType === "place" ? "place_id" : "memory_id";

  const { error } = await supabase.from(table).delete().eq(col, entityId).eq("media_id", mediaId);
  if (error) throw new Error(error.message);
  revalidatePublicContent("/admin", "/", "/journal", "/places");
}