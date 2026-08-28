"use client";

import { useEffect, useState, useCallback } from "react";
import { Heart, ExternalLink, Plus, Loader2, Link as LinkIcon } from "lucide-react";
import { useAuth } from "@/lib/use-auth";
import { useRealtime } from "@/lib/use-realtime";
import { wishesApi } from "@/lib/api";
import { formatCurrency } from "@/lib/utils";
import { Card } from "./ui/card";
import { cn } from "@/lib/utils";

export function WishesScreen() {
  const { user, couple } = useAuth();
  const [wishes, setWishes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [newWish, setNewWish] = useState({ title: "", link: "", price: "", comment: "" });

  const loadWishes = useCallback(async () => {
    if (!couple) return;
    setIsLoading(true);
    try {
      const { data } = await wishesApi.list(couple.id);
      setWishes(data || []);
    } catch {
      setWishes([]);
    } finally {
      setIsLoading(false);
    }
  }, [couple]);

  useEffect(() => {
    loadWishes();
  }, [loadWishes]);

  useRealtime(couple?.id || null, loadWishes);

  const handleAdd = async () => {
    if (!newWish.title.trim() || !couple || !user) return;
    try {
      await wishesApi.create({
        couple_id: couple.id,
        title: newWish.title.trim(),
        link: newWish.link.trim() || null,
        price: newWish.price ? parseFloat(newWish.price) : null,
        currency: "RUB",
        comment: newWish.comment.trim() || null,
        created_by: user.id,
      });
      setNewWish({ title: "", link: "", price: "", comment: "" });
      setShowAdd(false);
      loadWishes();
    } catch (err) {
      console.error(err);
    }
  };

  const getDomain = (url: string) => {
    try { return new URL(url).hostname.replace("www.", ""); } catch { return url; }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 size={32} className="animate-spin text-accent-pink" />
      </div>
    );
  }

  return (
    <div className="px-4 pt-6 pb-28 space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Хотелки</h1>
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="p-2 rounded-xl bg-surface border border-border hover:border-accent-pink transition-colors"
        >
          <Plus size={20} />
        </button>
      </div>

      {showAdd && (
        <div className="space-y-2">
          <input
            type="text"
            value={newWish.title}
            onChange={(e) => setNewWish({ ...newWish, title: e.target.value })}
            placeholder="Название товара..."
            className="w-full px-4 py-3 bg-surface-light border border-border rounded-xl focus:outline-none focus:border-accent-pink"
          />
          <input
            type="url"
            value={newWish.link}
            onChange={(e) => setNewWish({ ...newWish, link: e.target.value })}
            placeholder="Ссылка на товар..."
            className="w-full px-4 py-3 bg-surface-light border border-border rounded-xl focus:outline-none focus:border-accent-pink"
          />
          <div className="flex gap-2">
            <input
              type="number"
              value={newWish.price}
              onChange={(e) => setNewWish({ ...newWish, price: e.target.value })}
              placeholder="Цена"
              className="flex-1 px-4 py-3 bg-surface-light border border-border rounded-xl focus:outline-none focus:border-accent-pink"
            />
            <button onClick={handleAdd} className="px-4 py-3 bg-accent-pink text-white font-medium rounded-xl hover:bg-accent-pink/90 transition-colors">
              Добавить
            </button>
          </div>
          <input
            type="text"
            value={newWish.comment}
            onChange={(e) => setNewWish({ ...newWish, comment: e.target.value })}
            placeholder="Комментарий (опционально)..."
            className="w-full px-4 py-3 bg-surface-light border border-border rounded-xl focus:outline-none focus:border-accent-pink"
          />
        </div>
      )}

      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {["Все", "Данюля", "Викуля"].map((f, i) => (
          <button
            key={f}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors",
              i === 0 ? "bg-accent-pink text-white" : "bg-surface text-muted border border-border"
            )}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {wishes.map((wish) => (
          <Card key={wish.id} className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-xl bg-surface-light flex items-center justify-center shrink-0 overflow-hidden">
              {wish.link ? (
                <div className="w-full h-full flex flex-col items-center justify-center text-muted">
                  <LinkIcon size={20} />
                  <span className="text-[9px] mt-0.5 truncate max-w-[56px] px-1">{getDomain(wish.link)}</span>
                </div>
              ) : (
                <Heart size={24} className="text-muted opacity-30" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold truncate">{wish.title}</p>
              {wish.price && <p className="text-sm text-muted">{formatCurrency(wish.price, wish.currency || "RUB")}</p>}
              {wish.comment && <p className="text-xs text-muted mt-1\">{wish.comment}</p>}
            </div>
            {wish.link && (
              <a href={wish.link} target="_blank" rel="noopener noreferrer" className="shrink-0 text-muted hover:text-white p-1">
                <ExternalLink size={18} />
              </a>
            )}
          </Card>
        ))}
        {wishes.length === 0 && (
          <p className="text-muted text-center py-8">Пока нет хотелок. Добавьте первую!</p>
        )}
      </div>
    </div>
  );
}