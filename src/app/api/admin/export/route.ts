import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/auth";

const TABLES = [
  "journal_entries",
  "memories",
  "life_periods",
  "life_period_items",
  "places",
  "collection_items",
  "goals",
  "goal_status_events",
  "digital_world_items",
  "interests",
  "site_profile",
  "media_assets",
] as const;

function toCsv(rows: Record<string, unknown>[]): string {
  if (!rows.length) return "";
  const headers = Object.keys(rows[0]);
  const lines = [
    headers.join(","),
    ...rows.map((row) =>
      headers
        .map((h) => {
          const val = row[h];
          const str = val == null ? "" : String(val).replace(/"/g, '""');
          return `"${str}"`;
        })
        .join(","),
    ),
  ];
  return lines.join("\n");
}

export async function GET(request: Request) {
  try {
    const { supabase } = await requireAdmin();
    const url = new URL(request.url);
    const format = url.searchParams.get("format") ?? "json";
    const table = url.searchParams.get("table") ?? "";

    if (format === "csv" && table) {
      const { data, error } = await supabase.from(table).select("*");
      if (error) throw error;
      const csv = toCsv(data ?? []);
      return new NextResponse(csv, {
        headers: {
          "Content-Type": "text/csv; charset=utf-8",
          "Content-Disposition": `attachment; filename="footprint-${table}.csv"`,
        },
      });
    }

    const bundle: Record<string, unknown> = { exportedAt: new Date().toISOString() };
    for (const name of TABLES) {
      const { data, error } = await supabase.from(name).select("*");
      if (error) {
        bundle[name] = { error: error.message };
      } else {
        bundle[name] = data;
      }
    }

    return NextResponse.json(bundle, {
      headers: {
        "Content-Disposition": 'attachment; filename="footprint-export.json"',
      },
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Export failed" },
      { status: 401 },
    );
  }
}