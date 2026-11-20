import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/auth";
import { searchPlacesNominatim } from "@/lib/geocode/nominatim";

export async function GET(request: Request) {
  try {
    await requireAdmin();
    const q = new URL(request.url).searchParams.get("q")?.trim() ?? "";
    if (q.length < 2) {
      return NextResponse.json({ results: [] });
    }
    const results = await searchPlacesNominatim(q);
    return NextResponse.json({ results });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Geocode error";
    const status = message.includes("Unauthorized") || message.includes("Forbidden") ? 401 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}