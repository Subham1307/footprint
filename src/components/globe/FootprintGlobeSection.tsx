"use client";

import { useCallback, useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { useSearchParams } from "next/navigation";
import type { PublicPlace } from "@/lib/content/types";
import { GlobeShell } from "@/components/globe/GlobeShell";
import { PlaceInfoCard } from "@/components/globe/PlaceInfoCard";
import {
  filterGlobePlaces,
  placesWithCoordinates,
  type GlobeFilter,
} from "@/components/globe/types";
import { cn } from "@/lib/utils";
import { RotateCcw } from "lucide-react";

const SESSION_KEY = "footprint:selectedPlace";

let webglSupport: boolean | null = null;
function hasWebGL() {
  if (webglSupport === null) {
    try {
      const canvas = document.createElement("canvas");
      webglSupport = Boolean(canvas.getContext("webgl2") ?? canvas.getContext("webgl"));
    } catch {
      webglSupport = false;
    }
  }
  return webglSupport;
}
const noopSubscribe = () => () => {};

function writePlaceParam(id: string | null) {
  const url = new URL(window.location.href);
  if (id) url.searchParams.set("place", id);
  else url.searchParams.delete("place");
  window.history.replaceState(null, "", `${url.pathname}${url.search}${url.hash}`);
}

type Props = {
  places: PublicPlace[];
  filter: GlobeFilter;
};

export function FootprintGlobeSection({ places, filter }: Props) {
  const searchParams = useSearchParams();
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [globeError, setGlobeError] = useState<string | null>(null);
  const [resetSignal, setResetSignal] = useState(0);
  const webglOk = useSyncExternalStore(noopSubscribe, hasWebGL, () => true);

  const withCoords = useMemo(() => placesWithCoordinates(places), [places]);
  const globePlaces = useMemo(
    () => filterGlobePlaces(withCoords, filter),
    [withCoords, filter],
  );

  const missingCount = places.length - withCoords.length;
  const visitedCount = withCoords.filter((p) => p.category === "visited").length;
  const wishlistCount = withCoords.length - visitedCount;

  const urlId = searchParams.get("place");
  const selectedId = urlId && places.some((p) => p.id === urlId) ? urlId : null;

  useEffect(() => {
    if (urlId) return;
    try {
      const saved = sessionStorage.getItem(SESSION_KEY);
      if (saved && places.some((p) => p.id === saved)) writePlaceParam(saved);
    } catch {
      /* storage unavailable */
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- restore once on mount
  }, []);

  const selectPlace = useCallback((id: string) => {
    try {
      sessionStorage.setItem(SESSION_KEY, id);
    } catch {
      /* storage unavailable */
    }
    writePlaceParam(id);
  }, []);

  const closeCard = useCallback(() => {
    try {
      sessionStorage.removeItem(SESSION_KEY);
    } catch {
      /* storage unavailable */
    }
    writePlaceParam(null);
  }, []);

  const selectedPlace = useMemo(
    () => places.find((p) => p.id === selectedId) ?? null,
    [places, selectedId],
  );

  if (!webglOk) {
    return (
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-elevated)] p-6 text-sm text-[var(--text-secondary)]">
        WebGL isn&apos;t available in this browser, so the 3D globe can&apos;t run here. Your place list
        below still has everything.
      </div>
    );
  }

  return (
    <div className="relative w-full">
      <div
        className={cn(
          "glow-border relative h-[min(68vh,520px)] min-h-[320px] w-full overflow-hidden rounded-3xl bg-[#07080b] sm:min-h-[420px]",
          globeError ? "border-amber-500/40" : "",
        )}
      >
        <>
            <GlobeShell
              mode="public"
              places={globePlaces}
              selectedId={selectedId}
              hoveredId={hoveredId}
              onHover={setHoveredId}
              onSelect={selectPlace}
              resetSignal={resetSignal}
              className="h-full min-h-[320px]"
              onError={(msg) => setGlobeError(msg)}
            />
            <div className="pointer-events-none absolute left-4 top-4 z-10 flex flex-wrap gap-2">
              <span className="rounded-full border border-white/10 bg-black/40 px-3 py-1 text-[11px] font-medium text-white/85 backdrop-blur-md">
                <span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-[var(--accent-violet)] shadow-[0_0_8px_var(--accent-violet)]" />
                {visitedCount} visited
              </span>
              <span className="rounded-full border border-white/10 bg-black/40 px-3 py-1 text-[11px] font-medium text-white/85 backdrop-blur-md">
                <span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full border border-[var(--accent-blue)]" />
                {wishlistCount} wishlist
              </span>
            </div>
            <button
              type="button"
              onClick={() => {
                closeCard();
                setResetSignal((n) => n + 1);
              }}
              className="absolute right-4 top-4 z-10 inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-black/40 px-3 py-1.5 text-[11px] font-medium text-white/85 backdrop-blur-md transition hover:border-[var(--accent-violet)]/60 hover:text-white"
              aria-label="Reset globe view"
            >
              <RotateCcw className="h-3 w-3" />
              Reset view
            </button>
            {!selectedPlace ? (
              <p className="pointer-events-none absolute bottom-4 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-full bg-black/35 px-3 py-1 text-[10px] tracking-wide text-white/60 backdrop-blur-md">
                Drag to rotate · Scroll or pinch to zoom · Tap a pin
              </p>
            ) : null}
            {globePlaces.length === 0 ? (
              <p className="pointer-events-none absolute inset-x-6 top-1/2 z-10 -translate-y-1/2 text-center text-sm text-white/75 [text-shadow:0_1px_12px_rgba(0,0,0,0.9)]">
                {withCoords.length === 0
                  ? "No pins yet — set coordinates in admin to light up the globe."
                  : `No ${filter} places on the globe yet.`}
              </p>
            ) : null}
        </>
        <PlaceInfoCard place={selectedPlace} onClose={closeCard} />
      </div>
      {globeError ? (
        <p className="mt-2 text-xs text-amber-400/90">
          Globe: {globeError}. Try refreshing or check your Cesium Ion token.
        </p>
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