export type Task = {
  id: string;
  title: string;
  assignedTo?: "me" | "partner" | null;
  status: "free" | "in_progress" | "done";
  dueDate?: string;
};

export type CalendarEvent = {
  id: string;
  title: string;
  date: string;
  type: "birthday" | "trip" | "anniversary" | "other";
};

export type BudgetGoal = {
  id: string;
  title: string;
  target: number;
  current: number;
  currency: string;
};

export type Transaction = {
  id: string;
  amount: number;
  type: "income" | "expense";
  category: string;
  description: string;
  date: string;
};

export type Wish = {
  id: string;
  title: string;
  price?: number;
  currency: string;
  priority: "low" | "medium" | "high" | "dream";
  link?: string;
};

export type Capsule = {
  id: string;
  title: string;
  content: string;
  openDate: string;
  isOpened: boolean;
  createdBy: string;
};

export const coupleStartDate = "2021-10-12";

export const tasks: Task[] = [
  { id: "1", title: "Записаться к стоматологу", assignedTo: "me", status: "in_progress", dueDate: "2024-08-20" },
  { id: "2", title: "Забрать посылку из ПВЗ", assignedTo: "partner", status: "in_progress" },
  { id: "3", title: "Выбрать подарок маме Софьи", status: "free", dueDate: "2024-08-24" },
  { id: "4", title: "Поменять шины", status: "free" },
];

export const events: CalendarEvent[] = [
  { id: "1", title: "День рождения мамы Софьи", date: "2024-10-08", type: "birthday" },
  { id: "2", title: "Годовщина", date: "2024-10-12", type: "anniversary" },
  { id: "3", title: "Поездка в Японию", date: "2024-10-15", type: "trip" },
];

export const budgetGoals: BudgetGoal[] = [
  { id: "1", title: "Япония, октябрь", target: 5000, current: 2400, currency: "USD" },
  { id: "2", title: "Ремонт кухни", target: 180000, current: 214300, currency: "RUB" },
];

export const transactions: Transaction[] = [
  { id: "1", amount: 3500, type: "expense", category: "Продукты", description: "Пятёрочка", date: "2024-08-10" },
  { id: "2", amount: 1200, type: "expense", category: "Кафе", description: "Кофе и круассаны", date: "2024-08-09" },
  { id: "3", amount: 15000, type: "income", category: "Накопления", description: "На поездку", date: "2024-08-08" },
];

export const wishes: Wish[] = [
  { id: "1", title: "Ваза Fern Studio", price: 7400, currency: "RUB", priority: "dream" },
  { id: "2", title: "«Дни в Бургундии»", price: 2100, currency: "RUB", priority: "medium" },
  { id: "3", title: "Керамика, суббота", currency: "RUB", priority: "low" },
];

export const capsules: Capsule[] = [
  { id: "1", title: "Тебя ждёт письмо от Софьи", content: "Привет, любимый!", openDate: "2025-02-14", isOpened: false, createdBy: "partner" },
  { id: "2", title: "Софье — на годовщину", content: "С днём нашей встречи!", openDate: "2025-03-12", isOpened: false, createdBy: "me" },
  { id: "3", title: "«Первый год»", content: "Прошлый год был потрясающим...", openDate: "2023-01-01", isOpened: true, createdBy: "me" },
];
