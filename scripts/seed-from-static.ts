/**
 * Seeds Supabase from src/data static files.
 * Usage: npx tsx scripts/seed-from-static.ts
 * Requires NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in env.
 */
import { config } from "dotenv";
import { resolve } from "path";

config({ path: resolve(process.cwd(), ".env.local") });

import WebSocket from "ws";
import { createClient } from "@supabase/supabase-js";

// Node 20: Supabase realtime needs a WebSocket implementation for the client ctor
(globalThis as unknown as { WebSocket: typeof WebSocket }).WebSocket = WebSocket;
import { journalEntries } from "../src/data/journal";
import { timeline } from "../src/data/timeline";
import { places } from "../src/data/places";
import { collections } from "../src/data/collections";
import { interests } from "../src/data/interests";
import { digitalWorld } from "../src/data/digital-world";
import { nowItems } from "../src/data/now";
import { site } from "../src/data/site";

const url = (process.env.NEXT_PUBLIC_SUPABASE_URL ?? "")
  .replace(/\/rest\/v1\/?$/i, "")
  .replace(/\/$/, "");
const serviceKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_SECRET_KEY;

if (!url || !serviceKey) {
  console.error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY (or SUPABASE_SECRET_KEY)",
  );
  process.exit(1);
}

const supabase = createClient(url, serviceKey, { auth: { persistSession: false } });

function failOnError(label: string, error: { message: string } | null) {
  if (error) {
    console.error(`${label}:`, error.message);
    process.exit(1);
  }
}

async function main() {
  const { error: profileError } = await supabase.from("site_profile").upsert({
    owner_name: site.owner,
    wordmark: site.wordmark,
    site_name: site.name,
    email: site.email,
    tagline: site.tagline,
    availability_label: "Open to interesting conversations",
    timezone: "Asia/Kolkata",
    copyright_year: site.copyrightYear,
    is_public: true,
  });
  failOnError("site_profile", profileError);

  for (const entry of journalEntries) {
    const { data: row } = await supabase
      .from("journal_entries")
      .upsert(
        {
          slug: entry.slug,
          title: entry.title,
          excerpt: entry.excerpt,
          body_markdown: entry.body,
          category: entry.category,
          status: "published",
          is_public: true,
          event_date: entry.publishedAt,
        },
        { onConflict: "slug" },
      )
      .select("id")
      .single();
    if (row) {
      await supabase.from("journal_entry_tags").delete().eq("journal_entry_id", row.id);
    }
  }

  for (const m of timeline) {
    await supabase.from("memories").insert({
      title: m.title,
      description: m.description,
      event_date: `${m.year}-06-15`,
      category: m.type,
      is_public: true,
    });
  }

  for (const p of places) {
    await supabase.from("places").upsert(
      {
        slug: p.id,
        name: p.name,
        region: p.region,
        description: p.description,
        mood: p.mood,
        gradient_class: p.gradient,
        place_status: p.category,
        is_public: true,
      },
      { onConflict: "slug" },
    );
  }

  for (const c of collections) {
    const { data: item } = await supabase
      .from("collection_items")
      .insert({
        title: c.title,
        description: c.description,
        item_type: c.type,
        external_url: c.url ?? null,
        is_public: true,
      })
      .select("id")
      .single();
    if (item && c.tags.length) {
      await supabase.from("collection_item_tags").insert(
        c.tags.map((tag) => ({ collection_item_id: item.id, tag })),
      );
    }
  }

  for (const interest of interests) {
    const { data: row } = await supabase
      .from("interests")
      .upsert(
        {
          slug: interest.slug,
          title: interest.title,
          tagline: interest.tagline,
          description: interest.description,
          icon: interest.icon,
          gradient_class: interest.gradient,
          accent_color: interest.accent,
          is_public: true,
        },
        { onConflict: "slug" },
      )
      .select("id")
      .single();
    if (row) {
      await supabase.from("interest_highlights").delete().eq("interest_id", row.id);
      await supabase.from("interest_highlights").insert(
        interest.highlights.map((content, sort_order) => ({
          interest_id: row.id,
          content,
          sort_order,
        })),
      );
    }
  }

  for (const d of digitalWorld) {
    await supabase.from("digital_world_items").insert({
      name: d.name,
      detail: d.detail,
      category: d.category,
      is_public: true,
    });
  }

  const { data: existingPeriod } = await supabase
    .from("life_periods")
    .select("id")
    .eq("is_current", true)
    .maybeSingle();

  if (!existingPeriod) {
    const { data: period } = await supabase
      .from("life_periods")
      .insert({
        label: "Initial import",
        effective_from: "2026-01-01",
        is_current: true,
      })
      .select("id")
      .single();
    if (period) {
      await supabase.from("life_period_items").insert(
        nowItems.map((item, sort_order) => ({
          period_id: period.id,
          item_type:
            item.id === "learning"
              ? "learning"
              : item.id === "building"
                ? "building"
                : item.id === "focus"
                  ? "focus"
                  : "interests",
          label: item.label,
          content: item.value,
          sort_order,
        })),
      );
    }
  }

  console.log("Seed complete.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});