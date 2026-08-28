"use client";

import { cn } from "@/lib/utils";

interface ProgressBarProps {
  current: number;
  target: number;
  color?: "green" | "coral" | "blue" | "pink";
  showOverflow?: boolean;
}

export function ProgressBar({ current, target, color = "green", showOverflow }: ProgressBarProps) {
  const percentage = Math.min((current / target) * 100, 100);
  const overflow = current > target;

  const colorClass = {
    green: "bg-accent-green",
    coral: "bg-accent-coral",
    blue: "bg-accent-blue",
    pink: "bg-accent-pink",
  }[color];

  return (
    <div className="w-full">
      <div className="h-1.5 bg-surface-light rounded-full overflow-hidden">
        <div className={cn("h-full rounded-full transition-all", colorClass)} style={{ width: `${percentage}%` }} />
      </div>
      {showOverflow && overflow && (
        <p className="text-accent-coral text-xs mt-1">+{(current - target).toLocaleString()} ₽ перерасход</p>
      )}
    </div>
  );
}
