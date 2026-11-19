export type JournalEntry = {
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  category: "thought" | "idea" | "observation" | "reflection";
  publishedAt: string;
};

export const journalEntries: JournalEntry[] = [
  {
    slug: "small-websites-matter",
    title: "Small websites still matter",
    excerpt:
      "The web feels loud. A personal site is a quiet room you decorate for yourself.",
    category: "reflection",
    publishedAt: "2026-03-08",
    body: `There's something radical about maintaining a small website in 2026.

Not for leads, not for hiring funnels — just a place where your tastes accumulate honestly.

I've been thinking about how bookmarks rot while personal sites age like journals. Every redesign is a chapter.

This footprint is my attempt to keep that chapter open.`,
  },
  {
    slug: "morning-focus-block",
    title: "The 90-minute morning block",
    excerpt:
      "Protecting the first hours changes the texture of the entire day.",
    category: "observation",
    publishedAt: "2026-02-19",
    body: `No notifications. One hard problem. Coffee cooling at the edge of awareness.

When I respect the morning block, afternoons become collaborative instead of reactive.

It's not hustle culture — it's boundary culture.`,
  },
  {
    slug: "mountain-memory",
    title: "Memory smells like pine",
    excerpt: "A note from a trail I haven't finished writing about yet.",
    category: "thought",
    publishedAt: "2026-01-30",
    body: `Altitude thins the air and thickens thought.

I keep a list of peaks I want to greet at sunrise. Not for photos — for the version of me that only shows up when legs burn and phones die.

More on that trek soon.`,
  },
  {
    slug: "tools-that-vanish",
    title: "Tools that vanish",
    excerpt: "The best software feels like furniture — present, reliable, unremarkable.",
    category: "idea",
    publishedAt: "2025-12-12",
    body: `I'm drawn to tools that don't demand attention.

Editors that boot instantly. Sync that Just Works. CLIs with thoughtful defaults.

Building this site, I'm trying to practice that same restraint in the interface.`,
  },
  {
    slug: "football-poetry",
    title: "Football is regional poetry",
    excerpt: "Chants, colours, and the way cities breathe on derby day.",
    category: "thought",
    publishedAt: "2025-11-02",
    body: `Statistics explain outcomes; folklore explains meaning.

I love how a club's history lives in pub debates and faded scarves — data can't capture all of it, and that's fine.`,
  },
];

export function getJournalEntry(slug: string): JournalEntry | undefined {
  return journalEntries.find((e) => e.slug === slug);
}