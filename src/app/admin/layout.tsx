import type { Metadata } from "next";
import { Suspense, type ReactNode } from "react";
import { AdminRouteFallback } from "@/components/admin/AdminRouteFallback";

export const instant = false;

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[var(--bg-deep)]">
      <Suspense fallback={<AdminRouteFallback />}>{children}</Suspense>
    </div>
  );
}