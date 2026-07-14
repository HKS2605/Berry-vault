import { createContext, useContext, ReactNode, useEffect, useState } from "react";
import { AppContextType, Expense, User } from "../types";

const AppContext = createContext<AppContextType | undefined>(undefined);

const DEFAULT_USER: User = {
  id: "user_1",
  name: "Navigator",
  level: 8,
  xp: 850,
  streak: 17,
  totalSaved: 24850,
  monthlyBudget: 50000,
  theme: "light",
};

const STORAGE_KEY = "nami_navigator_data";

interface StoredData {
  expenses: Expense[];
  user: User;
}

function normalizeTags(tags: string[] | undefined) {
  return Array.from(new Set((tags || []).map((tag) => tag.trim()).filter(Boolean)));
}

function normalizeExpense(expense: Expense): Expense {
  const amount = Number(expense.amount);

  return {
    ...expense,
    amount: Number.isFinite(amount) ? Math.round(amount * 100) / 100 : 0,
    category: expense.category.trim(),
    tags: normalizeTags(expense.tags),
    paymentMethod: expense.paymentMethod?.trim() || undefined,
    note: expense.note?.trim() || "",
    emoji: expense.emoji || "",
  };
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [user, setUser] = useState<User>(DEFAULT_USER);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const data: StoredData = JSON.parse(stored);
        setExpenses((data.expenses || []).map(normalizeExpense));
        setUser(data.user);
      } catch (error) {
        console.error("Failed to load data from localStorage:", error);
      }
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage whenever data changes
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ expenses, user })
      );
    }
  }, [expenses, user, isLoaded]);

  const addExpense = (expenseData: Omit<Expense, "id" | "date"> & { date?: string }) => {
    const { date, ...details } = expenseData;
    const expense: Expense = normalizeExpense({
      ...details,
      id: `expense_${Date.now()}`,
      date: date || new Date().toISOString(),
    });
    setExpenses((current) => [expense, ...current]);

    // Add XP for logging expense
    setUser(prev => ({
      ...prev,
      xp: prev.xp + 10,
      streak: prev.streak + 1,
    }));
  };

  const deleteExpense = (id: string) => {
    setExpenses(expenses.filter(e => e.id !== id));
  };

  const updateUser = (updates: Partial<User>) => {
    setUser(prev => ({ ...prev, ...updates }));
  };

  const getTotalSpent = () => {
    return expenses.reduce((sum, e) => sum + e.amount, 0);
  };

  const getExpensesByCategory = (category: string) => {
    return expenses.filter(e => e.category === category);
  };

  const getExpensesByTag = (tag: string) => {
    return expenses.filter(e => e.tags.includes(tag));
  };

  const getCurrentMonthSpent = () => {
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    
    return expenses
      .filter(e => {
        const eDate = new Date(e.date);
        return eDate >= monthStart && eDate < monthEnd;
      })
      .reduce((sum, e) => sum + e.amount, 0);
  };

  const getMonthlySavings = () => {
    const currentMonthSpent = getCurrentMonthSpent();
    return Math.max(0, user.monthlyBudget - currentMonthSpent);
  };

  const value: AppContextType = {
    expenses,
    user,
    addExpense,
    deleteExpense,
    updateUser,
    getTotalSpent,
    getExpensesByCategory,
    getExpensesByTag,
    getMonthlySavings,
    getCurrentMonthSpent,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within AppProvider");
  }
  return context;
}
