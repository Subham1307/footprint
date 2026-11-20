"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import type { PublicPlace } from "@/lib/content/types";
import { MapPinned, X, CalendarDays } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  place: PublicPlace | null;
  onClose: () => void;
  className?: string;
};

export function PlaceInfoCard({ place, onClose, className }: Props) {
  return (
    <AnimatePresence>
      {place ? (
        <motion.aside
          key={place.id}
          initial={{ opacity: 0, y: 16, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 12, scale: 0.98 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          className={cn(
            "pointer-events-auto absolute bottom-4 left-4 right-4 z-20 mx-auto max-w-md rounded-2xl border border-[var(--border-strong)] bg-[var(--glass)] p-4 shadow-[var(--shadow)] backdrop-blur-xl sm:left-auto sm:right-4 sm:max-w-sm",
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
                place.category === "visited"
                  ? "bg-[var(--accent-violet)]/20 text-[var(--accent-violet)]"
                  : "border border-[var(--accent-blue)]/50 text-[var(--accent-blue)]",
              )}
            >
              {place.category === "visited" ? "Visited" : "Wishlist"}
            </span>
            {place.firstVisitedDate ? (
              <span className="inline-flex items-center gap-1 text-[var(--text-muted)]">
                <CalendarDays className="h-3 w-3" />
                {place.firstVisitedDate}
              </span>
            ) : null}
          </div>
          <h3 className="mt-2 pr-6 text-lg font-semibold text-[var(--text-primary)]">{place.name}</h3>
          <p className="mt-1 flex items-center gap-1.5 text-xs text-[var(--text-muted)]">
            <MapPinned className="h-3.5 w-3.5" />
            {[place.region, place.country].filter(Boolean).join(" · ")}
          </p>
          {place.locationName ? (
            <p className="mt-1 text-[10px] text-[var(--text-muted)]">{place.locationName}</p>
          ) : null}
          {place.description ? (
            <p className="mt-3 text-sm leading-relaxed text-[var(--text-secondary)]">
              {place.description}
            </p>
          ) : null}
          {place.imageUrls && place.imageUrls.length > 0 ? (
            <ul className="mt-4 flex gap-2 overflow-x-auto pb-1">
              {place.imageUrls.map((url) => (
                <li key={url} className="relative h-20 w-28 shrink-0 overflow-hidden rounded-lg">
                  <Image
                    src={url}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="112px"
                    unoptimized
                  />
                </li>
              ))}
            </ul>
          ) : null}
        </motion.aside>
      ) : null}
    </AnimatePresence>
  );
}