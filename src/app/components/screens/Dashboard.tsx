import { useMemo } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";
import {
  BarChart3,
  CircleDollarSign,
  Compass,
  Lightbulb,
  Plus,
  Sparkles,
  TrendingUp,
  WalletCards,
} from "lucide-react";
import { useNavigate } from "react-router";
import { Card, CardContent } from "../ui/card";
import { Progress } from "../ui/progress";
import { useAppContext } from "../../context/AppContext";
import type { Expense } from "../../../types";
import heroIllustration from "../../../assets/hero section.png";
import foodIcon from "../../../assets/food.png";
import travelIcon from "../../../assets/travel.png";
import shoppingIcon from "../../../assets/shopping.png";
import subscriptionsIcon from "../../../assets/subscriptions.png";
import entertainmentIcon from "../../../assets/entertainment.png";
import educationIcon from "../../../assets/education.png";
import otherIcon from "../../../assets/orange.svg";

const CATEGORY_COLORS: Record<string, string> = {
  food: "#FF8C42",
  travel: "#6EC6FF",
  shopping: "#4FD1A5",
  subscriptions: "#A78BFA",
  entertainment: "#F6C453",
  education: "#2B6CB0",
  other: "#9CA3AF",
};

const CATEGORY_ICONS: Record<string, string> = {
  food: foodIcon,
  travel: travelIcon,
  shopping: shoppingIcon,
  subscriptions: subscriptionsIcon,
  entertainment: entertainmentIcon,
  education: educationIcon,
  other: otherIcon,
};

function Sparkline({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 112 42" aria-hidden="true" className="h-10 w-24 overflow-visible">
      <path d="M2 35 C15 23 18 34 29 26 S44 32 53 17 S67 28 78 13 S91 20 110 3" fill="none" stroke={color} strokeLinecap="round" strokeWidth="2.25" />
      <path d="M2 35 C15 23 18 34 29 26 S44 32 53 17 S67 28 78 13 S91 20 110 3 L110 42 L2 42 Z" fill={color} opacity="0.05" />
    </svg>
  );
}

function relativeDate(date: string) {
  const value = new Date(date);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);
  const dateLabel = value.toLocaleDateString([], { day: "numeric", month: "short" });
  if (value.toDateString() === today.toDateString()) return `Today · ${dateLabel}`;
  if (value.toDateString() === yesterday.toDateString()) return `Yesterday · ${dateLabel}`;
  return dateLabel;
}

