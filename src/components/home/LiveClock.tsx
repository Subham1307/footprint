"use client";

import { useEffect, useState } from "react";
import { formatDate } from "@/lib/utils";

type Props = {
  timezone?: string;
  availabilityLabel?: string;
};

export function LiveClock({
  timezone = "Asia/Kolkata",
  availabilityLabel = "Open to interesting conversations",
}: Props) {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    const tick = () => setNow(new Date());
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const time =
    now?.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
      timeZone: timezone,
    }) ?? "—:—:—";

  const date = now
    ? formatDate(now, {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "…";

  return (
    <div className="flex flex-wrap items-center gap-3 text-sm text-[var(--text-secondary)]">
      <div className="rounded-full border border-[var(--border)] bg-[var(--bg-elevated)] px-3 py-1.5 font-mono text-xs tracking-wide text-[var(--text-primary)]">
        {time}
        <span className="ml-2 text-[var(--text-muted)]">IST</span>
      </div>
      <span className="text-[var(--text-muted)]">{date}</span>
      <span className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--bg-elevated)] px-3 py-1.5 text-xs">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-pulse-soft rounded-full bg-emerald-400/80" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
        </span>
        {availabilityLabel}
      </span>
    </div>
  );
}