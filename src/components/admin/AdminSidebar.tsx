"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Archive,
  BookOpen,
  Cpu,
  Goal,
  LayoutDashboard,
  MapPinned,
  Mountain,
  PenLine,
  Settings,
  Sparkles,
  Upload,
} from "lucide-react";

const links = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/journal", label: "Journal", icon: PenLine },
  { href: "/admin/memories", label: "Memories", icon: BookOpen },
  { href: "/admin/now", label: "Currently", icon: Sparkles },
  { href: "/admin/places", label: "Places", icon: MapPinned },
  { href: "/admin/collections", label: "Collections", icon: Mountain },
  { href: "/admin/goals", label: "Goals", icon: Goal },
  { href: "/admin/interests", label: "Interests", icon: Sparkles },
  { href: "/admin/digital-world", label: "Digital world", icon: Cpu },
  { href: "/admin/profile", label: "Profile", icon: Settings },
  { href: "/admin/archive", label: "Year archive", icon: Archive },
  { href: "/admin/export", label: "Export data", icon: Upload },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="border-b border-[var(--border)] bg-[var(--bg-elevated)] lg:border-b-0 lg:border-r">
      <div className="px-4 py-5">
        <p className="text-sm font-semibold tracking-[0.16em]">FOOTPRINT.ADMIN</p>
        <p className="text-xs text-[var(--text-muted)]">Personal archive</p>
      </div>
      <nav className="scrollbar-thin flex gap-1 overflow-x-auto px-2 pb-3 lg:flex-col lg:overflow-visible lg:px-3 lg:pb-6">
        {links.map(({ href, label, icon: Icon }) => {
          const active = href === "/admin" ? pathname === href : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex shrink-0 items-center gap-2 rounded-xl px-3 py-2.5 text-sm transition",
                active
                  ? "bg-[var(--bg-subtle)] text-[var(--text-primary)]"
                  : "text-[var(--text-secondary)] hover:bg-[var(--bg-subtle)]/60 hover:text-[var(--text-primary)]",
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}