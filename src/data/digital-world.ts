export type DigitalItem = {
  id: string;
  name: string;
  detail: string;
  category: "device" | "os" | "software" | "devtool";
};

export const digitalWorld: DigitalItem[] = [
  {
    id: "laptop",
    name: "MacBook Pro 14\"",
    detail: "Daily driver — code, writing, occasional Lightroom.",
    category: "device",
  },
  {
    id: "phone",
    name: "Android flagship",
    detail: "Photos, maps, offline playlists on trips.",
    category: "device",
  },
  {
    id: "headphones",
    name: "Over-ear ANC",
    detail: "Focus cocoon for deep work blocks.",
    category: "device",
  },
  {
    id: "os-mac",
    name: "macOS",
    detail: "Primary workspace, tuned for calm defaults.",
    category: "os",
  },
  {
    id: "os-linux",
    name: "Linux (Fedora)",
    detail: "Servers, experiments, and homelab tinkering.",
    category: "os",
  },
  {
    id: "cursor",
    name: "Cursor",
    detail: "Editor home base with thoughtful AI pairing.",
    category: "software",
  },
  {
    id: "figma",
    name: "Figma",
    detail: "Layout explorations before pixels hit code.",
    category: "software",
  },
  {
    id: "notion",
    name: "Notion",
    detail: "Loose notes — exported often so it stays honest.",
    category: "software",
  },
  {
    id: "git",
    name: "Git & GitHub",
    detail: "Version control as external memory.",
    category: "devtool",
  },
  {
    id: "docker",
    name: "Docker",
    detail: "Reproducible environments without drama.",
    category: "devtool",
  },
  {
    id: "vite",
    name: "Vite / Next",
    detail: "Fast feedback loops for UI work.",
    category: "devtool",
  },
];