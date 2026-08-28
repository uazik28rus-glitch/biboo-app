"use client";

import { useEffect, useState, useCallback } from "react";
import { Heart, Calendar, CheckSquare, FileText, Gift, Clock, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/use-auth";
import { useRealtime } from "@/lib/use-realtime";
import { tasksApi, eventsApi, wishesApi, capsulesApi } from "@/lib/api";
import { getDaysTogether, getDaysUntil } from "@/lib/utils";
import { tgHaptic } from "@/lib/telegram";
import { Card } from "./ui/card";

export function HomeScreen() {
  const router = useRouter();
  const { user, couple } = useAuth();
  const [stats, setStats] = useState({
    tasks: 0,
    wishes: 0,
    events: 0,
    documents: 0,
    loading: true,
  });
  const [upcomingEvent, setUpcomingEvent] = useState<any>(null);
  const [upcomingCapsule, setUpcomingCapsule] = useState<any>(null);

  const loadData = useCallback(async () => {
    if (!couple) return;
    try {
      const [tasksRes, eventsRes, wishesRes, capsulesRes] = await Promise.all([
        tasksApi.list(couple.id),
        eventsApi.list(couple.id),
        wishesApi.list(couple.id),
        capsulesApi.list(couple.id),
      ]);

      const freeTasks = tasksRes.data?.filter((t: any) => t.status === "free").length || 0;
      const wishesCount = wishesRes.data?.length || 0;
      const eventsCount = eventsRes.data?.length || 0;

      const sortedEvents = eventsRes.data
        ?.filter((e: any) => new Date(e.date) >= new Date())
        .sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime());

      const sortedCapsules = capsulesRes.data
        ?.filter((c: any) => !c.is_opened && new Date(c.open_date) > new Date())
        .sort((a: any, b: any) => new Date(a.open_date).getTime() - new Date(b.open_date).getTime());

      setStats({
        tasks: freeTasks,
        wishes: wishesCount,
        events: eventsCount,
        documents: 0,
        loading: false,
      });
      setUpcomingEvent(sortedEvents?.[0] || null);
      setUpcomingCapsule(sortedCapsules?.[0] || null);
    } catch {
      setStats((s) => ({ ...s, loading: false }));
    }
  }, [couple]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useRealtime(couple?.id || null, loadData);

  const days = couple ? getDaysTogether(couple.start_date) : 0;
  const partnerName = couple?.user1_id === user?.id ? "Софья" : "Дмитрий";

  const sections = [
    { href: "/tasks", icon: CheckSquare, accent: "blue" as const, title: "Задачи", value: `${stats.tasks} свободных` },
    { href: "/wishes", icon: Gift, accent: "pink" as const, title: "Хотелки", value: `${stats.wishes} вишей` },
    { href: "/calendar", icon: Calendar, accent: "teal" as const, title: "Планов", value: `${stats.events} событий` },
    { href: "/documents", icon: FileText, accent: "coral" as const, title: "Файлы", value: "Защищены" },
  ];

  if (stats.loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 size={32} className="animate-spin text-accent-pink" />
      </div>
    );
  }

  return (
    <div className="px-4 pt-6 pb-28 space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent-blue to-accent-pink flex items-center justify-center">
            <Heart size={16} className="text-white fill-white" />
          </div>
          <span className="text-sm font-medium tracking-widest text-muted uppercase">Биба</span>
        </div>
        <span className="text-xs text-muted">{user?.first_name} & {partnerName}</span>
      </div>

      <div className="space-y-2">
        <div className="flex items-baseline gap-3">
          <h1 className="text-6xl font-bold tracking-tight">{days}</h1>
          <span className="text-xl text-muted">дней вместе</span>
        </div>
        {upcomingEvent && (
          <p className="text-accent-pink font-medium">
            {upcomingEvent.title} через {getDaysUntil(upcomingEvent.date)} дней
          </p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        {sections.map((s) => (
          <button key={s.href} onClick={() => { tgHaptic("light"); router.push(s.href); }} className="text-left">
            <Card accent={s.accent}>
              <div className="flex items-center gap-2 mb-2">
                <s.icon size={18} className={`text-accent-${s.accent}`} />
                <span className="text-sm text-muted">{s.title}</span>
              </div>
              <p className="text-2xl font-bold">{s.value.split(" ")[0]} <span className="text-sm font-normal text-muted">{s.value.split(" ").slice(1).join(" ")}</span></p>
            </Card>
          </button>
        ))}
      </div>

      {upcomingEvent && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-muted uppercase tracking-wider">Скоро</h3>
          <Card>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-surface-light flex flex-col items-center justify-center">
                <span className="text-lg font-bold leading-none">{new Date(upcomingEvent.date).getDate()}</span>
                <span className="text-[10px] text-muted uppercase">{new Date(upcomingEvent.date).toLocaleDateString("ru-RU", { month: "short" })}</span>
              </div>
              <div>
                <p className="font-semibold">{upcomingEvent.title}</p>
                <p className="text-sm text-muted">Через {getDaysUntil(upcomingEvent.date)} дней</p>
              </div>
            </div>
          </Card>
        </div>
      )}

      {upcomingCapsule && (
        <button onClick={() => { tgHaptic("light"); router.push("/capsules"); }} className="text-left w-full">
          <Card accent="pink" className="bg-gradient-to-r from-accent-pink/20 to-transparent">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-accent-pink/30 flex items-center justify-center">
                <Clock size={20} className="text-accent-pink" />
              </div>
              <div>
                <p className="font-semibold">{upcomingCapsule.title}</p>
                <p className="text-sm text-muted">{new Date(upcomingCapsule.open_date).toLocaleDateString("ru-RU")} · через {getDaysUntil(upcomingCapsule.open_date)} дней</p>
              </div>
            </div>
          </Card>
        </button>
      )}
    </div>
  );
}
