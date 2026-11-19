"use client";

import { useState } from "react";
import type { PublicPlace } from "@/lib/content/types";
import { BentoCard } from "@/components/ui/BentoCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { cn } from "@/lib/utils";
import { MapPinned } from "lucide-react";

type Props = {
  places: PublicPlace[];
};

const filters = ["all", "visited", "wishlist"] as const;

function hash(value: string) {
  let h = 0;
  for (let i = 0; i < value.length; i++) h = (h * 31 + value.charCodeAt(i)) | 0;
  return Math.abs(h);
}

function pinPositions(places: PublicPlace[]) {
  const count = places.length;
  return places.map((place, i) => {
    const x = 60 + ((i + 0.5) / count) * 480;
    const y = 70 + (hash(place.id) % 150);
    return { place, x, y };
  });
}

export function PlacesBoard({ places }: Props) {
  const [filter, setFilter] = useState<(typeof filters)[number]>("all");

  if (places.length === 0) {
    return (
      <EmptyState
        title="No pins on the map yet"
        description="Places visited and places dreamt about will be plotted here as the travels pile up."
        action={{ href: "/", label: "Back home" }}
      />
    );
  }

  const visible =
    filter === "all" ? places : places.filter((place) => place.category === filter);
  const pins = pinPositions(places);
  const route = pins
    .filter((pin) => pin.place.category === "visited")
    .map((pin, i) => `${i === 0 ? "M" : "L"}${pin.x} ${pin.y}`)
    .join(" ");

  return (
    <div className="space-y-10">
      <div className="glow-border relative overflow-hidden rounded-3xl bg-[var(--bg-elevated)] p-6 md:p-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-[var(--text-muted)]">
              Footprint map
            </p>
            <p className="mt-2 max-w-lg text-sm text-[var(--text-secondary)]">
              A loose sketch of where I&apos;ve been and where I&apos;m headed — not to scale, just
              to feel.
            </p>
          </div>
          <div className="flex gap-4 text-xs text-[var(--text-muted)]">
            <span className="inline-flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-[var(--accent-violet)]" /> Visited
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full border border-[var(--accent-blue)]" /> Wishlist
            </span>
          </div>
        </div>
        <svg
          viewBox="0 0 600 280"
          className="mt-6 h-auto w-full max-w-full"
          overflow="hidden"
          preserveAspectRatio="xMidYMid meet"
          role="img"
          aria-label={`Map sketch with ${places.length} places`}
        >
          <defs>
            <linearGradient id="mapGlow" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="var(--accent-violet)" stopOpacity="0.18" />
              <stop offset="100%" stopColor="var(--accent-blue)" stopOpacity="0.06" />
            </linearGradient>
            <pattern id="mapGrid" width="24" height="24" patternUnits="userSpaceOnUse">
              <path d="M24 0H0V24" fill="none" stroke="var(--border-strong)" strokeWidth="0.6" />
            </pattern>
          </defs>
          <rect width="600" height="280" rx="24" fill="url(#mapGlow)" />
          <rect width="600" height="280" rx="24" fill="url(#mapGrid)" opacity="0.6" />
          {route ? (
            <path
              d={route}
              fill="none"
              stroke="var(--accent-violet)"
              strokeWidth="1.5"
              strokeDasharray="6 8"
              strokeLinecap="round"
              opacity="0.7"
              className="route-dash"
            />
          ) : null}
          {pins.map(({ place, x, y }, i) => {
            const visited = place.category === "visited";
            const color = visited ? "var(--accent-violet)" : "var(--accent-blue)";
            return (
              <g key={place.id}>
                <title>{place.name}</title>
                <circle
                  cx={x}
                  cy={y}
                  r="8"
                  fill={color}
                  opacity="0.35"
                  className="pin-pulse max-sm:hidden"
                  style={{ animationDelay: `${i * 0.4}s` }}
                />
                <circle
                  cx={x}
                  cy={y}
                  r="6"
                  fill={visited ? color : "var(--bg-elevated)"}
                  stroke={color}
                  strokeWidth="2"
                />
                <text
                  x={x}
                  y={y - 14}
                  textAnchor="middle"
                  fontSize="11"
                  fill="var(--text-secondary)"
                >
                  {place.name}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      <div className="flex flex-wrap gap-2">
        {filters.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setFilter(item)}
            className={cn(
              "rounded-full border px-4 py-2 text-xs font-medium capitalize transition",
              filter === item
                ? "border-[var(--border-strong)] bg-[var(--bg-elevated)] text-[var(--text-primary)]"
                : "border-transparent text-[var(--text-muted)] hover:text-[var(--text-secondary)]",
            )}
          >
            {item}
          </button>
        ))}
      </div>

      <ul className="grid gap-4 md:grid-cols-2">
        {visible.map((place) => (
          <li key={place.id}>
            <BentoCard className="overflow-hidden p-0">
              <div className="grid md:grid-cols-5">
                <div
                  className={cn(
                    "relative min-h-[160px] bg-gradient-to-br md:col-span-2",
                    place.gradient,
                  )}
                >
                  <span className="absolute bottom-3 left-3 rounded-full bg-black/35 px-2 py-1 text-[10px] uppercase tracking-wider text-white backdrop-blur">
                    {place.category}
                  </span>
                </div>
                <div className="p-5 md:col-span-3">
                  <div className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
                    <MapPinned className="h-3.5 w-3.5" />
                    {place.region}
                  </div>
                  <h2 className="mt-1 text-xl font-semibold text-[var(--text-primary)]">
                    {place.name}
                  </h2>
                  <p className="mt-2 text-sm text-[var(--text-secondary)]">{place.description}</p>
                </div>
              </div>
            </BentoCard>
          </li>
        ))}
      </ul>
    </div>
  );
}