"use client";

import { Lock, Mail, Unlock } from "lucide-react";
import { capsules } from "@/lib/data";
import { getDaysUntil } from "@/lib/utils";
import { Card } from "./ui/card";
import { cn } from "@/lib/utils";

export function CapsulesScreen() {
  return (
    <div className="px-4 pt-6 pb-28 space-y-6 animate-fade-in">
      <h1 className="text-3xl font-bold">Капсулы</h1>
      <p className="text-muted text-sm">Письма, которые откроются в будущем</p>

      <div className="space-y-4">
        {capsules.map((capsule) => {
          const daysLeft = getDaysUntil(capsule.openDate);
          const isLocked = !capsule.isOpened && daysLeft > 0;

          return (
            <Card
              key={capsule.id}
              className={cn(
                "relative overflow-hidden",
                isLocked ? "opacity-80" : "border-l-4 border-l-accent-pink"
              )}
            >
              {isLocked && (
                <div className="absolute inset-0 bg-surface/50 backdrop-blur-[1px] z-10 flex items-center justify-center">
                  <div className="flex items-center gap-2 text-muted">
                    <Lock size={18} />
                    <span className="text-sm">Откроется {new Date(capsule.openDate).toLocaleDateString("ru-RU")}</span>
                  </div>
                </div>
              )}

              <div className="flex items-start gap-4">
                <div className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center shrink-0",
                  capsule.isOpened ? "bg-surface-light" : "bg-accent-pink/20"
                )}>
                  {capsule.isOpened ? <Unlock size={18} className="text-muted" /> : <Mail size={18} className="text-accent-pink" />}
                </div>
                <div className="flex-1">
                  <p className="font-semibold">{capsule.title}</p>
                  <p className="text-sm text-muted mt-1">
                    {capsule.isOpened
                      ? "Открыто · прочитано"
                      : `Откроется ${new Date(capsule.openDate).toLocaleDateString("ru-RU")} · через ${daysLeft} дней`
                    }
                  </p>
                  {capsule.isOpened && (
                    <p className="mt-3 text-sm text-white/80 italic">"{capsule.content}"</p>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <button className="w-full py-4 border-2 border-dashed border-border rounded-2xl text-muted font-medium hover:border-accent-pink hover:text-accent-pink transition-colors">
        + Написать письмо в будущее
      </button>
    </div>
  );
}
