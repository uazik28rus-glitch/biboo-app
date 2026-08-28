"use client";

import { useEffect, useState, useCallback } from "react";
import { ChevronLeft, ChevronRight, Plus, Loader2 } from "lucide-react";
import { useAuth } from "@/lib/use-auth";
import { useRealtime } from "@/lib/use-realtime";
import { eventsApi } from "@/lib/api";
import { getDaysUntil } from "@/lib/utils";
import { Card } from "./ui/card";
import { cn } from "@/lib/utils";

const DAYS = ["ПН", "ВТ", "СР", "ЧТ", "ПТ", "СБ", "ВС"];

export function CalendarScreen() {
  const { user, couple } = useAuth();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [newEvent, setNewEvent] = useState({ title: "", date: "", type: "other" });

  const loadEvents = useCallback(async () => {
    if (!couple) return;
    setIsLoading(true);
    try {
      const { data } = await eventsApi.list(couple.id);
      setEvents(data || []);
    } catch {
      setEvents([]);
    } finally {
      setIsLoading(false);
    }
  }, [couple]);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  useRealtime(couple?.id || null, loadEvents);

  const handleAdd = async () => {
    if (!newEvent.title.trim() || !newEvent.date || !couple || !user) return;
    try {
      await eventsApi.create({
        couple_id: couple.id,
        title: newEvent.title.trim(),
        date: newEvent.date,
        type: newEvent.type,
        created_by: user.id,
      });
      setNewEvent({ title: "", date: "", type: "other" });
      setShowAdd(false);
      loadEvents();
    } catch (err) {
      console.error(err);
    }
  };

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startOffset = firstDay === 0 ? 6 : firstDay - 1;
  const monthName = currentDate.toLocaleDateString("ru-RU", { month: "long" }).toUpperCase();

  const eventDates = new Map<number, string[]>();
  events.forEach((e) => {
    const d = new Date(e.date);
    if (d.getMonth() === month && d.getFullYear() === year) {
      const day = d.getDate();
      if (!eventDates.has(day)) eventDates.set(day, []);
      eventDates.get(day)!.push(e.type);
    }
  });

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
        <h1 className="text-3xl font-bold">Календарь</h1>
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="p-2 rounded-xl bg-surface border border-border hover:border-accent-blue transition-colors"
        >
          <Plus size={20} />
        </button>
      </div>

      {showAdd && (
        <div className="space-y-2">
          <input
            type="text"
            value={newEvent.title}
            onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
            placeholder="Название события..."
            className="w-full px-4 py-3 bg-surface-light border border-border rounded-xl focus:outline-none focus:border-accent-blue"
          />
          <div className="flex gap-2">
            <input
              type="date"
              value={newEvent.date}
              onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
              className="flex-1 px-4 py-3 bg-surface-light border border-border rounded-xl focus:outline-none focus:border-accent-blue"
            />
            <select
              value={newEvent.type}
              onChange={(e) => setNewEvent({ ...newEvent, type: e.target.value })}
              className="px-4 py-3 bg-surface-light border border-border rounded-xl focus:outline-none focus:border-accent-blue"
            >
              <option value="other">Другое</option>
              <option value="birthday">День рождения</option>
              <option value="trip">Поездка</option>
              <option value="anniversary">Годовщина</option>
            </select>
            <button
              onClick={handleAdd}
              className="px-4 py-3 bg-accent-blue text-white font-medium rounded-xl hover:bg-accent-blue/90 transition-colors"
            >
              Добавить
            </button>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <button onClick={() => setCurrentDate(new Date(year, month - 1, 1))} className="p-2 rounded-xl bg-surface text-muted">
          <ChevronLeft size={20} />
        </button>
        <h2 className="text-xl font-semibold capitalize">{monthName} {year}</h2>
        <button onClick={() => setCurrentDate(new Date(year, month + 1, 1))} className="p-2 rounded-xl bg-surface text-muted">
          <ChevronRight size={20} />
        </button>
      </div>

      <div className="space-y-2">
        <div className="grid grid-cols-7 gap-1">
          {DAYS.map((d) => (
            <div key={d} className="text-center text-xs text-muted py-2">{d}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: startOffset }).map((_, i) => (
            <div key={`empty-${i}`} />
          ))}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
            const isToday = day === new Date().getDate() && month === new Date().getMonth() && year === new Date().getFullYear();
            const isSelected = selectedDate === dateStr;
            const dayEvents = eventDates.get(day) || [];
            return (
              <button
                key={day}
                onClick={() => setSelectedDate(isSelected ? null : dateStr)}
                className={cn(
                  "aspect-square rounded-xl flex flex-col items-center justify-center gap-0.5 text-sm font-medium transition-colors",
                  isSelected ? "bg-accent-blue text-white" :
                  isToday ? "bg-white text-black" : "hover:bg-surface text-white"
                )}
              >
                {day}
                {dayEvents.length > 0 && (
                  <div className="flex gap-0.5">
                    {dayEvents.slice(0, 3).map((type, idx) => (
                      <div key={idx} className={cn("w-1 h-1 rounded-full",
                        type === "birthday" ? "bg-accent-pink" :
                        type === "trip" ? "bg-accent-teal" :
                        type === "anniversary" ? "bg-accent-coral" : "bg-accent-blue"
                      )} />
                    ))}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="text-xs font-medium text-muted uppercase tracking-wider">
          {selectedDate ? `События ${new Date(selectedDate).toLocaleDateString("ru-RU")}` : "Выберите дату"}
        </h3>
        {(selectedDate ? events.filter((e) => e.date === selectedDate) : []).map((event) => (
          <Card key={event.id} className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-surface-light flex flex-col items-center justify-center shrink-0">
              <span className="text-lg font-bold leading-none">{new Date(event.date).getDate()}</span>
              <span className="text-[10px] text-muted uppercase">{new Date(event.date).toLocaleDateString("ru-RU", { month: "short" })}</span>
            </div>
            <div className="flex-1">
              <p className="font-semibold">{event.title}</p>
              <p className="text-sm text-muted">Через {getDaysUntil(event.date)} дней</p>
            </div>
            <div className={cn("w-2 h-2 rounded-full",
              event.type === "birthday" ? "bg-accent-pink" :
              event.type === "trip" ? "bg-accent-teal" :
              event.type === "anniversary" ? "bg-accent-coral" : "bg-accent-blue"
            )} />
          </Card>
        ))}
        {selectedDate && events.filter((e) => e.date === selectedDate).length === 0 && (
          <p className="text-muted text-center py-4">Нет событий в этот день</p>
        )}
        {!selectedDate && (
          <p className="text-muted text-center py-4">Нажмите на дату в календаре, чтобы увидеть события</p>
        )}
      </div>
    </div>
  );
}