import { useMemo } from "react";
import {
  Area,
  AreaChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { BarChart3, BrainCircuit, CalendarDays, Lightbulb, Sparkles, Store, TrendingDown, TrendingUp, WalletCards } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { useAppContext } from "../../context/AppContext";

const categoryPalette = ["#FF8C42", "#6EC6FF", "#4FD1A5", "#F6C453", "#A78BFA", "#2B6CB0"];

export function Insights() {
  const { expenses, user, getCurrentMonthSpent, getMonthlySavings } = useAppContext();
  const currentMonthSpent = getCurrentMonthSpent();
  const monthlySavings = getMonthlySavings();

  const monthlyData = useMemo(() => {
    const now = new Date();
    return Array.from({ length: 6 }, (_, index) => {
      const date = new Date(now.getFullYear(), now.getMonth() - (5 - index), 1);
      const total = expenses
        .filter((expense) => {
          const expenseDate = new Date(expense.date);
          return expenseDate.getMonth() === date.getMonth() && expenseDate.getFullYear() === date.getFullYear();
        })
        .reduce((sum, expense) => sum + expense.amount, 0);
      return { month: date.toLocaleDateString([], { month: "short" }), spent: total, saved: Math.max(user.monthlyBudget - total, 0) };
    });
  }, [expenses, user.monthlyBudget]);

  const categoryData = useMemo(() => {
    const values: Record<string, number> = {};
    expenses.forEach((expense) => { values[expense.category] = (values[expense.category] || 0) + expense.amount; });
    return Object.entries(values).map(([name, value], index) => ({ name: name.charAt(0).toUpperCase() + name.slice(1), value, color: categoryPalette[index % categoryPalette.length] })).sort((a, b) => b.value - a.value);
  }, [expenses]);

  const topMerchants = useMemo(() => {
    const values: Record<string, number> = {};
    expenses.forEach((expense) => { const name = expense.note?.trim() || expense.category; values[name] = (values[name] || 0) + expense.amount; });
    return Object.entries(values).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value).slice(0, 3);
  }, [expenses]);

  const weeklyActivity = useMemo(() => {
    const today = new Date();
    return Array.from({ length: 7 }, (_, index) => {
      const date = new Date(today);
      date.setDate(today.getDate() - (6 - index));
      const count = expenses.filter((expense) => new Date(expense.date).toDateString() === date.toDateString()).length;
      return { label: date.toLocaleDateString([], { weekday: "short" }), count };
    });
  }, [expenses]);

  const thisWeek = useMemo(() => {
    const start = new Date();
    start.setDate(start.getDate() - 7);
    const previousStart = new Date();
    previousStart.setDate(previousStart.getDate() - 14);
    const current = expenses.filter((expense) => new Date(expense.date) >= start).reduce((sum, expense) => sum + expense.amount, 0);
    const previous = expenses.filter((expense) => { const date = new Date(expense.date); return date >= previousStart && date < start; }).reduce((sum, expense) => sum + expense.amount, 0);
    return { current, change: previous ? Math.round(((current - previous) / previous) * 100) : 0 };
  }, [expenses]);

  const predictedSpend = Math.min(Math.round(currentMonthSpent * (30 / Math.max(new Date().getDate(), 1))), user.monthlyBudget * 2);
  const totalCategorySpend = categoryData.reduce((sum, category) => sum + category.value, 0);

  return (
    <div className="page-shell space-y-6">
      <div><p className="eyebrow">Navigator intelligence</p><h1 className="mt-2 text-3xl sm:text-4xl">Insights</h1><p className="mt-2 text-sm text-muted-foreground">A clear view of the currents shaping your treasure.</p></div>

      <Card className="overflow-hidden border-primary/25 bg-gradient-to-r from-[#FFF1E6] via-[#FFF8EF] to-[#E9F6FF] shadow-[0_12px_35px_rgba(255,140,66,.10)]"><CardContent className="flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-7"><div className="flex gap-4"><span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-primary text-white shadow-[0_8px_20px_rgba(255,140,66,.22)]"><BrainCircuit className="size-6" /></span><div><p className="text-lg font-extrabold">Your voyage note</p><p className="mt-1 max-w-2xl text-sm leading-6 text-muted-foreground">{thisWeek.change > 0 ? `Spending is ${thisWeek.change}% higher than last week. Review your most frequent categories before the next port.` : "You are holding a steady course. Small, intentional choices are protecting your savings."}</p></div></div><span className="inline-flex shrink-0 items-center gap-2 self-start rounded-full bg-white/80 px-4 py-2 text-xs font-bold text-primary"><Sparkles className="size-4" />Fresh analysis</span></CardContent></Card>

      <section className="grid gap-4 md:grid-cols-3">
        <Card className="surface-card"><CardContent className="p-6"><span className="section-icon"><WalletCards className="size-5" /></span><p className="mt-4 text-sm font-bold text-muted-foreground">This month</p><p className="mt-1 text-3xl font-extrabold">₹{currentMonthSpent.toLocaleString()}</p><p className="mt-2 text-xs font-bold text-primary">{expenses.length} logged transactions</p></CardContent></Card>
        <Card className="surface-card"><CardContent className="p-6"><span className="section-icon bg-success/15 text-[#168B6A]"><TrendingDown className="size-5" /></span><p className="mt-4 text-sm font-bold text-muted-foreground">Projected savings</p><p className="mt-1 text-3xl font-extrabold">₹{monthlySavings.toLocaleString()}</p><p className="mt-2 text-xs font-bold text-[#168B6A]">Within your voyage budget</p></CardContent></Card>
        <Card className="surface-card"><CardContent className="p-6"><span className="section-icon bg-secondary/20 text-[#2B6CB0]"><CalendarDays className="size-5" /></span><p className="mt-4 text-sm font-bold text-muted-foreground">7-day spend</p><p className="mt-1 text-3xl font-extrabold">₹{thisWeek.current.toLocaleString()}</p><p className={`mt-2 text-xs font-bold ${thisWeek.change > 0 ? "text-primary" : "text-[#168B6A]"}`}>{thisWeek.change > 0 ? "+" : ""}{thisWeek.change}% versus last week</p></CardContent></Card>
      </section>

      <section className="grid gap-6 xl:grid-cols-12">
        <Card className="surface-card xl:col-span-8"><CardContent className="p-6 sm:p-7"><div className="flex items-center justify-between"><div className="section-heading"><span className="section-icon"><TrendingUp className="size-5" /></span>Monthly overview</div><span className="rounded-full bg-muted px-3 py-1.5 text-xs font-bold text-primary">Last 6 months</span></div><div className="mt-5 h-72"><ResponsiveContainer width="100%" height="100%"><AreaChart data={monthlyData} margin={{ top: 8, right: 4, left: -20, bottom: 0 }}><defs><linearGradient id="spendFill" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#FF8C42" stopOpacity={0.32}/><stop offset="100%" stopColor="#FF8C42" stopOpacity={0.02}/></linearGradient></defs><XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "#9CA3AF", fontSize: 12 }} /><YAxis axisLine={false} tickLine={false} tick={{ fill: "#9CA3AF", fontSize: 12 }} tickFormatter={(value) => `₹${value}`} /><Tooltip cursor={{ stroke: "#F2E8DC" }} contentStyle={{ borderRadius: 16, border: "1px solid #F2E8DC", boxShadow: "0 8px 30px rgba(255,140,66,.10)" }} formatter={(value: number) => [`₹${value.toLocaleString()}`, "Spent"]}/><Area type="monotone" dataKey="spent" stroke="#FF8C42" strokeWidth={3} fill="url(#spendFill)" /></AreaChart></ResponsiveContainer></div></CardContent></Card>
        <Card className="surface-card xl:col-span-4"><CardContent className="p-6 sm:p-7"><div className="section-heading"><span className="section-icon"><Lightbulb className="size-5" /></span>Budget forecast</div><div className="mt-6 rounded-3xl bg-[#FFF9F3] p-5"><p className="text-sm font-bold text-muted-foreground">Estimated month-end spend</p><p className="mt-1 text-3xl font-extrabold">₹{predictedSpend.toLocaleString()}</p><div className="mt-5 h-3 overflow-hidden rounded-full bg-[#FFE5CC]"><div className="h-full rounded-full bg-gradient-to-r from-primary to-[#F6C453]" style={{ width: `${Math.min((predictedSpend / Math.max(user.monthlyBudget, 1)) * 100, 100)}%` }} /></div><p className="mt-2 text-xs font-bold text-muted-foreground">₹{user.monthlyBudget.toLocaleString()} planned budget</p></div><p className="mt-5 text-sm leading-6 text-muted-foreground">{predictedSpend > user.monthlyBudget ? "Current pace may carry you past your budget. A lighter week will keep your route balanced." : "You are on track to arrive under budget. Keep protecting your future treasure."}</p></CardContent></Card>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <Card className="surface-card"><CardContent className="p-6 sm:p-7"><div className="section-heading"><span className="section-icon"><BarChart3 className="size-5" /></span>Category breakdown</div>{categoryData.length ? <div className="mt-5 grid items-center gap-4 sm:grid-cols-[1fr_1fr]"><div className="h-56"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={categoryData} dataKey="value" nameKey="name" innerRadius={54} outerRadius={88} paddingAngle={3} stroke="none">{categoryData.map((category) => <Cell key={category.name} fill={category.color} />)}</Pie></PieChart></ResponsiveContainer></div><div className="space-y-3">{categoryData.slice(0, 5).map((category) => <div key={category.name} className="flex items-center gap-2 text-sm"><span className="size-2.5 rounded-full" style={{ backgroundColor: category.color }} /><span className="flex-1 font-bold">{category.name}</span><span className="text-muted-foreground">{Math.round((category.value / totalCategorySpend) * 100)}%</span></div>)}</div></div> : <p className="mt-5 rounded-2xl bg-muted/50 p-6 text-sm text-muted-foreground">Add a few expenses to reveal your spending mix.</p>}</CardContent></Card>
        <Card className="surface-card"><CardContent className="p-6 sm:p-7"><div className="section-heading"><span className="section-icon"><Store className="size-5" /></span>Top merchants</div><div className="mt-5 space-y-3">{topMerchants.length ? topMerchants.map((merchant, index) => <div key={merchant.name} className="flex items-center gap-3 rounded-2xl bg-[#FFFDFB] p-4"><span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-muted text-sm font-extrabold text-primary">0{index + 1}</span><span className="min-w-0 flex-1 truncate font-bold capitalize">{merchant.name}</span><span className="font-extrabold">₹{merchant.value.toLocaleString()}</span></div>) : <p className="rounded-2xl bg-muted/50 p-6 text-sm text-muted-foreground">Merchant patterns will appear here as you log expenses.</p>}</div><div className="mt-6 border-t border-border pt-5"><p className="mb-3 text-sm font-bold">Recent activity</p><div className="grid grid-cols-7 gap-2">{weeklyActivity.map((day) => <div key={day.label} className="text-center"><div className="flex h-12 items-end rounded-xl bg-muted/55 p-1"><span className="w-full rounded-lg bg-secondary" style={{ height: `${day.count ? Math.min(30 + day.count * 20, 100) : 8}%`, opacity: day.count ? 1 : .35 }} /></div><span className="mt-1.5 block text-[10px] font-bold text-muted-foreground">{day.label}</span></div>)}</div></div></CardContent></Card>
      </section>
    </div>
  );
}
