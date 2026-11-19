export type Interest = {
  slug: string;
  title: string;
  tagline: string;
  description: string;
  icon: string;
  gradient: string;
  accent: string;
  highlights: string[];
};

export const interests: Interest[] = [
  {
    slug: "technology",
    title: "Technology",
    tagline: "Software & craft",
    description:
      "I care about thoughtful engineering — clean abstractions, reliable systems, and tools that disappear when they work well.",
    icon: "cpu",
    gradient: "from-violet-500/20 via-blue-500/10 to-transparent",
    accent: "#8b7cf8",
    highlights: [
      "TypeScript & Go for everyday building",
      "Enjoying the calm of well-designed CLIs",
      "Fascinated by local-first and edge computing",
    ],
  },
  {
    slug: "football",
    title: "Football",
    tagline: "The beautiful game",
    description:
      "Matchday rituals, tactical rabbit holes, and the stories clubs carry across generations.",
    icon: "trophy",
    gradient: "from-emerald-500/15 via-teal-500/10 to-transparent",
    accent: "#34d399",
    highlights: [
      "Late-night UCL replays",
      "Collecting stories more than stats",
      "Grassroots football when I can",
    ],
  },
  {
    slug: "mountains",
    title: "Mountains & travel",
    tagline: "Higher ground",
    description:
      "Trails, thin air, and the quiet clarity that only shows up above the tree line.",
    icon: "mountain",
    gradient: "from-sky-500/20 via-cyan-500/5 to-transparent",
    accent: "#38bdf8",
    highlights: [
      "Himalayan treks on the bucket list",
      "Slow travel over checklist tourism",
      "Maps as mood boards",
    ],
  },
  {
    slug: "fitness",
    title: "Fitness",
    tagline: "Strength & discipline",
    description:
      "Training as a long conversation with yourself — progressive overload, consistency, recovery.",
    icon: "dumbbell",
    gradient: "from-rose-500/15 via-orange-500/10 to-transparent",
    accent: "#fb7185",
    highlights: [
      "Push/pull/legs with intent",
      "Tracking sleep like a training variable",
      "Post-leg-day stair memes",
    ],
  },
  {
    slug: "music",
    title: "Music",
    tagline: "Soundtracks to days",
    description:
      "From focus playlists to road-trip records — music colours memory better than photos sometimes.",
    icon: "music",
    gradient: "from-fuchsia-500/15 via-violet-500/10 to-transparent",
    accent: "#e879f9",
    highlights: [
      "Ambient for deep work",
      "Indie & alt on repeat",
      "Live sets when cities allow",
    ],
  },
  {
    slug: "movies",
    title: "Movies",
    tagline: "Frames & feelings",
    description:
      "Cinema as empathy machine — slow burns, sharp dialogue, directors who trust the audience.",
    icon: "clapperboard",
    gradient: "from-amber-500/15 via-yellow-500/5 to-transparent",
    accent: "#fbbf24",
    highlights: [
      "A24-era mood pieces",
      "Rewatching comfort films annually",
      "Letterboxd as a diary",
    ],
  },
  {
    slug: "finance",
    title: "Personal finance",
    tagline: "Quiet compounding",
    description:
      "Money as a tool for optionality — simple systems, long horizons, no performance theatre.",
    icon: "line-chart",
    gradient: "from-lime-500/10 via-green-500/10 to-transparent",
    accent: "#a3e635",
    highlights: [
      "Index-first investing mindset",
      "Spreadsheets I'm weirdly proud of",
      "Learning macro from podcasts",
    ],
  },
];

export function getInterestBySlug(slug: string): Interest | undefined {
  return interests.find((i) => i.slug === slug);
}