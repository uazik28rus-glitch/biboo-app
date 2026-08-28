import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getDaysTogether(startDate: string): number {
  const start = new Date(startDate);
  const now = new Date();
  return Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
}

export function getDaysUntil(date: string): number {
  const target = new Date(date);
  const now = new Date();
  return Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

export function formatCurrency(amount: number, currency: string = "RUB"): string {
  const symbols: Record<string, string> = { RUB: "₽", USD: "$", CNY: "¥", JPY: "¥", EUR: "€" };
  const symbol = symbols[currency] || currency;
  if (currency === "JPY" || currency === "CNY") return `${symbol}${amount.toLocaleString("ru-RU")}`;
  return `${amount.toLocaleString("ru-RU")} ${symbol}`;
}
