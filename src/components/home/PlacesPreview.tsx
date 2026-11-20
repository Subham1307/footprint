import Link from "next/link";
import type { PublicPlace } from "@/lib/content/types";
import { FadeIn } from "@/components/animations/FadeIn";
import { BentoCard } from "@/components/ui/BentoCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { MapPinned } from "lucide-react";
import { cn } from "@/lib/utils";

function regionLabel(place: PublicPlace) {
  return [place.region, place.country].filter(Boolean).join(", ");
}

export function PlacesPreview({ places }: { places: PublicPlace[] }) {
  const featured = places.slice(0, 4);
  return (
    <section id="places" className="scroll-mt-24 pt-20">
      <FadeIn>
        <SectionHeading
          eyebrow="Territories"
          title="Places"
          description="Maps, moods, and postcards from memory — plus a few places still on the wishlist."
        />
      </FadeIn>
      <ul className="grid gap-4 md:grid-cols-2">
        {featured.map((place, i) => (
          <FadeIn key={place.id} delay={i * 0.06}>
            <li>
              <BentoCard href="/places" className="overflow-hidden p-0">
                <div className="grid md:grid-cols-5">
                  <div
                    className={cn(
                      "relative min-h-[140px] bg-gradient-to-br md:col-span-2 md:min-h-full",
                      place.gradient,
                    )}
                    aria-hidden
                  >
                    <span className="absolute bottom-3 left-3 rounded-full bg-black/30 px-2 py-1 text-[10px] uppercase tracking-wider text-white/90 backdrop-blur">
                      {place.category}
                    </span>
                  </div>
                  <div className="flex flex-col justify-center p-5 md:col-span-3">
                    <div className="mb-1 flex items-center gap-2 text-xs text-[var(--text-muted)]">
                      <MapPinned className="h-3.5 w-3.5" />
                      {regionLabel(place)}
                    </div>
                    <h3 className="text-xl font-semibold text-[var(--text-primary)]">{place.name}</h3>
                    <p className="mt-2 text-sm text-[var(--text-secondary)]">{place.description}</p>
                    <p className="mt-3 text-xs text-[var(--text-muted)]">Mood: {place.mood}</p>
                  </div>
                </div>
              </BentoCard>
            </li>
          </FadeIn>
        ))}
      </ul>
      <FadeIn className="mt-6">
        <Link
          href="/places"
          className="text-sm font-medium text-[var(--accent-blue)] hover:underline"
        >
          View visited & wishlist →
        </Link>
      </FadeIn>
    </section>
  );
}