export type GradientPreset = {
  id: string;
  label: string;
  /** Tailwind `bg-gradient-to-br` color stops (stored in DB as before). */
  classes: string;
  /** Swatch preview colors for the picker UI. */
  swatch: [string, string];
};

export const PLACE_GRADIENTS: GradientPreset[] = [
  {
    id: "slate",
    label: "Slate night",
    classes: "from-slate-800 to-slate-950",
    swatch: ["#1e293b", "#020617"],
  },
  {
    id: "teal",
    label: "Coastal teal",
    classes: "from-teal-900 via-emerald-800 to-slate-900",
    swatch: ["#134e4a", "#0f172a"],
  },
  {
    id: "indigo",
    label: "Indigo dusk",
    classes: "from-slate-800 via-indigo-900 to-slate-950",
    swatch: ["#312e81", "#020617"],
  },
  {
    id: "cyan",
    label: "Arctic cyan",
    classes: "from-cyan-900 via-blue-900 to-slate-900",
    swatch: ["#164e63", "#0f172a"],
  },
  {
    id: "amber",
    label: "Desert amber",
    classes: "from-amber-900/80 via-stone-800 to-zinc-950",
    swatch: ["#78350f", "#09090b"],
  },
  {
    id: "rose",
    label: "Rose valley",
    classes: "from-rose-900 via-purple-900 to-slate-950",
    swatch: ["#881337", "#020617"],
  },
  {
    id: "ocean",
    label: "Deep ocean",
    classes: "from-blue-900 via-indigo-950 to-slate-950",
    swatch: ["#1e3a8a", "#020617"],
  },
];

export const INTEREST_GRADIENTS: GradientPreset[] = [
  {
    id: "violet",
    label: "Violet haze",
    classes: "from-violet-500/20 via-blue-500/10 to-transparent",
    swatch: ["#8b5cf6", "#3b82f6"],
  },
  {
    id: "violet-soft",
    label: "Violet soft",
    classes: "from-violet-500/15 to-transparent",
    swatch: ["#8b5cf6", "#1e1b4b"],
  },
  {
    id: "emerald",
    label: "Emerald mist",
    classes: "from-emerald-500/15 via-teal-500/10 to-transparent",
    swatch: ["#10b981", "#14b8a6"],
  },
  {
    id: "sky",
    label: "Sky drift",
    classes: "from-sky-500/20 via-cyan-500/5 to-transparent",
    swatch: ["#0ea5e9", "#06b6d4"],
  },
  {
    id: "rose",
    label: "Rose glow",
    classes: "from-rose-500/15 via-orange-500/10 to-transparent",
    swatch: ["#f43f5e", "#f97316"],
  },
  {
    id: "fuchsia",
    label: "Fuchsia pulse",
    classes: "from-fuchsia-500/15 via-violet-500/10 to-transparent",
    swatch: ["#d946ef", "#8b5cf6"],
  },
  {
    id: "amber",
    label: "Golden hour",
    classes: "from-amber-500/15 via-yellow-500/5 to-transparent",
    swatch: ["#f59e0b", "#eab308"],
  },
  {
    id: "lime",
    label: "Fresh lime",
    classes: "from-lime-500/10 via-green-500/10 to-transparent",
    swatch: ["#84cc16", "#22c55e"],
  },
  {
    id: "slate",
    label: "Neutral",
    classes: "from-zinc-500/10 via-transparent to-transparent",
    swatch: ["#71717a", "#3f3f46"],
  },
];

export type AccentPreset = {
  hex: string;
  label: string;
};

export const ACCENT_COLORS: AccentPreset[] = [
  { hex: "#8b7cf8", label: "Violet" },
  { hex: "#3b82f6", label: "Blue" },
  { hex: "#10b981", label: "Emerald" },
  { hex: "#14b8a6", label: "Teal" },
  { hex: "#0ea5e9", label: "Sky" },
  { hex: "#f43f5e", label: "Rose" },
  { hex: "#f97316", label: "Orange" },
  { hex: "#d946ef", label: "Fuchsia" },
  { hex: "#eab308", label: "Amber" },
  { hex: "#22c55e", label: "Green" },
  { hex: "#a1a1aa", label: "Zinc" },
];

export const CUSTOM_GRADIENT_ID = "__custom__";

export function matchGradientPreset(
  classes: string | undefined,
  presets: GradientPreset[],
): string {
  if (!classes) return presets[0].id;
  const exact = presets.find((p) => p.classes === classes);
  if (exact) return exact.id;
  if (classes.trim()) return CUSTOM_GRADIENT_ID;
  return presets[0].id;
}

export function matchAccentColor(hex: string | undefined): string {
  if (!hex) return ACCENT_COLORS[0].hex;
  const normalized = hex.toLowerCase();
  const exact = ACCENT_COLORS.find((c) => c.hex.toLowerCase() === normalized);
  return exact?.hex ?? hex;
}