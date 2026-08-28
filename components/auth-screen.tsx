"use client";

import { useState } from "react";
import { Heart, Loader2 } from "lucide-react";
import { loginWithTelegram } from "@/lib/use-auth";
import { Card } from "./ui/card";

export function AuthScreen() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setIsLoading(true);
    setError("");
    try {
      await loginWithTelegram();
      window.location.reload();
    } catch (err: any) {
      setError(err.message || "Ошибка входа");
    } finally {
      setIsLoading(false);
    }
  };

  // Демо-режим (для тестов без Telegram)
  const handleDemo = () => {
    const demoUser = {
      id: "demo-user-1",
      telegram_id: 123456,
      first_name: "Дмитрий",
      last_name: "",
      username: "dmitry",
    };
    localStorage.setItem("biba_user", JSON.stringify(demoUser));
    window.location.reload();
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 space-y-8">
      <div className="text-center space-y-4">
        <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-accent-blue to-accent-pink flex items-center justify-center">
          <Heart size={36} className="text-white fill-white" />
        </div>
        <h1 className="text-4xl font-bold">Биба</h1>
        <p className="text-muted">Приложение для тех, кто вместе</p>
      </div>

      <Card className="w-full max-w-sm space-y-4">
        <button
          onClick={handleLogin}
          disabled={isLoading}
          className="w-full py-3.5 bg-white text-black font-semibold rounded-xl flex items-center justify-center gap-2 hover:bg-white/90 transition-colors disabled:opacity-50"
        >
          {isLoading ? <Loader2 size={20} className="animate-spin" /> : "Войти через Telegram"}
        </button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-surface px-2 text-muted">или</span>
          </div>
        </div>

        <button
          onClick={handleDemo}
          className="w-full py-3 border border-border text-muted font-medium rounded-xl hover:border-accent-blue hover:text-accent-blue transition-colors"
        >
          Демо-режим
        </button>
      </Card>

      {error && <p className="text-accent-pink text-sm">{error}</p>}

      <p className="text-xs text-muted text-center max-w-xs">
        Для использования нужен Telegram. Данные хранятся только для вас двоих.
      </p>
    </div>
  );
}