export function Dashboard() {
  const navigate = useNavigate();
  const { expenses, user, getMonthlySavings, getCurrentMonthSpent } = useAppContext();
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  const monthSpent = getCurrentMonthSpent();
  const monthlySavings = getMonthlySavings();
  const budgetPercentage = user.monthlyBudget ? Math.min((monthSpent / user.monthlyBudget) * 100, 100) : 0;

  const todaySpent = useMemo(() => {
    const today = new Date().toDateString();
    return expenses.filter((expense) => new Date(expense.date).toDateString() === today).reduce((sum, expense) => sum + expense.amount, 0);
  }, [expenses]);

  const weekSpent = useMemo(() => {
    const start = new Date();
    start.setDate(start.getDate() - 7);
    return expenses.filter((expense) => new Date(expense.date) >= start).reduce((sum, expense) => sum + expense.amount, 0);
  }, [expenses]);

  const categoryData = useMemo(() => {
    const totals: Record<string, number> = {};
    expenses.forEach((expense) => { totals[expense.category] = (totals[expense.category] || 0) + expense.amount; });
    return Object.entries(totals)
      .map(([name, value]) => ({ name, label: name.charAt(0).toUpperCase() + name.slice(1), value, color: CATEGORY_COLORS[name] || CATEGORY_COLORS.other }))
      .sort((a, b) => b.value - a.value);
  }, [expenses]);

  const currentMonthExpenses = useMemo(() => {
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    return expenses
      .filter((expense) => {
        const expenseDate = new Date(expense.date);
        return expenseDate >= monthStart && expenseDate < monthEnd;
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [expenses]);

  const recentExpenses = currentMonthExpenses;
  const xpProgress = (user.xp % 1000) / 10;
  const stats = [
    { label: "Today", value: todaySpent, icon: CircleDollarSign, iconClass: "bg-primary/10 text-primary", line: "#FF8C42" },
    { label: "This week", value: weekSpent, icon: TrendingUp, iconClass: "bg-[#FFF7E8] text-[#E99B0B]", line: "#FF8C42" },
    { label: "This month", value: monthSpent, icon: BarChart3, iconClass: "bg-secondary/20 text-[#2B6CB0]", line: "#2B8DE6" },
    { label: "Total savings", value: user.totalSaved, icon: WalletCards, iconClass: "bg-success/15 text-[#139A71]", line: "#20B98D" },
  ];

  return (
    <div className="page-shell space-y-6 lg:space-y-7">
      <section className="relative min-h-[320px] overflow-hidden rounded-[28px] border border-[#F4D8BC] bg-gradient-to-br from-[#FFF8E9] via-[#FFD9AE] to-[#BDE7FF] shadow-[0_20px_60px_rgba(255,140,66,0.15)]">
        <img src={heroIllustration} alt="A tropical treasure voyage" className="absolute inset-y-0 right-0 h-full w-[62%] object-cover object-[56%_50%] opacity-95" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#FFF9ED] via-[#FFF3DF]/85 to-transparent" />
        <div className="relative z-10 max-w-xl p-6 sm:p-8 lg:p-9">
          <div className="mb-4 flex items-center gap-2 text-primary">
            <Sparkles className="size-5" />
            <span className="text-xs font-bold uppercase tracking-[0.16em]">Your voyage, at a glance</span>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">{greeting}, {user.name}</h1>
          <p className="mt-6 text-sm font-semibold text-primary">This month&apos;s savings</p>
          <p className="mt-1 text-4xl font-extrabold tracking-tight text-primary sm:text-5xl">₹{monthlySavings.toLocaleString()}</p>
          <p className="mt-2 text-sm font-medium text-muted-foreground">Budget: ₹{user.monthlyBudget.toLocaleString()} <span className="px-1 text-[#D1A889]">|</span> Spent: ₹{monthSpent.toLocaleString()}</p>
          <div className="mt-6 flex max-w-sm items-center gap-3">
            <span className="shrink-0 text-sm font-bold text-foreground">Budget used</span>
            <Progress value={budgetPercentage} className="h-3 bg-white/70 [&>div]:bg-gradient-to-r [&>div]:from-[#FF9F5A] [&>div]:to-primary" />
            <span className="text-sm font-extrabold text-primary">{Math.round(budgetPercentage)}%</span>
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} className="surface-card overflow-hidden">
              <CardContent className="p-5 sm:p-6">
                <div className="flex items-center justify-between">
                  <div className={`flex size-11 items-center justify-center rounded-2xl ${stat.iconClass}`}><Icon className="size-5" /></div>
                  <Sparkline color={stat.line} />
                </div>
                <p className="mt-4 text-sm font-semibold text-muted-foreground">{stat.label}</p>
                <p className="mt-1 text-3xl font-extrabold tracking-tight text-foreground">₹{stat.value.toLocaleString()}</p>
              </CardContent>
            </Card>
          );
        })}
      </section>

      <section className="grid gap-6 xl:grid-cols-12 xl:items-start">
        <Card className="surface-card self-start xl:col-span-5">
          <CardContent className="p-6 sm:p-7">
            <div className="section-heading"><span className="section-icon"><BarChart3 className="size-5" /></span>Spending by category</div>
            {categoryData.length > 0 ? (
              <div className="mt-5 grid items-center gap-4 sm:grid-cols-[1.05fr_1fr]">
                <div className="h-56"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={categoryData} dataKey="value" nameKey="label" cx="50%" cy="50%" innerRadius={58} outerRadius={96} paddingAngle={3} stroke="none">{categoryData.map((entry) => <Cell key={entry.name} fill={entry.color} />)}</Pie></PieChart></ResponsiveContainer></div>
                <div className="space-y-3">
                  {categoryData.slice(0, 5).map((category) => (
                    <div key={category.name} className="flex items-center gap-2.5 text-sm"><span className="size-2.5 rounded-full" style={{ backgroundColor: category.color }} /><span className="flex-1 truncate font-semibold">{category.label}</span><span className="font-bold">{Math.round((category.value / Math.max(monthSpent, 1)) * 100)}%</span></div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="mt-5 flex min-h-56 flex-col items-center justify-center rounded-3xl bg-muted/45 px-6 text-center"><Compass className="mb-3 size-9 text-primary" /><p className="font-bold">Your map is waiting</p><p className="mt-1 text-sm text-muted-foreground">Log an expense to reveal your spending route.</p></div>
            )}
          </CardContent>
        </Card>

        <Card className="surface-card self-start xl:col-span-7">
          <CardContent className="p-6 sm:p-7">
            <div className="flex items-center justify-between gap-4"><div><div className="section-heading"><span className="section-icon"><WalletCards className="size-5" /></span>Recent expenses</div><p className="mt-2 text-sm text-muted-foreground">Scroll to review all entries from this month.</p></div><button onClick={() => navigate("/add")} className="inline-flex items-center gap-1 text-sm font-bold text-primary hover:text-[#EA580C]"><Plus className="size-4" />Add expense</button></div>
            <div className="mt-5 max-h-[360px] space-y-3 overflow-y-auto pr-1">
              {recentExpenses.length > 0 ? recentExpenses.map((expense: Expense) => (
                <div key={expense.id} className="flex items-center gap-3 rounded-2xl bg-[#FFFDFB] p-3 transition-colors hover:bg-muted/65 sm:gap-4 sm:p-4">
                  <img src={CATEGORY_ICONS[expense.category] || otherIcon} alt="" className="size-11 rounded-xl bg-[#FFF6EE] p-2 object-contain sm:size-12" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-bold capitalize">{expense.note || expense.category}</p>
                    <div className="mt-1 flex flex-wrap gap-2">
                      <span className="inline-block rounded-full bg-[#E7F3FF] px-2.5 py-1 text-[11px] font-bold text-[#2B6CB0]">{relativeDate(expense.date)}</span>
                      {expense.tags.slice(0, 3).map((tag) => <span key={tag} className="inline-block rounded-full bg-muted px-2.5 py-1 text-[11px] font-bold text-muted-foreground">{tag}</span>)}
                    </div>
                  </div>
                  <p className="shrink-0 text-lg font-extrabold">₹{expense.amount.toLocaleString()}</p>
                </div>
              )) : (
                <div className="rounded-3xl bg-muted/45 p-7 text-center"><p className="font-bold">No supplies logged yet</p><p className="mt-1 text-sm text-muted-foreground">Your recent voyage expenses will appear here.</p></div>
              )}
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <Card className="surface-card lg:col-span-2"><CardContent className="flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-7"><div><p className="eyebrow">Treasure vault</p><h2 className="mt-1 text-xl">Level {user.level} Navigator</h2><p className="mt-1 text-sm text-muted-foreground">{user.xp % 1000} XP until your next discovery.</p></div><div className="w-full max-w-sm"><div className="mb-2 flex justify-between text-sm font-bold"><span>Voyage progress</span><span className="text-primary">{Math.round(xpProgress)}%</span></div><Progress value={xpProgress} className="h-3 bg-muted [&>div]:bg-gradient-to-r [&>div]:from-primary [&>div]:to-[#F6C453]" /></div></CardContent></Card>
        <Card className="surface-card"><CardContent className="p-6"><div className="flex items-center gap-3"><span className="section-icon"><Lightbulb className="size-5" /></span><p className="font-bold">Daily compass</p></div><p className="mt-4 text-sm leading-6 text-muted-foreground">Small, mindful purchases are how a well-stocked treasure vault grows.</p></CardContent></Card>
      </section>
    </div>
  );
}
