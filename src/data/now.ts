export type NowItem = {
  id: string;
  label: string;
  value: string;
  icon: string;
  status?: "active" | "paused" | "exploring";
};

export const nowItems: NowItem[] = [
  {
    id: "learning",
    label: "Currently learning",
    value: "Distributed systems fundamentals & Go concurrency patterns",
    icon: "book-open",
    status: "active",
  },
  {
    id: "building",
    label: "Currently building",
    value: "A personal knowledge garden and this digital HQ",
    icon: "hammer",
    status: "active",
  },
  {
    id: "focus",
    label: "Current focus",
    value: "Deep work mornings, ship small experiments by night",
    icon: "target",
    status: "active",
  },
  {
    id: "interests",
    label: "Current interests",
    value: "Vintage football jerseys, mountain sunrises, slow cinema",
    icon: "sparkles",
    status: "exploring",
  },
];

export const availability = {
  status: "open" as const,
  label: "Open to interesting conversations",
  timezone: "Asia/Kolkata",
};