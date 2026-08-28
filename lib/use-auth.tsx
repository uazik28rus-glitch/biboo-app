"use client";

import { useState, useEffect, createContext, useContext } from "react";
import { authTelegram, getCouple } from "./api";

export type User = {
  id: string;
  telegram_id: string;
  first_name: string;
  last_name?: string;
  username?: string;
  avatar_url?: string;
};

export type Couple = {
  id: string;
  user1_id: string;
  user2_id: string | null;
  start_date: string;
  invite_code: string;
  name?: string;
};

type AuthState = {
  user: User | null;
  couple: Couple | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  needsCouple: boolean;
};

const AuthContext = createContext<AuthState & { refresh: () => void }>({
  user: null,
  couple: null,
  isLoading: true,
  isAuthenticated: false,
  needsCouple: false,
  refresh: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    couple: null,
    isLoading: true,
    isAuthenticated: false,
    needsCouple: false,
  });

  const initAuth = async () => {
    try {
      // Проверяем localStorage
      const storedUser = localStorage.getItem("biba_user");
      if (!storedUser) {
        setState((s) => ({ ...s, isLoading: false }));
        return;
      }

      const user: User = JSON.parse(storedUser);
      const { couple } = await getCouple(user.id);

      setState({
        user,
        couple,
        isLoading: false,
        isAuthenticated: true,
        needsCouple: !couple,
      });
    } catch {
      localStorage.removeItem("biba_user");
      setState({
        user: null,
        couple: null,
        isLoading: false,
        isAuthenticated: false,
        needsCouple: false,
      });
    }
  };

  useEffect(() => {
    initAuth();
  }, []);

  const refresh = () => initAuth();

  return (
    <AuthContext.Provider value={{ ...state, refresh }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

// Telegram WebApp auth
export async function loginWithTelegram(): Promise<{ user: User; couple: Couple | null }> {
  const tg = (window as any).Telegram?.WebApp;
  if (!tg) {
    throw new Error("Not in Telegram WebApp");
  }

  const initData = tg.initData;
  if (!initData) {
    throw new Error("No initData");
  }

  const result = await authTelegram(initData);
  localStorage.setItem("biba_user", JSON.stringify(result.user));
  return result;
}
