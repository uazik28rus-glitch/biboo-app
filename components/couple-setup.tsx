"use client";

import { useState } from "react";
import { Copy, Loader2, Users } from "lucide-react";
import { useAuth } from "@/lib/use-auth";
import { createCouple, joinCouple } from "@/lib/api";
import { Card } from "./ui/card";
import { cn } from "@/lib/utils";

export function CoupleSetup() {
  const { user, refresh } = useAuth();
  const [mode, setMode] = useState<"choose" | "create" | "join">("choose");
  const [startDate, setStartDate] = useState("2021-10-12");
  const [inviteCode, setInviteCode] = useState("");
  const [createdCode, setCreatedCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCreate = async () => {
    if (!user) return;
    setIsLoading(true);
    setError("");
    try {
      const { couple } = await createCouple(user.id, startDate);
      setCreatedCode(couple.invite_code);
      refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleJoin = async () => {
    if (!user) return;
    setIsLoading(true);
    setError("");
    try {
      await joinCouple(user.id, inviteCode);
      refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (mode === "create") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 space-y-6">
        <Users size={48} className="text-accent-pink" />
        <h2 className="text-2xl font-bold">Создать пару</h2>

        <Card className="w-full max-w-sm space-y-4">
          <div>
            <label className="text-sm text-muted mb-1 block">Дата начала отношений</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-4 py-3 bg-surface-light border border-border rounded-xl focus:outline-none focus:border-accent-pink"
            />
          </div>

          {createdCode ? (
            <div className="space-y-3">
              <div className="p-4 bg-accent-pink/10 rounded-xl border border-accent-pink/30">
                <p className="text-sm text-muted mb-1">Код приглашения для второй половинки:</p>
                <div className="flex items-center gap-2">
                  <code className="text-2xl font-bold tracking-widest">{createdCode}</code>
                  <button
                    onClick={() => navigator.clipboard.writeText(createdCode)}
                    className="p-2 rounded-lg bg-surface hover:bg-surface-light transition-colors"
                  >
                    <Copy size={16} />
                  </button>
                </div>
              </div>
              <p className="text-sm text-muted">Отправь этот код своей второй половинке. Как только она введёт его — вы будете связаны.</p>
            </div>
          ) : (
            <button
              onClick={handleCreate}
              disabled={isLoading}
              className="w-full py-3.5 bg-accent-pink text-white font-semibold rounded-xl flex items-center justify-center gap-2 hover:bg-accent-pink/90 transition-colors disabled:opacity-50"
            >
              {isLoading ? <Loader2 size={20} className="animate-spin" /> : "Создать пару"}
            </button>
          )}
        </Card>

        <button onClick={() => setMode("choose")} className="text-sm text-muted hover:text-white">
          ← Назад
        </button>
        {error && <p className="text-accent-coral text-sm">{error}</p>}
      </div>
    );
  }

  if (mode === "join") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 space-y-6">
        <Users size={48} className="text-accent-blue" />
        <h2 className="text-2xl font-bold">Присоединиться к паре</h2>

        <Card className="w-full max-w-sm space-y-4">
          <div>
            <label className="text-sm text-muted mb-1 block">Код приглашения</label>
            <input
              type="text"
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
              placeholder="A1B2C3"
              maxLength={6}
              className="w-full px-4 py-3 bg-surface-light border border-border rounded-xl text-center text-xl tracking-[0.3em] font-bold uppercase placeholder:tracking-normal placeholder:font-normal placeholder:text-muted focus:outline-none focus:border-accent-blue"
            />
          </div>

          <button
            onClick={handleJoin}
            disabled={isLoading || inviteCode.length !== 6}
            className="w-full py-3.5 bg-accent-blue text-white font-semibold rounded-xl flex items-center justify-center gap-2 hover:bg-accent-blue/90 transition-colors disabled:opacity-50"
          >
            {isLoading ? <Loader2 size={20} className="animate-spin" /> : "Присоединиться"}
          </button>
        </Card>

        <button onClick={() => setMode("choose")} className="text-sm text-muted hover:text-white">
          ← Назад
        </button>
        {error && <p className="text-accent-coral text-sm">{error}</p>}
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 space-y-8">
      <div className="text-center space-y-2">
        <Users size={48} className="mx-auto text-accent-pink" />
        <h2 className="text-2xl font-bold">Давайте создадим пару</h2>
        <p className="text-muted">Чтобы начать пользоваться приложением вдвоём</p>
      </div>

      <div className="w-full max-w-sm space-y-3">
        <button
          onClick={() => setMode("create")}
          className={cn(
            "w-full p-5 bg-surface border border-border rounded-2xl text-left",
            "hover:border-accent-pink transition-colors active:scale-[0.98]"
          )}
        >
          <p className="font-semibold text-lg">Создать новую пару</p>
          <p className="text-sm text-muted mt-1">Я первый, отправлю приглашение</p>
        </button>

        <button
          onClick={() => setMode("join")}
          className={cn(
            "w-full p-5 bg-surface border border-border rounded-2xl text-left",
            "hover:border-accent-blue transition-colors active:scale-[0.98]"
          )}
        >
          <p className="font-semibold text-lg">Присоединиться</p>
          <p className="text-sm text-muted mt-1">У меня есть код приглашения</p>
        </button>
      </div>
    </div>
  );
}
