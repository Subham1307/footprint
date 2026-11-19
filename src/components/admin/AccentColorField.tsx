"use client";

import { useState } from "react";
import { ACCENT_COLORS, matchAccentColor } from "@/lib/design/palettes";
import { cn } from "@/lib/utils";

type Props = {
  name: string;
  defaultValue?: string;
};

export function AccentColorField({ name, defaultValue }: Props) {
  const [selected, setSelected] = useState(() => matchAccentColor(defaultValue));

  const fromPalette = ACCENT_COLORS.some(
    (c) => c.hex.toLowerCase() === selected.toLowerCase(),
  );

  return (
    <div className="space-y-2">
      <input type="hidden" name={name} value={selected} />
      <div className="flex items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--bg-subtle)]/40 px-3 py-2">
        <span
          className="h-8 w-8 shrink-0 rounded-full border border-white/20 shadow-sm"
          style={{ backgroundColor: selected }}
          aria-hidden
        />
        <span className="font-mono text-xs text-[var(--text-muted)]">{selected}</span>
        {!fromPalette ? (
          <span className="ml-auto text-[10px] uppercase tracking-wide text-[var(--text-muted)]">
            Custom (pick below to replace)
          </span>
        ) : null}
      </div>
      <div className="flex flex-wrap gap-2">
        {ACCENT_COLORS.map((color) => {
          const active = color.hex.toLowerCase() === selected.toLowerCase();
          return (
            <button
              key={color.hex}
              type="button"
              title={color.label}
              aria-label={color.label}
              onClick={() => setSelected(color.hex)}
              className={cn(
                "h-9 w-9 rounded-full border-2 transition",
                active
                  ? "border-[var(--text-primary)] scale-110 shadow-md"
                  : "border-transparent hover:scale-105",
              )}
              style={{ backgroundColor: color.hex }}
            />
          );
        })}
      </div>
    </div>
  );
}