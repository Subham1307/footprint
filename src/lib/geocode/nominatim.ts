export type GeocodeHit = {
  latitude: number;
  longitude: number;
  location_name: string;
  country: string;
  region: string;
};

type NominatimRow = {
  lat: string;
  lon: string;
  display_name: string;
  address?: {
    city?: string;
    town?: string;
    village?: string;
    state?: string;
    country?: string;
    region?: string;
    county?: string;
  };
};

export async function searchPlacesNominatim(query: string, limit = 8): Promise<GeocodeHit[]> {
  const trimmed = query.trim();
  if (trimmed.length < 2) return [];

  const url = new URL("https://nominatim.openstreetmap.org/search");
  url.searchParams.set("q", trimmed);
  url.searchParams.set("format", "json");
  url.searchParams.set("limit", String(limit));
  url.searchParams.set("addressdetails", "1");

  const res = await fetch(url.toString(), {
    headers: {
      Accept: "application/json",
      "User-Agent": "whatidoin-footprint/1.0 (personal site; admin geocode)",
    },
    next: { revalidate: 0 },
  });

  if (!res.ok) throw new Error(`Geocode failed (${res.status})`);

  const rows = (await res.json()) as NominatimRow[];
  return rows.map((row) => {
    const addr = row.address ?? {};
    const locality =
      addr.city ?? addr.town ?? addr.village ?? addr.county ?? row.display_name.split(",")[0]?.trim() ?? "";
    const region = addr.state ?? addr.region ?? "";
    const country = addr.country ?? "";
    return {
      latitude: Number.parseFloat(row.lat),
      longitude: Number.parseFloat(row.lon),
      location_name: row.display_name,
      country,
      region: region || locality,
    };
  });
}