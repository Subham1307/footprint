"use client";

import dynamic from "next/dynamic";
import type { ComponentProps } from "react";

const LazyCesiumGlobeCore = dynamic(
  () => import("@/components/globe/CesiumGlobeCore").then((m) => m.CesiumGlobeCore),
  { ssr: false, loading: () => <GlobeLoadingSkeleton /> },
);

function GlobeLoadingSkeleton() {
  return (
    <div className="flex h-full min-h-[inherit] w-full items-center justify-center rounded-2xl bg-[var(--bg-subtle)]/40">
      <div className="text-center text-sm text-[var(--text-muted)]">
        <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-2 border-[var(--border-strong)] border-t-[var(--accent-violet)]" />
        Loading globe…
      </div>
    </div>
  );
}

export type GlobeShellProps = ComponentProps<typeof LazyCesiumGlobeCore>;

export function GlobeShell(props: GlobeShellProps) {
  return <LazyCesiumGlobeCore {...props} />;
}