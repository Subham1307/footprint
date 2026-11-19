export type Place = {
  id: string;
  name: string;
  region: string;
  description: string;
  category: "visited" | "wishlist";
  mood: string;
  gradient: string;
};

export const places: Place[] = [
  {
    id: "darjeeling",
    name: "Darjeeling",
    region: "West Bengal, India",
    description: "Tea mist, toy trains, and mornings that taste like altitude.",
    category: "visited",
    mood: "Soft light & cedar",
    gradient: "from-teal-900 via-emerald-800 to-slate-900",
  },
  {
    id: "shimla",
    name: "Shimla",
    region: "Himachal Pradesh, India",
    description: "Colonial facades, pine corridors, nostalgia in the rain.",
    category: "visited",
    mood: "Rain on cobblestone",
    gradient: "from-slate-800 via-indigo-900 to-slate-950",
  },
  {
    id: "manali",
    name: "Manali",
    region: "Himachal Pradesh, India",
    description: "River rush, bakery stops, gateway to higher trails.",
    category: "visited",
    mood: "Cold air, warm bread",
    gradient: "from-cyan-900 via-blue-900 to-slate-900",
  },
  {
    id: "spiti",
    name: "Spiti Valley",
    region: "Himachal Pradesh, India",
    description: "Barren beauty, monasteries carved into silence.",
    category: "wishlist",
    mood: "Sky too close",
    gradient: "from-amber-900/80 via-stone-800 to-zinc-950",
  },
  {
    id: "kyoto",
    name: "Kyoto",
    region: "Japan",
    description: "Temple paths, deliberate craft, evenings that feel edited.",
    category: "wishlist",
    mood: "Paper lanterns",
    gradient: "from-rose-900 via-purple-900 to-slate-950",
  },
  {
    id: "lisbon",
    name: "Lisbon",
    region: "Portugal",
    description: "Tile light, tram climbs, fado after midnight.",
    category: "wishlist",
    mood: "Azulejo blue",
    gradient: "from-blue-900 via-indigo-950 to-slate-950",
  },
];