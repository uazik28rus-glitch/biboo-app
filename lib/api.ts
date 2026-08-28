const API_BASE = "/api";

async function fetchApi(path: string, options?: RequestInit) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Request failed");
  }
  return res.json();
}

// Auth
export const authTelegram = (initData: string) =>
  fetchApi("/auth/telegram", { method: "POST", body: JSON.stringify({ initData }) });

// Couple
export const createCouple = (userId: string, startDate?: string) =>
  fetchApi("/couple/create", { method: "POST", body: JSON.stringify({ userId, startDate }) });

export const joinCouple = (userId: string, inviteCode: string) =>
  fetchApi("/couple/join", { method: "POST", body: JSON.stringify({ userId, inviteCode }) });

export const getCouple = (userId: string) =>
  fetchApi(`/couple?userId=${userId}`);

// Generic CRUD
function makeCrud(table: string) {
  return {
    list: (coupleId: string) => fetchApi(`/${table}?coupleId=${coupleId}`),
    create: (data: any) => fetchApi(`/${table}`, { method: "POST", body: JSON.stringify(data) }),
    update: (id: string, data: any) => fetchApi(`/${table}`, { method: "PATCH", body: JSON.stringify({ id, ...data }) }),
    remove: (id: string) => fetchApi(`/${table}`, { method: "DELETE", body: JSON.stringify({ id }) }),
  };
}

export const tasksApi = makeCrud("tasks");
export const eventsApi = makeCrud("events");
export const budgetGoalsApi = makeCrud("budget_goals");
export const transactionsApi = makeCrud("transactions");
export const wishesApi = makeCrud("wishes");
export const capsulesApi = makeCrud("capsules");
export const documentsApi = makeCrud("documents");
