"use client";

import { useEffect, useState, useCallback } from "react";
import { Lock, Mail, Unlock, Plus, Loader2 } from "lucide-react";
import { useAuth } from "@/lib/use-auth";
import { useRealtime } from "@/lib/use-realtime";
import { capsulesApi } from "@/lib/api";
import { getDaysUntil } from "@/lib/utils";
import { Card } from "./ui/card";
import { cn } from "@/lib/utils";

export function CapsulesScreen() {
  const { user, couple } = useAuth();
  const [capsules, setCapsules] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [newCapsule, setNewCapsule] = useState({ title: "", content: "", open_date: "" });

  const loadCapsules = useCallback(async () => {
    if (!couple) return;
    setIsLoading(true);
    try {
      const { data } = await capsulesApi.list(couple.id);
      setCapsules(data || []);
    } catch {
      setCapsules([]);
    } finally {
      setIsLoading(false);
    }
  }, [couple]);

  useEffect(() => {
    loadCapsules();
  }, [loadCapsules]);

  useRealtime(couple?.id || null, loadCapsules);

  const handleAdd = async () => {
    if (!newCapsule.title.trim() || !newCapsule.content.trim() || !newCapsule.open_date || !couple || !user) return;
    try {
      await capsulesApi.create({
        couple_id: couple.id,
        title: newCapsule.title.trim(),
        content: newCapsule.content.trim(),
        open_date: newCapsule.open_date,
        is_opened: false,
        created_by: user.id,
      });
      setNewCapsule({ title: "", content: "", open_date: "" });
      setShowAdd(false);
      loadCapsules();
    } catch (err) {
      console.error(err);
    }
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
        <h1 className="text-3xl font-bold">Капсулы</h1>
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="p-2 rounded-xl bg-surface border border-border hover:border-accent-pink transition-colors"
        >
          <Plus size={20} />
        </button>
      </div>

      <p className="text-muted text-sm">Письма и послания, которые откроются в будущем. Напишите друг другу что-то тёплое!</p>

      {showAdd && (
        <div className="space-y-2">
          <input
            type="text"
            value={newCapsule.title}
            onChange={(e) => setNewCapsule({ ...newCapsule, title: e.target.value })}
            placeholder="Заголовок (например: На годовщину)..."
            className="w-full px-4 py-3 bg-surface-light border border-border rounded-xl focus:outline-none focus:border-accent-pink"
          />
          <textarea
            value={newCapsule.content}
            onChange={(e) => setNewCapsule({ ...newCapsule, content: e.target.value })}
            placeholder="Текст письма..."
            rows={3}
            className="w-full px-4 py-3 bg-surface-light border border-border rounded-xl focus:outline-none focus:border-accent-pink resize-none"
          />
          <div className="flex gap-2">
            <input
              type="date"
              value={newCapsule.open_date}
              onChange={(e) => setNewCapsule({ ...newCapsule, open_date: e.target.value })}
              className="flex-1 px-4 py-3 bg-surface-light border border-border rounded-xl focus:outline-none focus:border-accent-pink"
            />
            <button onClick={handleAdd} className="px-4 py-3 bg-accent-pink text-white font-medium rounded-xl hover:bg-accent-pink/90 transition-colors">
              Создать
            </button>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {capsules.map((capsule) => {
          const daysLeft = getDaysUntil(capsule.open_date);
          const isLocked = !capsule.is_opened && daysLeft > 0;

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
                    <span className="text-sm">Откроется {new Date(capsule.open_date).toLocaleDateString("ru-RU")}</span>
                  </div>
                </div>
              )}

              <div className="flex items-start gap-4">
                <div className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center shrink-0",
                  capsule.is_opened ? "bg-surface-light" : "bg-accent-pink/20"
                )}>
                  {capsule.is_opened ? <Unlock size={18} className="text-muted" /> : <Mail size={18} className="text-accent-pink" />}
                </div>
                <div className="flex-1">
                  <p className="font-semibold\">{capsule.title}</p>
                  <p className="text-sm text-muted mt-1">
                    {capsule.is_opened
                      ? "Открыто · прочитано"
                      : `Откроется ${new Date(capsule.open_date).toLocaleDateString("ru-RU")} · через ${daysLeft} дней`
                    }
                  </p>
                  {capsule.is_opened && (
                    <p className="mt-3 text-sm text-white/80 italic">"{capsule.content}"</p>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
        {capsules.length === 0 && (
          <p className="text-muted text-center py-8">Пока нет капсул. Напишите первое письмо в будущее!</p>
        )}
      </div>
    </div>
  );
}