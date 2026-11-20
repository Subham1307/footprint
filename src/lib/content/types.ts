export type ContentSource = "database" | "static";

export type PublicJournalEntry = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  category: "thought" | "idea" | "observation" | "reflection";
  publishedAt: string;
  eventDate: string;
  recordedAt?: string;
  tags: string[];
  isPublic: boolean;
};

export type PublicMemory = {
  id: string;
  year: string;
  title: string;
  description: string;
  type: "milestone" | "trip" | "memory" | "shift";
  eventDate: string;
  location?: string;
};

export type PublicNowItem = {
  id: string;
  label: string;
  value: string;
  icon: string;
  status?: "active" | "paused" | "exploring";
};

export type PublicPlace = {
  id: string;
  name: string;
  region: string;
  country?: string;
  locationName?: string;
  description: string;
  category: "visited" | "wishlist";
  mood: string;
  gradient: string;
  latitude?: number | null;
  longitude?: number | null;
  firstVisitedDate?: string;
  imageUrls?: string[];
};

export type PublicCollectionItem = {
  id: string;
  title: string;
  description: string;
  url?: string;
  type: string;
  tags: string[];
  eventDate?: string;
};

export type PublicInterest = {
  slug: string;
  title: string;
  tagline: string;
  description: string;
  icon: string;
  gradient: string;
  accent: string;
  highlights: string[];
};

export type PublicDigitalItem = {
  id: string;
  name: string;
  detail: string;
  category: "device" | "os" | "software" | "devtool";
};

export type PublicSiteMeta = {
  name: string;
  wordmark: string;
  owner: string;
  email: string;
  tagline: string;
  aboutMarkdown?: string;
  copyrightYear: number;
  social: {
    github: string;
    twitter: string;
    linkedin: string;
    instagram: string;
  };
};

export type YearArchiveBundle = {
  year: number;
  journals: PublicJournalEntry[];
  memories: PublicMemory[];
  places: PublicPlace[];
  collections: PublicCollectionItem[];
  goals: { id: string; title: string; status: string; eventDate?: string }[];
  lifePeriods: {
    id: string;
    effectiveFrom: string;
    effectiveTo?: string;
    items: { type: string; label?: string; content: string }[];
  }[];
};