import { Footer } from "@/components/layout/Footer";
import { Navigation } from "@/components/layout/Navigation";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navigation />
      <div className="flex flex-1 flex-col">{children}</div>
      <Footer />
    </>
  );
}