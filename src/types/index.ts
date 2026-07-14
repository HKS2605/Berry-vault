export interface Expense {
  id: string;
  amount: number;
  category: string;
  tags: string[];
  paymentMethod?: string;
  note: string;
  mood: number;
  date: string;
  emoji?: string;
}

export interface User {
  id: string;
  name: string;
  level: number;
  xp: number;
  streak: number;
  totalSaved: number;
  monthlyBudget: number;
  theme: "light" | "dark";
}

export interface AppContextType {
  expenses: Expense[];
  user: User;
  addExpense: (expense: Omit<Expense, 'id' | 'date'> & { date?: string }) => void;
  deleteExpense: (id: string) => void;
  updateUser: (user: Partial<User>) => void;
  getTotalSpent: () => number;
  getExpensesByCategory: (category: string) => Expense[];
  getExpensesByTag: (tag: string) => Expense[];
  getMonthlySavings: () => number;
  getCurrentMonthSpent: () => number;
}
