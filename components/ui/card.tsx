"use client";

import { cn } from "@/lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  accent?: "blue" | "pink" | "coral" | "green" | "teal";
}

export function Card({ className, accent, children, ...props }: CardProps) {
  const accentBorder = accent
    ? {
        blue: "border-l-4 border-l-accent-blue",
        pink: "border-l-4 border-l-accent-pink",
        coral: "border-l-4 border-l-accent-coral",
        green: "border-l-4 border-l-accent-green",
        teal: "border-l-4 border-l-accent-teal",
      }[accent]
    : "";

  return (
    <div
      className={cn(
        "bg-surface rounded-2xl p-4 border border-border",
        accentBorder,
        "active:scale-[0.98] transition-transform",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
