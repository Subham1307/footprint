"use client";

import { useState } from "react";
import {
  CUSTOM_GRADIENT_ID,
  matchGradientPreset,
  type GradientPreset,
} from "@/lib/design/palettes";
import { cn } from "@/lib/utils";

type Props = {
  name: string;
  defaultValue?: string;
  presets: GradientPreset[];
};

export function GradientPaletteField({ name, defaultValue, presets }: Props) {
  const initialId = matchGradientPreset(defaultValue, presets);
  const [selectedId, setSelectedId] = useState(initialId);
  const [customClasses] = useState(() =>
    initialId === CUSTOM_GRADIENT_ID ? (defaultValue?.trim() ?? "") : "",
  );

  const selected =
    selectedId === CUSTOM_GRADIENT_ID
      ? { id: CUSTOM_GRADIENT_ID, label: "Current style", classes: customClasses || presets[0].classes }
      : (presets.find((p) => p.id === selectedId) ?? presets[0]);

  return (
    <div className="space-y-3">
      <input type="hidden" name={name} value={selected.classes} />
      <div
        aria-hidden
        className={cn(
          "h-14 w-full rounded-2xl border border-[var(--border)] bg-gradient-to-br shadow-inner",
          selected.classes,
        )}
      />
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {initialId === CUSTOM_GRADIENT_ID && customClasses ? (
          <button
            type="button"
            onClick={() => setSelectedId(CUSTOM_GRADIENT_ID)}
            className={cn(
              "flex flex-col gap-2 rounded-xl border p-2.5 text-left transition",
              selectedId === CUSTOM_GRADIENT_ID
                ? "border-[var(--accent-violet)] bg-[var(--bg-elevated)] ring-2 ring-[var(--accent-violet)]/40"
                : "border-[var(--border)] bg-[var(--bg-subtle)]/40 hover:border-[var(--border-strong)]",
            )}
          >
            <span
              className={cn("h-10 w-full rounded-lg bg-gradient-to-br", customClasses)}
              aria-hidden
            />
            <span className="text-xs font-medium text-[var(--text-secondary)]">
              Current style
            </span>
          </button>
        ) : null}
        {presets.map((preset) => {
          const active = preset.id === selectedId;
          return (
            <button
              key={preset.id}
              type="button"
              onClick={() => setSelectedId(preset.id)}
              className={cn(
                "flex flex-col gap-2 rounded-xl border p-2.5 text-left transition",
                active
                  ? "border-[var(--accent-violet)] bg-[var(--bg-elevated)] ring-2 ring-[var(--accent-violet)]/40"
                  : "border-[var(--border)] bg-[var(--bg-subtle)]/40 hover:border-[var(--border-strong)]",
              )}
            >
              <span
                className={cn("h-10 w-full rounded-lg bg-gradient-to-br", preset.classes)}
                aria-hidden
              />
              <span className="text-xs font-medium text-[var(--text-secondary)]">
                {preset.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}