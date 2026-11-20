"use client";

import { useCallback, useMemo, useState } from "react";
import { Field } from "@/components/admin/AdminForm";
import { GlobeShell } from "@/components/globe/GlobeShell";
import { cn } from "@/lib/utils";
import { MapPin, Search } from "lucide-react";

type GeocodeRow = {
  latitude: number;
  longitude: number;
  location_name: string;
  country: string;
  region: string;
};

type Props = {
  initial: {
    latitude?: number | null;
    longitude?: number | null;
    location_name?: string | null;
    region?: string | null;
    country?: string | null;
  };
};

function formatCoord(value: number) {
  return value.toFixed(6);
}

export function PlaceLocationSection({ initial }: Props) {
  const [latitude, setLatitude] = useState<number | null>(
    initial.latitude != null ? Number(initial.latitude) : null,
  );
  const [longitude, setLongitude] = useState<number | null>(
    initial.longitude != null ? Number(initial.longitude) : null,
  );
  const [locationName, setLocationName] = useState(String(initial.location_name ?? ""));
  const [region, setRegion] = useState(String(initial.region ?? ""));
  const [country, setCountry] = useState(String(initial.country ?? ""));
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<GeocodeRow[]>([]);
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [flyTarget, setFlyTarget] = useState<{ latitude: number; longitude: number } | null>(
    latitude != null && longitude != null
      ? { latitude, longitude }
      : null,
  );
  const [globeError, setGlobeError] = useState<string | null>(null);

  const draftPosition = useMemo(() => {
    if (latitude == null || longitude == null) return null;
    return { latitude, longitude };
  }, [latitude, longitude]);

  const applySelection = useCallback((row: GeocodeRow) => {
    setLatitude(row.latitude);
    setLongitude(row.longitude);
    setFlyTarget({ latitude: row.latitude, longitude: row.longitude });
    setLocationName(row.location_name);
    if (row.region) setRegion(row.region);
    if (row.country) setCountry(row.country);
  }, []);

  const onPick = useCallback((lat: number, lon: number) => {
    setLatitude(lat);
    setLongitude(lon);
    setFlyTarget({ latitude: lat, longitude: lon });
  }, []);

  const runSearch = useCallback(async () => {
    const q = query.trim();
    if (q.length < 2) return;
    setSearching(true);
    setSearchError(null);
    try {
      const res = await fetch(`/api/admin/geocode?q=${encodeURIComponent(q)}`);
      const data = (await res.json()) as { results?: GeocodeRow[]; error?: string };
      if (!res.ok) throw new Error(data.error ?? "Search failed");
      setResults(data.results ?? []);
      if (!data.results?.length) setSearchError("No matches — try a nearby city or landmark.");
    } catch (err) {
      setSearchError(err instanceof Error ? err.message : "Search failed");
      setResults([]);
    } finally {
      setSearching(false);
    }
  }, [query]);

  return (
    <section className="space-y-4 rounded-2xl border border-[var(--border)] bg-[var(--bg-subtle)]/20 p-4">
      <div>
        <p className="text-sm font-medium text-[var(--text-primary)]">Geographic location</p>
        <p className="mt-1 text-xs text-[var(--text-muted)]">
          Search for a destination, fly the globe there, then click to fine-tune the pin. Coordinates are
          saved with the place — nothing is auto-guessed from the name alone.
        </p>
      </div>

      <input type="hidden" name="latitude" value={latitude ?? ""} />
      <input type="hidden" name="longitude" value={longitude ?? ""} />
      <input type="hidden" name="location_name" value={locationName} />

      <div className="flex flex-col gap-2 sm:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-muted)]" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                void runSearch();
              }
            }}
            placeholder="Search city, mountain, landmark…"
            className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] py-2.5 pl-10 pr-3 text-sm outline-none focus:ring-2 focus:ring-[var(--accent-violet)]"
          />
        </div>
        <button
          type="button"
          onClick={() => void runSearch()}
          disabled={searching || query.trim().length < 2}
          className="rounded-xl bg-[var(--accent-violet)] px-4 py-2.5 text-sm font-medium text-white disabled:opacity-50"
        >
          {searching ? "Searching…" : "Search"}
        </button>
      </div>
      {searchError ? <p className="text-xs text-amber-400/90">{searchError}</p> : null}
      {results.length > 0 ? (
        <ul className="max-h-40 space-y-1 overflow-y-auto rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] p-1">
          {results.map((row, i) => (
            <li key={`${row.latitude}-${row.longitude}-${i}`}>
              <button
                type="button"
                onClick={() => applySelection(row)}
                className="w-full rounded-lg px-3 py-2 text-left text-xs hover:bg-[var(--bg-subtle)]"
              >
                <span className="font-medium text-[var(--text-primary)]">{row.location_name}</span>
              </button>
            </li>
          ))}
        </ul>
      ) : null}

      <div className="h-[min(50vh,400px)] min-h-[280px] overflow-hidden rounded-2xl border border-[var(--border)]">
        <GlobeShell
          mode="picker"
          draftPosition={draftPosition}
          flyTarget={flyTarget}
          onPick={onPick}
          className="h-full min-h-[280px]"
          onError={(msg) => setGlobeError(msg)}
        />
      </div>
      {globeError ? <p className="text-xs text-amber-400/90">{globeError}</p> : null}

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] px-3 py-2.5 font-mono text-xs">
          <span className="text-[var(--text-muted)]">Latitude </span>
          <span className={cn(latitude == null && "text-amber-400")}>
            {latitude != null ? formatCoord(latitude) : "— click the globe or search"}
          </span>
        </div>
        <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] px-3 py-2.5 font-mono text-xs">
          <span className="text-[var(--text-muted)]">Longitude </span>
          <span className={cn(longitude == null && "text-amber-400")}>
            {longitude != null ? formatCoord(longitude) : "—"}
          </span>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Region (from search or manual)">
          <input
            name="region"
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg-subtle)]/50 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--accent-violet)]"
          />
        </Field>
        <Field label="Country">
          <input
            name="country"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg-subtle)]/50 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--accent-violet)]"
          />
        </Field>
      </div>

      {latitude != null && longitude != null ? (
        <p className="flex items-center gap-1.5 text-xs text-[var(--accent-violet)]">
          <MapPin className="h-3.5 w-3.5" />
          Pin ready — save the form to store this location on your globe.
        </p>
      ) : (
        <p className="text-xs text-[var(--text-muted)]">
          This place won&apos;t appear on the public globe until coordinates are set.
        </p>
      )}
    </section>
  );
}