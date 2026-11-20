"use client";

import { useState, Suspense } from "react";
import type { PublicPlace } from "@/lib/content/types";
import { BentoCard } from "@/components/ui/BentoCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { FootprintGlobeSection } from "@/components/globe/FootprintGlobeSection";
import type { GlobeFilter } from "@/components/globe/types";
import { cn } from "@/lib/utils";
import { MapPinned } from "lucide-react";
import Image from "next/image";

type Props = {
  places: PublicPlace[];
};

const filters: GlobeFilter[] = ["all", "visited", "wishlist"];

function regionLabel(place: PublicPlace) {
  return [place.region, place.country].filter(Boolean).join(", ");
}

export function PlacesBoard({ places }: Props) {
  const [filter, setFilter] = useState<GlobeFilter>("all");

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

  return (
    <div className="space-y-10">
      <div className="glow-border overflow-hidden rounded-3xl bg-[var(--bg-elevated)] p-4 md:p-6">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-[var(--text-muted)]">
              Footprint globe
            </p>
            <p className="mt-2 max-w-lg text-sm text-[var(--text-secondary)]">
              A living archive of where you&apos;ve been and where you&apos;re headed — rotate the Earth,
              hover pins, click to relive each place.
            </p>
          </div>
          <div className="flex gap-4 text-xs text-[var(--text-muted)]">
            <span className="inline-flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-[var(--accent-violet)] shadow-[0_0_8px_var(--accent-violet)]" />{" "}
              Visited
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full border border-[var(--accent-blue)]" /> Wishlist
            </span>
          </div>
        </div>

        <div className="mb-4 flex flex-wrap gap-2">
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

        <Suspense
          fallback={
            <div className="flex h-[320px] items-center justify-center rounded-2xl bg-[var(--bg-subtle)]/40 text-sm text-[var(--text-muted)]">
              Loading globe…
            </div>
          }
        >
          <FootprintGlobeSection places={places} filter={filter} />
        </Suspense>
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
                  {place.imageUrls?.[0] ? (
                    <Image
                      src={place.imageUrls[0]}
                      alt=""
                      fill
                      className="object-cover opacity-80"
                      sizes="(max-width: 768px) 100vw, 40vw"
                      unoptimized
                    />
                  ) : null}
                  <span className="absolute bottom-3 left-3 rounded-full bg-black/35 px-2 py-1 text-[10px] uppercase tracking-wider text-white backdrop-blur">
                    {place.category}
                  </span>
                </div>
                <div className="p-5 md:col-span-3">
                  <div className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
                    <MapPinned className="h-3.5 w-3.5" />
                    {regionLabel(place)}
                  </div>
                  <h2 className="mt-1 text-xl font-semibold text-[var(--text-primary)]">
                    {place.name}
                  </h2>
                  <p className="mt-2 text-sm text-[var(--text-secondary)]">{place.description}</p>
                  {place.latitude == null || place.longitude == null ? (
                    <p className="mt-2 text-xs text-amber-400/80">Not on globe yet — add coordinates in admin.</p>
                  ) : null}
                </div>
              </div>
            </BentoCard>
          </li>
        ))}
      </ul>
    </div>
  );
}