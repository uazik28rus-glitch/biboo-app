"use client";

import { useEffect, useState, useCallback } from "react";
import { Circle, User, Plus, Loader2 } from "lucide-react";
import { useAuth } from "@/lib/use-auth";
import { useRealtime } from "@/lib/use-realtime";
import { tasksApi } from "@/lib/api";
import { Card } from "./ui/card";
import { cn } from "@/lib/utils";

type Filter = "all" | "me" | "partner" | "free";

export function TasksScreen() {
  const { user, couple } = useAuth();
  const [tasks, setTasks] = useState<any[]>([]);
  const [filter, setFilter] = useState<Filter>("all");
  const [isLoading, setIsLoading] = useState(true);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [showAdd, setShowAdd] = useState(false);

  const loadTasks = useCallback(async () => {
    if (!couple) return;
    setIsLoading(true);
    try {
      const { data } = await tasksApi.list(couple.id);
      setTasks(data || []);
    } catch {
      setTasks([]);
    } finally {
      setIsLoading(false);
    }
  }, [couple]);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  useRealtime(couple?.id || null, loadTasks);

  const handleAdd = async () => {
    if (!newTaskTitle.trim() || !couple || !user) return;
    try {
      await tasksApi.create({
        couple_id: couple.id,
        title: newTaskTitle.trim(),
        status: "free",
        created_by: user.id,
      });
      setNewTaskTitle("");
      setShowAdd(false);
      loadTasks();
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggle = async (task: any) => {
    const newStatus = task.status === "done" ? "free" : task.status === "free" ? "in_progress" : "done";
    try {
      await tasksApi.update(task.id, { status: newStatus, assigned_to: newStatus === "in_progress" ? user?.id : null });
      loadTasks();
    } catch (err) {
      console.error(err);
    }
  };

  const handleTake = async (task: any) => {
    if (!user) return;
    try {
      await tasksApi.update(task.id, { status: "in_progress", assigned_to: user.id });
      loadTasks();
    } catch (err) {
      console.error(err);
    }
  };

  const filtered = tasks.filter((t) => {
    if (filter === "free") return t.status === "free";
    if (filter === "me") return t.assigned_to === user?.id && t.status === "in_progress";
    if (filter === "partner") return t.assigned_to && t.assigned_to !== user?.id && t.status === "in_progress";
    return true;
  });

  const inProgress = filtered.filter((t) => t.status === "in_progress");
  const free = filtered.filter((t) => t.status === "free");
  const done = filtered.filter((t) => t.status === "done");

  const filters = [
    { key: "all" as const, label: `Все · ${tasks.length}` },
    { key: "me" as const, label: "Мои" },
    { key: "partner" as const, label: "Партнёра" },
    { key: "free" as const, label: `Свободные · ${tasks.filter((t) => t.status === "free").length}` },
  ];

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
        <h1 className="text-3xl font-bold">Задачи</h1>
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="p-2 rounded-xl bg-surface border border-border hover:border-accent-blue transition-colors"
        >
          <Plus size={20} />
        </button>
      </div>

      {showAdd && (
        <div className="flex gap-2">
          <input
            type="text"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            placeholder="Новая задача..."
            className="flex-1 px-4 py-3 bg-surface-light border border-border rounded-xl focus:outline-none focus:border-accent-blue"
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          />
          <button
            onClick={handleAdd}
            className="px-4 py-3 bg-accent-blue text-white font-medium rounded-xl hover:bg-accent-blue/90 transition-colors"
          >
            Добавить
          </button>
        </div>
      )}

      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {filters.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors",
              filter === f.key ? "bg-white text-black" : "bg-surface text-muted border border-border"
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      {inProgress.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-xs font-medium text-muted uppercase tracking-wider">В работе</h3>
          {inProgress.map((task) => (
            <Card key={task.id} accent={task.assigned_to === user?.id ? "blue" : "pink"} className="flex items-center gap-3">
              <button onClick={() => handleToggle(task)} className="shrink-0">
                <Circle size={22} className={task.assigned_to === user?.id ? "text-accent-blue" : "text-accent-pink"} />
              </button>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{task.title}</p>
                <div className="flex items-center gap-2 text-xs text-muted">
                  <User size={12} />
                  <span>{task.assigned_to === user?.id ? "Ты взял" : "Партнёр взял"}</span>
                  {task.due_date && <span>· до {task.due_date}</span>}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {free.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-xs font-medium text-muted uppercase tracking-wider">Свободные</h3>
          {free.map((task) => (
            <Card key={task.id} className="flex items-center gap-3">
              <button onClick={() => handleToggle(task)} className="shrink-0">
                <Circle size={22} className="text-muted" />
              </button>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{task.title}</p>
                {task.due_date && <p className="text-xs text-muted">до {task.due_date}</p>}
              </div>
              <button
                onClick={() => handleTake(task)}
                className="px-3 py-1.5 bg-accent-blue text-white text-xs font-medium rounded-lg shrink-0"
              >
                Взять
              </button>
            </Card>
          ))}
        </div>
      )}

      {done.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-xs font-medium text-muted uppercase tracking-wider">Выполнено</h3>
          {done.map((task) => (
            <Card key={task.id} className="flex items-center gap-3 opacity-50">
              <button onClick={() => handleToggle(task)} className="shrink-0">
                <Circle size={22} className="text-accent-green" />
              </button>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate line-through">{task.title}</p>
              </div>
            </Card>
          ))}
        </div>
      )}

      {filtered.length === 0 && (
        <div className="text-center py-12 text-muted">
          <p>Нет задач в этой категории</p>
        </div>
      )}
    </div>
  );
}
