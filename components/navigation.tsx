"use client";

import { useRouter, usePathname } from "next/navigation";
import { Home, CheckSquare, Calendar, Wallet, Heart, Lock, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { tgHaptic } from "@/lib/telegram";

const navItems = [
  { href: "/", icon: Home, label: "Мы" },
  { href: "/tasks", icon: CheckSquare, label: "Задачи" },
  { href: "/calendar", icon: Calendar, label: "Календарь" },
  { href: "/budget", icon: Wallet, label: "Бюджет" },
  { href: "/wishes", icon: Heart, label: "Хотелки" },
  { href: "/capsules", icon: Clock, label: "Капсулы" },
  { href: "/documents", icon: Lock, label: "Доки" },
];

export function Navigation() {
  const router = useRouter();
  const pathname = usePathname();

  const handleNav = (href: string) => {
    tgHaptic("light");
    router.push(href);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-lg border-t border-border">
      <div className="flex items-center justify-around py-1 max-w-md mx-auto overflow-x-auto scrollbar-hide">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <button
              key={item.href}
              onClick={() => handleNav(item.href)}
              className={cn(
                "flex flex-col items-center gap-0.5 px-2 py-1 rounded-xl transition-colors min-w-[48px]",
                isActive ? "text-accent-pink" : "text-muted"
              )}
            >
              <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[9px] font-medium whitespace-nowrap">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}