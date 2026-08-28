"use client";

import { useState } from "react";
import { Lock, Shield, FileText, Unlock } from "lucide-react";
import { Card } from "./ui/card";
import { cn } from "@/lib/utils";

export function DocumentsScreen() {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");

  const handleUnlock = () => {
    if (pin === "1234") {
      setIsUnlocked(true);
      setError("");
    } else {
      setError("Неверный PIN");
    }
  };

  if (!isUnlocked) {
    return (
      <div className="px-4 pt-6 pb-28 space-y-6 animate-fade-in min-h-screen flex flex-col">
        <h1 className="text-3xl font-bold">Документы</h1>

        <div className="flex-1 flex flex-col items-center justify-center space-y-6">
          <div className="w-20 h-20 rounded-full bg-accent-blue/20 flex items-center justify-center">
            <Shield size={36} className="text-accent-blue" />
          </div>

          <div className="text-center space-y-2">
            <h2 className="text-xl font-semibold">Документы под защитой</h2>
            <p className="text-sm text-muted max-w-xs mx-auto">
              Паспорта и полисы видны только после ввода PIN. Остальные разделы открыты как обычно.
            </p>
          </div>

          <div className="w-full max-w-xs space-y-3">
            <input
              type="password"
              inputMode="numeric"
              maxLength={4}
              placeholder="Введите PIN"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-center text-lg tracking-[0.5em] placeholder:tracking-normal placeholder:text-muted focus:outline-none focus:border-accent-blue"
            />
            {error && <p className="text-accent-pink text-sm text-center">{error}</p>}
            <button
              onClick={handleUnlock}
              className="w-full py-3 bg-white text-black font-semibold rounded-xl hover:bg-white/90 transition-colors"
            >
              Разблокировать
            </button>
            <p className="text-xs text-muted text-center">PIN: 1234 (демо)</p>
          </div>
        </div>
      </div>
    );
  }

  const docs = [
    { id: "1", title: "Паспорт Дмитрия", type: "passport" },
    { id: "2", title: "Паспорт Софьи", type: "passport" },
    { id: "3", title: "Полис ОМС", type: "insurance" },
    { id: "4", title: "СНИЛС Дмитрия", type: "other" },
  ];

  return (
    <div className="px-4 pt-6 pb-28 space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Документы</h1>
        <button onClick={() => { setIsUnlocked(false); setPin(""); }} className="p-2 rounded-xl bg-surface text-muted">
          <Lock size={20} />
        </button>
      </div>

      <div className="space-y-3">
        {docs.map((doc) => (
          <Card key={doc.id} className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-surface-light flex items-center justify-center shrink-0">
              <FileText size={22} className="text-accent-blue" />
            </div>
            <div className="flex-1">
              <p className="font-semibold">{doc.title}</p>
              <p className="text-xs text-muted uppercase">{doc.type}</p>
            </div>
            <Unlock size={18} className="text-accent-green" />
          </Card>
        ))}
      </div>

      <button className="w-full py-4 border-2 border-dashed border-border rounded-2xl text-muted font-medium hover:border-accent-blue hover:text-accent-blue transition-colors">
        + Добавить документ
      </button>
    </div>
  );
}
