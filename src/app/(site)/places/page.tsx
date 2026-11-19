import { PageShell } from "@/components/layout/PageShell";
import { PlacesBoard } from "@/components/places/PlacesBoard";
import { FadeIn } from "@/components/animations/FadeIn";
import { getPublicPlaces } from "@/lib/content/places";

export const metadata = { title: "Places" };

export default async function PlacesPage() {
  const { places } = await getPublicPlaces();
  return (
    <PageShell
      eyebrow="Territories"
      title="Places"
      description="Visited ground truth and wishlist dreams — managed in the admin archive."
    >
      <FadeIn>
        <PlacesBoard places={places} />
      </FadeIn>
    </PageShell>
  );
}