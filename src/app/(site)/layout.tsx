import { Footer } from "@/components/layout/Footer";
import { Navigation } from "@/components/layout/Navigation";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-w-0 w-full flex-1 flex-col overflow-x-clip">
      <Navigation />
      <div className="flex min-w-0 w-full flex-1 flex-col">{children}</div>
      <Footer />
    </div>
  );
}