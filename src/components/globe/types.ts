import type { PublicPlace } from "@/lib/content/types";

export type GlobePlace = PublicPlace & {
  latitude: number;
  longitude: number;
};

export function placesWithCoordinates(places: PublicPlace[]): GlobePlace[] {
  return places.filter(
    (p): p is GlobePlace =>
      p.latitude != null &&
      p.longitude != null &&
      Number.isFinite(p.latitude) &&
      Number.isFinite(p.longitude),
  );
}

export type GlobeFilter = "all" | "visited" | "wishlist";

export function filterGlobePlaces(places: GlobePlace[], filter: GlobeFilter): GlobePlace[] {
  if (filter === "all") return places;
  return places.filter((p) => p.category === filter);
}