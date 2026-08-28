"use client";

import { Heart, ExternalLink } from "lucide-react";
import { wishes } from "@/lib/data";
import { formatCurrency } from "@/lib/utils";
import { Card } from "./ui/card";
import { cn } from "@/lib/utils";

export function WishesScreen() {
  return (
    <div className="px-4 pt-6 pb-28 space-y-6 animate-fade-in">
      <h1 className="text-3xl font-bold">Хотелки</h1>

      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {["Все", "Софья · 9", "Дмитрий · 6"].map((f, i) => (
          <button
            key={f}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors",
              i === 1 ? "bg-accent-pink text-white" : "bg-surface text-muted border border-border"
            )}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {wishes.map((wish) => (
          <Card key={wish.id} className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-surface-light flex items-center justify-center shrink-0">
              <Heart size={24} className="text-muted opacity-30" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold truncate">{wish.title}</p>
              {wish.price && <p className="text-sm text-muted">{formatCurrency(wish.price, wish.currency)}</p>}
              {!wish.price && <p className="text-sm text-muted">без цены</p>}
            </div>
            {wish.priority === "dream" && (
              <span className="px-2 py-1 bg-accent-pink/20 text-accent-pink text-xs font-medium rounded-lg shrink-0">
                очень хочу
              </span>
            )}
            {wish.link && (
              <a href={wish.link} target="_blank" rel="noopener noreferrer" className="shrink-0 text-muted hover:text-white">
                <ExternalLink size={18} />
              </a>
            )}
          </Card>
        ))}
      </div>

      <button className="w-full py-4 border-2 border-dashed border-border rounded-2xl text-muted font-medium hover:border-accent-pink hover:text-accent-pink transition-colors">
        + Добавить хотелку
      </button>
    </div>
  );
}
