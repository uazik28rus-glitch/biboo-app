"use client";

import { useEffect, useState, useCallback } from "react";
import { Plus, Minus, PlusCircle, Loader2 } from "lucide-react";
import { useAuth } from "@/lib/use-auth";
import { useRealtime } from "@/lib/use-realtime";
import { budgetGoalsApi } from "@/lib/api";
import { formatCurrency } from "@/lib/utils";
import { Card } from "./ui/card";
import { ProgressBar } from "./ui/progress-bar";
import { cn } from "@/lib/utils";

export function BudgetScreen() {
  const { user, couple } = useAuth();
  const [goals, setGoals] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [activeGoal, setActiveGoal] = useState<any>(null);
  const [amount, setAmount] = useState("");
  const [newGoal, setNewGoal] = useState({ title: "", target: "", currency: "RUB" });

  const loadData = useCallback(async () => {
    if (!couple) return;
    setIsLoading(true);
    try {
      const { data } = await budgetGoalsApi.list(couple.id);
      setGoals(data || []);
    } catch {
      setGoals([]);
    } finally {
      setIsLoading(false);
    }
  }, [couple]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useRealtime(couple?.id || null, loadData);

  const handleAddGoal = async () => {
    if (!newGoal.title.trim() || !newGoal.target || !couple || !user) return;
    try {
      await budgetGoalsApi.create({
        couple_id: couple.id,
        title: newGoal.title.trim(),
        target_amount: parseFloat(newGoal.target),
        current_amount: 0,
        currency: newGoal.currency,
        created_by: user.id,
      });
      setNewGoal({ title: "", target: "", currency: "RUB" });
      setShowAddGoal(false);
      loadData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddMoney = async () => {
    if (!activeGoal || !amount) return;
    try {
      await budgetGoalsApi.update(activeGoal.id, {
        current_amount: activeGoal.current_amount + parseFloat(amount),
      });
      setActiveGoal(null);
      setAmount("");
      loadData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubtractMoney = async () => {
    if (!activeGoal || !amount) return;
    try {
      await budgetGoalsApi.update(activeGoal.id, {
        current_amount: Math.max(0, activeGoal.current_amount - parseFloat(amount)),
      });
      setActiveGoal(null);
      setAmount("");
      loadData();
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
        <h1 className="text-3xl font-bold">Бюджет</h1>
        <button
          onClick={() => setShowAddGoal(!showAddGoal)}
          className="p-2 rounded-xl bg-surface border border-border hover:border-accent-blue transition-colors"
        >
          <Plus size={20} />
        </button>
      </div>

      {showAddGoal && (
        <div className="space-y-2">
          <input
            type="text"
            value={newGoal.title}
            onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
            placeholder="Название цели..."
            className="w-full px-4 py-3 bg-surface-light border border-border rounded-xl focus:outline-none focus:border-accent-blue"
          />
          <div className="flex gap-2">
            <input
              type="number"
              value={newGoal.target}
              onChange={(e) => setNewGoal({ ...newGoal, target: e.target.value })}
              placeholder="Сумма"
              className="flex-1 px-4 py-3 bg-surface-light border border-border rounded-xl focus:outline-none focus:border-accent-blue"
            />
            <select
              value={newGoal.currency}
              onChange={(e) => setNewGoal({ ...newGoal, currency: e.target.value })}
              className="px-4 py-3 bg-surface-light border border-border rounded-xl focus:outline-none focus:border-accent-blue"
            >
              <option value="RUB">₽</option>
              <option value="USD">$</option>
              <option value="CNY">¥</option>
              <option value="EUR">€</option>
            </select>
            <button onClick={handleAddGoal} className="px-4 py-3 bg-accent-blue text-white font-medium rounded-xl hover:bg-accent-blue/90 transition-colors">
              Добавить
            </button>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {goals.map((goal) => {
          const overflow = goal.current_amount > goal.target_amount;
          return (
            <Card key={goal.id} className="space-y-3" onClick={() => setActiveGoal(goal)}>
              <div>
                <p className="text-xs text-muted uppercase tracking-wider mb-1">Цель</p>
                <p className="font-semibold text-lg">{goal.title}</p>
              </div>
              <ProgressBar current={goal.current_amount} target={goal.target_amount} color={overflow ? "coral" : "green"} showOverflow={overflow} />
              <div className="flex items-center justify-between text-sm">
                <span className={cn("font-semibold", overflow ? "text-accent-coral" : "text-white")}>
                  {formatCurrency(goal.current_amount, goal.currency)}
                </span>
                <span className="text-muted">из {formatCurrency(goal.target_amount, goal.currency)}</span>
              </div>
              <div className="flex gap-2 pt-1">
                <button
                  onClick={(e) => { e.stopPropagation(); setActiveGoal(goal); }}
                  className="flex-1 py-2 bg-accent-green/20 text-accent-green rounded-lg text-sm font-medium hover:bg-accent-green/30 transition-colors flex items-center justify-center gap-1"
                >
                  <Plus size={14} /> Положить
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); setActiveGoal(goal); }}
                  className="flex-1 py-2 bg-accent-coral/20 text-accent-coral rounded-lg text-sm font-medium hover:bg-accent-coral/30 transition-colors flex items-center justify-center gap-1"
                >
                  <Minus size={14} /> Снять
                </button>
              </div>
            </Card>
          );
        })}
        {goals.length === 0 && (
          <p className="text-muted text-center py-8">Нет целей. Добавьте первую!</p>
        )}
      </div>

      {activeGoal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4" onClick={() => setActiveGoal(null)}>
          <div className="bg-surface border border-border rounded-2xl p-6 w-full max-w-sm space-y-4" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-semibold">{activeGoal.title}</h3>
            <p className="text-sm text-muted">Текущий баланс: {formatCurrency(activeGoal.current_amount, activeGoal.currency)}</p>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Сумма"
              className="w-full px-4 py-3 bg-surface-light border border-border rounded-xl focus:outline-none focus:border-accent-blue"
            />
            <div className="flex gap-2">
              <button onClick={handleSubtractMoney} className="flex-1 py-3 bg-accent-coral text-white font-medium rounded-xl hover:bg-accent-coral/90 transition-colors">
                Снять
              </button>
              <button onClick={handleAddMoney} className="flex-1 py-3 bg-accent-green text-white font-medium rounded-xl hover:bg-accent-green/90 transition-colors">
                Положить
              </button>
            </div>
            <button onClick={() => setActiveGoal(null)} className="w-full py-3 border border-border text-muted rounded-xl hover:border-white transition-colors">
              Отмена
            </button>
          </div>
        </div>
      )}
    </div>
  );
}