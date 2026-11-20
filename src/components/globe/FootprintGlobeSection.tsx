"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { PublicPlace } from "@/lib/content/types";
import { GlobeShell } from "@/components/globe/GlobeShell";
import { PlaceInfoCard } from "@/components/globe/PlaceInfoCard";
import {
  filterGlobePlaces,
  placesWithCoordinates,
  type GlobeFilter,
} from "@/components/globe/types";
import { cn } from "@/lib/utils";

const SESSION_KEY = "footprint:selectedPlace";

type Props = {
  places: PublicPlace[];
  filter: GlobeFilter;
};

export function FootprintGlobeSection({ places, filter }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [globeError, setGlobeError] = useState<string | null>(null);
  const [webglFailed, setWebglFailed] = useState(false);

  const withCoords = useMemo(() => placesWithCoordinates(places), [places]);
  const globePlaces = useMemo(
    () => filterGlobePlaces(withCoords, filter),
    [withCoords, filter],
  );

  const missingCount = places.length - withCoords.length;

  useEffect(() => {
    try {
      const canvas = document.createElement("canvas");
      const gl = canvas.getContext("webgl") ?? canvas.getContext("experimental-webgl");
      if (!gl) setWebglFailed(true);
    } catch {
      setWebglFailed(true);
    }
  }, []);

  useEffect(() => {
    const fromUrl = searchParams.get("place");
    if (fromUrl && places.some((p) => p.id === fromUrl)) {
      setSelectedId(fromUrl);
      return;
    }
    try {
      const fromSession = sessionStorage.getItem(SESSION_KEY);
      if (fromSession && places.some((p) => p.id === fromSession)) {
        setSelectedId(fromSession);
      }
    } catch {
      /* ignore */
    }
  }, [searchParams, places]);

  const selectPlace = useCallback(
    (id: string) => {
      setSelectedId(id);
      try {
        sessionStorage.setItem(SESSION_KEY, id);
      } catch {
        /* ignore */
      }
      const params = new URLSearchParams(searchParams.toString());
      params.set("place", id);
      router.replace(`/places?${params.toString()}`, { scroll: false });
    },
    [router, searchParams],
  );

  const closeCard = useCallback(() => {
    setSelectedId(null);
    try {
      sessionStorage.removeItem(SESSION_KEY);
    } catch {
      /* ignore */
    }
    const params = new URLSearchParams(searchParams.toString());
    params.delete("place");
    const next = params.toString();
    router.replace(next ? `/places?${next}` : "/places", { scroll: false });
  }, [router, searchParams]);

  const selectedPlace = useMemo(
    () => places.find((p) => p.id === selectedId) ?? null,
    [places, selectedId],
  );

  if (webglFailed) {
    return (
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-elevated)] p-6 text-sm text-[var(--text-secondary)]">
        WebGL isn&apos;t available in this browser, so the 3D globe can&apos;t run here. Your place list
        below still has everything.
      </div>
    );
  }

  return (
    <div className="relative">
      <div
        className={cn(
          "glow-border relative h-[min(68vh,520px)] min-h-[320px] w-full overflow-hidden rounded-3xl bg-[var(--bg-elevated)] sm:min-h-[420px]",
          globeError ? "border-amber-500/40" : "",
        )}
      >
        {globePlaces.length > 0 || withCoords.length > 0 ? (
          <GlobeShell
            mode="public"
            places={globePlaces}
            selectedId={selectedId}
            hoveredId={hoveredId}
            onHover={setHoveredId}
            onSelect={selectPlace}
            className="h-full min-h-[320px]"
            onError={(msg) => setGlobeError(msg)}
          />
        ) : (
          <div className="flex h-full items-center justify-center p-8 text-center text-sm text-[var(--text-secondary)]">
            No plotted coordinates yet. Edit places in admin to pin them on the globe.
          </div>
        )}
        <PlaceInfoCard place={selectedPlace} onClose={closeCard} />
      </div>
      {globeError ? (
        <p className="mt-2 text-xs text-amber-400/90">Globe: {globeError}. Try refreshing or check your Cesium Ion token.</p>
      ) : null}
      {missingCount > 0 ? (
        <p className="mt-3 text-xs text-[var(--text-muted)]">
          {missingCount} place{missingCount === 1 ? "" : "s"} still need coordinates — open them in admin and
          use the map picker (we don&apos;t guess locations from names alone).
        </p>
      ) : null}
    </div>
  );
}