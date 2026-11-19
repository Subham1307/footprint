"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { cn } from "@/lib/utils";

type BentoCardProps = {
  children: React.ReactNode;
  className?: string;
  href?: string;
  span?: "sm" | "md" | "lg";
  gradient?: string;
};

function trackPointer(event: React.MouseEvent<HTMLDivElement>) {
  const el = event.currentTarget;
  const rect = el.getBoundingClientRect();
  el.style.setProperty("--mx", `${event.clientX - rect.left}px`);
  el.style.setProperty("--my", `${event.clientY - rect.top}px`);
}

const spanClass = {
  sm: "",
  md: "md:col-span-2",
  lg: "md:col-span-2 lg:col-span-3",
};

export function BentoCard({
  children,
  className,
  href,
  span = "sm",
  gradient,
}: BentoCardProps) {
  const inner = (
    <motion.div
      onMouseMove={trackPointer}
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 380, damping: 28 }}
      className={cn(
        "surface-card group relative h-full overflow-hidden p-5 md:p-6",
        "transition-colors duration-300 hover:border-[var(--border-strong)]",
        spanClass[span],
        href && "cursor-pointer",
        className,
      )}
    >
      {gradient ? (
        <div
          className={cn(
            "pointer-events-none absolute inset-0 bg-gradient-to-br opacity-60 transition-opacity group-hover:opacity-80",
            gradient,
          )}
        />
      ) : null}
      <div className="spotlight" aria-hidden />
      <div className="relative z-[1]">{children}</div>
    </motion.div>
  );

  if (href) {
    return (
      <Link href={href} className="block h-full outline-offset-4">
        {inner}
      </Link>
    );
  }

  return inner;
}