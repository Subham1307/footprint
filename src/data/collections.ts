export type CollectionItem = {
  id: string;
  title: string;
  description: string;
  url?: string;
  type: "website" | "tool" | "book" | "article" | "music" | "movie" | "discovery";
  tags: string[];
};

export const collections: CollectionItem[] = [
  {
    id: "linear",
    title: "Linear",
    description: "Issue tracking that respects your eyes and your flow state.",
    url: "https://linear.app",
    type: "tool",
    tags: ["productivity", "design"],
  },
  {
    id: "are-na",
    title: "Are.na",
    description: "Visual research lanes for ideas that don't fit folders.",
    url: "https://www.are.na",
    type: "website",
    tags: ["inspiration", "archive"],
  },
  {
    id: "working-in-public",
    title: "Working in Public",
    description: "Nadia Egbhal on open source culture and maintainer psychology.",
    type: "book",
    tags: ["tech", "community"],
  },
  {
    id: "local-first",
    title: "Local-first software essay",
    description: "Ink & Switch on ownership, sync, and humane collaboration.",
    type: "article",
    tags: ["engineering", "future"],
  },
  {
    id: "khruangbin",
    title: "Khruangbin",
    description: "Texas funk-psych for late-night tinkering sessions.",
    type: "music",
    tags: ["focus", "vinyl mood"],
  },
  {
    id: "past-lives",
    title: "Past Lives",
    description: "A film about paths not taken — quiet and devastating.",
    type: "movie",
    tags: ["cinema", "slow"],
  },
  {
    id: "excalidraw",
    title: "Excalidraw",
    description: "Hand-drawn diagrams that make thinking feel playful.",
    url: "https://excalidraw.com",
    type: "tool",
    tags: ["sketch", "explain"],
  },
  {
    id: "earth-geomagnetic",
    title: "Geomagnetic storm tracker",
    description: "Found a beautiful NOAA visualization — hours disappeared.",
    type: "discovery",
    tags: ["rabbit hole", "science"],
  },
];