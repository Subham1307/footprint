export type TimelineEvent = {
  id: string;
  year: string;
  title: string;
  description: string;
  type: "milestone" | "trip" | "memory" | "shift";
};

export const timeline: TimelineEvent[] = [
  {
    id: "first-deploy",
    year: "2019",
    title: "First thing shipped to production",
    description: "A scrappy API that taught me more than any tutorial.",
    type: "milestone",
  },
  {
    id: "darjeeling-trip",
    year: "2021",
    title: "Darjeeling with friends",
    description: "Fog so thick the world felt paused. Best chai debate ever.",
    type: "trip",
  },
  {
    id: "gym-consistency",
    year: "2022",
    title: "Year of showing up",
    description: "Twelve months without missing a planned training week.",
    type: "memory",
  },
  {
    id: "footprint-start",
    year: "2025",
    title: "Started this digital HQ",
    description: "Decided the internet needed one more sincere corner.",
    type: "shift",
  },
  {
    id: "spiti-plan",
    year: "2026",
    title: "Spiti on the calendar",
    description: "Permits, gear lists, and a map covered in sticky notes.",
    type: "trip",
  },
];