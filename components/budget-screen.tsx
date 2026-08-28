"use client";

import { useEffect, useState, useCallback } from "react";
import { TrendingUp, TrendingDown, Plus, Loader2 } from "lucide-react";
import { useAuth } from "@/lib/use-auth";
import { useRealtime } from "@/lib/use-realtime";
import { budgetGoalsApi, transactionsApi } from "@/lib/api";
import { formatCurrency } from "@/lib/utils";
import { Card } from "./ui/card";
import { ProgressBar } from "./ui/progress-bar";
import { cn } from "@/lib/utils";

type Tab = "goals" | "transactions";

export function BudgetScreen() {
  const { user, couple } = useAuth();
  const [tab, setTab] = useState<Tab>("goals");
  const [goals, setGoals] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [showAddTx, setShowAddTx] = useState(false);
  const [newGoal, setNewGoal] = useState({ title: "", target: "", currency: "RUB" });
  const [newTx, setNewTx] = useState({ amount: "", type: "expense" as const, category: "", description: "" });

  const loadData = useCallback(async () => {
    if (!couple) return;
    setIsLoading(true);
    try {
      const [goalsRes, txRes] = await Promise.all([
        budgetGoalsApi.list(couple.id),
        transactionsApi.list(couple.id),
      ]);
      setGoals(goalsRes.data || []);
      setTransactions(txRes.data || []);
    } catch {
      setGoals([]);
      setTransactions([]);
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

  const handleAddTx = async () => {
    if (!newTx.amount || !newTx.category || !couple || !user) return;
    try {
      await transactionsApi.create({
        couple_id: couple.id,
        amount: parseFloat(newTx.amount),
        currency: "RUB",
        type: newTx.type,
        category: newTx.category,
        description: newTx.description,
        created_by: user.id,
      });
      // Обновляем текущую сумму цели если это расход
      if (newTx.type === "expense") {
        const goal = goals.find((g) => g.category === newTx.category);
        if (goal) {
          await budgetGoalsApi.update(goal.id, { current_amount: goal.current_amount + parseFloat(newTx.amount) });
        }
      }
      setNewTx({ amount: "", type: "expense", category: "", description: "" });
      setShowAddTx(false);
      loadData();
    } catch (err) {
      console.error(err);
    }
  };

  const totalIncome = transactions.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = transactions.filter((t) => t.type === "expense").reduce((sum, t) => sum + t.amount, 0);

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
          onClick={() => tab === "goals" ? setShowAddGoal(!showAddGoal) : setShowAddTx(!showAddTx)}
          className="p-2 rounded-xl bg-surface border border-border hover:border-accent-blue transition-colors"
        >
          <Plus size={20} />
        </button>
      </div>

      <div className="flex p-1 bg-surface rounded-xl">
        {[{ key: "goals" as const, label: "Цели" }, { key: "transactions" as const, label: "Траты" }].map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={cn("flex-1 py-2 text-sm font-medium rounded-lg transition-colors", tab === t.key ? "bg-white text-black" : "text-muted")}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "goals" && showAddGoal && (
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
              <option value="JPY">¥</option>
              <option value="EUR">€</option>
            </select>
            <button onClick={handleAddGoal} className="px-4 py-3 bg-accent-blue text-white font-medium rounded-xl hover:bg-accent-blue/90 transition-colors">
              Добавить
            </button>
          </div>
        </div>
      )}

      {tab === "transactions" && showAddTx && (
        <div className="space-y-2">
          <div className="flex gap-2">
            <input
              type="number"
              value={newTx.amount}
              onChange={(e) => setNewTx({ ...newTx, amount: e.target.value })}
              placeholder="Сумма"
              className="flex-1 px-4 py-3 bg-surface-light border border-border rounded-xl focus:outline-none focus:border-accent-blue"
            />
            <select
              value={newTx.type}
              onChange={(e) => setNewTx({ ...newTx, type: e.target.value as any })}
              className="px-4 py-3 bg-surface-light border border-border rounded-xl focus:outline-none focus:border-accent-blue"
            >
              <option value="expense">Расход</option>
              <option value="income">Доход</option>
            </select>
          </div>
          <input
            type="text"
            value={newTx.category}
            onChange={(e) => setNewTx({ ...newTx, category: e.target.value })}
            placeholder="Категория"
            className="w-full px-4 py-3 bg-surface-light border border-border rounded-xl focus:outline-none focus:border-accent-blue"
          />
          <input
            type="text"
            value={newTx.description}
            onChange={(e) => setNewTx({ ...newTx, description: e.target.value })}
            placeholder="Описание (опционально)"
            className="w-full px-4 py-3 bg-surface-light border border-border rounded-xl focus:outline-none focus:border-accent-blue"
          />
          <button onClick={handleAddTx} className="w-full py-3 bg-accent-blue text-white font-medium rounded-xl hover:bg-accent-blue/90 transition-colors">
            Добавить транзакцию
          </button>
        </div>
      )}

      {tab === "goals" ? (
        <div className="space-y-4">
          {goals.map((goal) => {
            const overflow = goal.current_amount > goal.target_amount;
            return (
              <Card key={goal.id} className="space-y-3">
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
              </Card>
            );
          })}
          {goals.length === 0 && (
            <p className="text-muted text-center py-8">Нет целей. Добавьте первую!</p>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Card accent="green">
              <TrendingUp size={18} className="text-accent-green mb-2" />
              <p className="text-xs text-muted">Доходы</p>
              <p className="text-xl font-bold">{formatCurrency(totalIncome)}</p>
            </Card>
            <Card accent="coral">
              <TrendingDown size={18} className="text-accent-coral mb-2" />
              <p className="text-xs text-muted">Расходы</p>
              <p className="text-xl font-bold">{formatCurrency(totalExpense)}</p>
            </Card>
          </div>

          <div className="space-y-3">
            <h3 className="text-xs font-medium text-muted uppercase tracking-wider">История</h3>
            {transactions.map((t) => (
              <Card key={t.id} className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{t.description || t.category}</p>
                  <p className="text-xs text-muted">{t.category} · {new Date(t.created_at).toLocaleDateString("ru-RU")}</p>
                </div>
                <span className={cn("font-semibold", t.type === "income" ? "text-accent-green" : "text-white")}>
                  {t.type === "income" ? "+" : "-"}{formatCurrency(t.amount, t.currency)}
                </span>
              </Card>
            ))}
            {transactions.length === 0 && (
              <p className="text-muted text-center py-4">Нет транзакций</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
