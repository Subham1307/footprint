"use client";

import { useState } from "react";
import Image from "next/image";
import type { PublicPlace } from "@/lib/content/types";
import { MapPinned, X, CalendarDays } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  place: PublicPlace | null;
  onClose: () => void;
  className?: string;
};

const dateFormat = new Intl.DateTimeFormat("en", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

function formatVisitDate(value: string) {
  const date = new Date(`${value.slice(0, 10)}T00:00:00Z`);
  return Number.isNaN(date.getTime()) ? value : dateFormat.format(date);
}

export function PlaceInfoCard({ place, onClose, className }: Props) {
  // Keep the last place rendered while the card fades out.
  const [shown, setShown] = useState(place);
  if (place && place !== shown) setShown(place);
  const open = place !== null;

  if (!shown) return null;

  return (
    <aside
      aria-hidden={!open}
      inert={!open}
      className={cn(
        "absolute bottom-4 left-4 right-4 z-20 mx-auto max-h-[calc(100%-5rem)] max-w-md overflow-y-auto rounded-2xl border border-[var(--border-strong)] bg-[var(--glass)] p-4 shadow-[var(--shadow)] backdrop-blur-xl transition-all duration-300 ease-out sm:left-auto sm:right-4 sm:max-w-sm",
        open
          ? "pointer-events-auto translate-y-0 scale-100 opacity-100"
          : "pointer-events-none translate-y-3 scale-[0.98] opacity-0",
        className,
      )}
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute right-3 top-3 rounded-lg p-1 text-[var(--text-muted)] hover:bg-[var(--bg-subtle)] hover:text-[var(--text-primary)]"
        aria-label="Close place details"
      >
        <X className="h-4 w-4" />
      </button>
      <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider">
        <span
          className={cn(
            "rounded-full px-2 py-0.5",
            shown.category === "visited"
              ? "bg-[var(--accent-violet)]/20 text-[var(--accent-violet)]"
              : "border border-[var(--accent-blue)]/50 text-[var(--accent-blue)]",
          )}
        >
          {shown.category === "visited" ? "Visited" : "Wishlist"}
        </span>
        {shown.firstVisitedDate ? (
          <span className="inline-flex items-center gap-1 normal-case tracking-normal text-[var(--text-muted)]">
            <CalendarDays className="h-3 w-3" />
            {formatVisitDate(shown.firstVisitedDate)}
          </span>
        ) : null}
      </div>
      <h3 className="mt-2 pr-6 text-lg font-semibold text-[var(--text-primary)]">{shown.name}</h3>
      <p className="mt-1 flex items-center gap-1.5 text-xs text-[var(--text-muted)]">
        <MapPinned className="h-3.5 w-3.5 shrink-0" />
        {[shown.region, shown.country].filter(Boolean).join(" · ")}
      </p>
      {shown.locationName ? (
        <p className="mt-1 line-clamp-2 text-[10px] text-[var(--text-muted)]">{shown.locationName}</p>
      ) : null}
      {shown.description ? (
        <p className="mt-3 text-sm leading-relaxed text-[var(--text-secondary)]">{shown.description}</p>
      ) : null}
      {shown.imageUrls && shown.imageUrls.length > 0 ? (
        <ul className="mt-4 flex snap-x gap-2 overflow-x-auto pb-1">
          {shown.imageUrls.map((url) => (
            <li key={url} className="relative h-20 w-28 shrink-0 snap-start overflow-hidden rounded-lg">
              <a href={url} target="_blank" rel="noreferrer" className="block size-full">
                <Image
                  src={url}
                  alt={`Photo from ${shown.name}`}
                  fill
                  className="object-cover transition-transform duration-300 hover:scale-105"
                  sizes="112px"
                  unoptimized
                />
              </a>
            </li>
          ))}
        </ul>
      ) : null}
    </aside>
  );
}