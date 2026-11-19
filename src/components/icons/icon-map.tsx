import {
  BookOpen,
  Clapperboard,
  Cpu,
  Dumbbell,
  Hammer,
  LineChart,
  Mountain,
  Music,
  Sparkles,
  Target,
  Trophy,
  type LucideIcon,
} from "lucide-react";

const map: Record<string, LucideIcon> = {
  "book-open": BookOpen,
  hammer: Hammer,
  target: Target,
  sparkles: Sparkles,
  cpu: Cpu,
  trophy: Trophy,
  mountain: Mountain,
  dumbbell: Dumbbell,
  music: Music,
  clapperboard: Clapperboard,
  "line-chart": LineChart,
};

export function DynamicIcon({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  const Icon = map[name] ?? Sparkles;
  return <Icon className={className} strokeWidth={1.75} aria-hidden />;
}