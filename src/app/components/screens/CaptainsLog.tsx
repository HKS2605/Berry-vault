import { useMemo, useState } from "react";
import { Bot, BookOpenText, Compass, CornerDownLeft, Lightbulb, Send, Sparkles, TrendingUp, WalletCards } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useAppContext } from "../../context/AppContext";

const quickQuestions = [
  "Where did I spend the most?",
  "What is my weekly total?",
  "How can I protect my savings?",
];

type Message = { role: "user" | "assistant"; content: string };

export function CaptainsLog() {
  const { expenses, getCurrentMonthSpent, getMonthlySavings } = useAppContext();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");

  const voyageSummary = useMemo(() => {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const weekExpenses = expenses.filter((expense) => new Date(expense.date) >= weekAgo);
    const spent = weekExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    const categories: Record<string, number> = {};
    weekExpenses.forEach((expense) => { categories[expense.category] = (categories[expense.category] || 0) + expense.amount; });
    const leading = Object.entries(categories).sort((a, b) => b[1] - a[1])[0];
    return { spent, total: weekExpenses.length, topCategory: leading?.[0] || "No category", topValue: leading?.[1] || 0 };
  }, [expenses]);

  const answerFor = (question: string) => {
    const lower = question.toLowerCase();
    if (lower.includes("most") || lower.includes("where")) {
      return voyageSummary.topValue ? `${voyageSummary.topCategory.charAt(0).toUpperCase() + voyageSummary.topCategory.slice(1)} is leading this week at ₹${voyageSummary.topValue.toLocaleString()}. A small limit here can have the biggest impact.` : "Your log is still clear. Add a few expenses and I’ll help identify the strongest spending current.";
    }
    if (lower.includes("weekly") || lower.includes("week")) {
      return `You have logged ${voyageSummary.total} expense${voyageSummary.total === 1 ? "" : "s"} this week, totalling ₹${voyageSummary.spent.toLocaleString()}.`;
    }
    if (lower.includes("saving") || lower.includes("protect")) {
      const remaining = getMonthlySavings();
      return `You currently have ₹${remaining.toLocaleString()} of this month’s budget protected. Try pausing before non-essential purchases and choose one spending category to watch this week.`;
    }
    return `Your current month spend is ₹${getCurrentMonthSpent().toLocaleString()}. Try asking about your weekly total, top category, or how to protect your savings.`;
  };

  const sendQuestion = (question = input) => {
    const value = question.trim();
    if (!value) return;
    setMessages((current) => [...current, { role: "user", content: value }, { role: "assistant", content: answerFor(value) }]);
    setInput("");
  };

  const recentTimeline = expenses.slice(0, 4);

  return (
    <div className="page-shell space-y-6">
      <div><p className="eyebrow">Your voyage journal</p><h1 className="mt-2 text-3xl sm:text-4xl">Captain&apos;s Log</h1><p className="mt-2 text-sm text-muted-foreground">A calmer way to reflect on the choices behind your treasure.</p></div>

      <section className="grid gap-6 xl:grid-cols-12">
        <aside className="space-y-6 xl:col-span-4">
          <Card className="overflow-hidden border-primary/25 bg-gradient-to-br from-[#FFF1E6] via-[#FFF8EF] to-[#E9F6FF] shadow-[0_12px_35px_rgba(255,140,66,.10)]"><CardContent className="p-6"><div className="flex items-center gap-3"><span className="flex size-11 items-center justify-center rounded-2xl bg-primary text-white"><Compass className="size-5" /></span><div><p className="font-extrabold">Weekly summary</p><p className="text-xs font-bold text-primary">Course update</p></div></div><div className="mt-6 grid grid-cols-2 gap-3"><div className="rounded-2xl bg-white/70 p-4"><p className="text-xs font-bold text-muted-foreground">This week</p><p className="mt-1 text-2xl font-extrabold">₹{voyageSummary.spent.toLocaleString()}</p></div><div className="rounded-2xl bg-white/70 p-4"><p className="text-xs font-bold text-muted-foreground">Entries</p><p className="mt-1 text-2xl font-extrabold">{voyageSummary.total}</p></div></div><p className="mt-5 text-sm leading-6 text-muted-foreground">{voyageSummary.topValue ? <><span className="font-bold capitalize text-foreground">{voyageSummary.topCategory}</span> leads your recent supplies at ₹{voyageSummary.topValue.toLocaleString()}.</> : "Your captain’s log will become more useful as you add supplies to the voyage."}</p></CardContent></Card>

          <div><p className="mb-3 text-xs font-bold uppercase tracking-[.14em] text-muted-foreground">Ask the log</p><div className="space-y-2">{quickQuestions.map((question) => <button type="button" key={question} onClick={() => sendQuestion(question)} className="flex w-full items-center gap-3 rounded-2xl border border-border bg-card px-4 py-3 text-left text-sm font-bold shadow-[0_5px_18px_rgba(255,140,66,.06)] transition hover:border-primary/30 hover:bg-muted/60"><Lightbulb className="size-4 shrink-0 text-primary" />{question}</button>)}</div></div>
        </aside>

        <Card className="surface-card flex min-h-[570px] flex-col xl:col-span-8"><CardContent className="flex flex-1 flex-col p-5 sm:p-7"><div className="flex items-center justify-between border-b border-border pb-5"><div className="section-heading"><span className="section-icon"><Bot className="size-5" /></span>Navigator notes</div><span className="inline-flex items-center gap-1.5 rounded-full bg-success/15 px-3 py-1.5 text-xs font-bold text-[#168B6A]"><Sparkles className="size-3.5" />Ready to reflect</span></div>{messages.length === 0 ? <div className="flex flex-1 flex-col items-center justify-center px-4 py-12 text-center"><span className="flex size-16 items-center justify-center rounded-3xl bg-gradient-to-br from-[#FFF1E6] to-[#E9F6FF] text-primary shadow-[0_10px_30px_rgba(255,140,66,.12)]"><BookOpenText className="size-8" /></span><h2 className="mt-5 text-xl">Your journal is open</h2><p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">Ask about a spending habit, or pick a guided question to turn your log into a clearer route ahead.</p></div> : <div className="flex-1 space-y-4 overflow-y-auto py-6">{messages.map((message, index) => <div key={`${message.role}-${index}`} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}><div className={`max-w-[85%] rounded-3xl px-5 py-4 text-sm leading-6 sm:max-w-[75%] ${message.role === "user" ? "rounded-br-lg bg-primary text-white shadow-[0_8px_20px_rgba(255,140,66,.20)]" : "rounded-bl-lg bg-muted/70 text-foreground"}`}>{message.content}</div></div>)}</div>}<form onSubmit={(event) => { event.preventDefault(); sendQuestion(); }} className="flex gap-3 border-t border-border pt-5"><Input value={input} onChange={(event) => setInput(event.target.value)} placeholder="Ask about your spending route…" aria-label="Ask a question" /><Button type="submit" size="icon" aria-label="Send question"><Send className="size-4" /></Button></form><p className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground"><CornerDownLeft className="size-3" />Press Enter to send</p></CardContent></Card>
      </section>

      <Card className="surface-card"><CardContent className="p-6 sm:p-7"><div className="section-heading"><span className="section-icon bg-secondary/20 text-[#2B6CB0]"><TrendingUp className="size-5" /></span>Recent voyage timeline</div>{recentTimeline.length ? <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-4">{recentTimeline.map((expense) => <div key={expense.id} className="rounded-2xl bg-[#FFFDFB] p-4"><p className="text-xs font-bold text-primary">{new Date(expense.date).toLocaleDateString([], { day: "numeric", month: "short" })}</p><p className="mt-2 truncate font-extrabold capitalize">{expense.note || expense.category}</p><div className="mt-3 flex items-center justify-between text-sm"><span className="capitalize text-muted-foreground">{expense.category}</span><span className="font-extrabold">₹{expense.amount.toLocaleString()}</span></div></div>)}</div> : <div className="mt-5 rounded-3xl bg-muted/50 p-6 text-sm text-muted-foreground">Your expense timeline will begin with the first supply you log.</div>}</CardContent></Card>
    </div>
  );
}
