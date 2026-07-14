import { useState } from "react";
import { Bell, Check, ChevronRight, Download, Edit3, LockKeyhole, Palette, ShieldCheck, Sparkles, UserRound, WalletCards } from "lucide-react";
import { toast } from "sonner";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Input } from "../ui/input";
import { Progress } from "../ui/progress";
import { Switch } from "../ui/switch";
import { useAppContext } from "../../context/AppContext";

export function Profile() {
  const { user, expenses, updateUser, getCurrentMonthSpent, getMonthlySavings } = useAppContext();
  const [editingName, setEditingName] = useState(false);
  const [name, setName] = useState(user.name);
  const [editingBudget, setEditingBudget] = useState(false);
  const [budget, setBudget] = useState(user.monthlyBudget.toString());
  const [expenseAlerts, setExpenseAlerts] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(true);

  const monthSpent = getCurrentMonthSpent();
  const monthlySavings = getMonthlySavings();
  const totalSpent = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const budgetProgress = Math.min((monthSpent / Math.max(user.monthlyBudget, 1)) * 100, 100);

  const saveName = () => {
    const nextName = name.trim();
    if (!nextName) { toast.error("Your navigator name can’t be empty."); return; }
    updateUser({ name: nextName });
    setEditingName(false);
    toast.success("Navigator profile updated.");
  };

  const saveBudget = () => {
    const nextBudget = Number(budget);
    if (!nextBudget || nextBudget <= 0) { toast.error("Enter a valid monthly budget."); return; }
    updateUser({ monthlyBudget: nextBudget });
    setEditingBudget(false);
    toast.success("Monthly treasure plan updated.");
  };

  const exportData = () => {
    const blob = new Blob([JSON.stringify({ user, expenses, exportedAt: new Date().toISOString() }, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `berry-vault-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success("Your treasure log has been exported.");
  };

  return (
    <div className="page-shell max-w-6xl space-y-6">
      <div><p className="eyebrow">Navigator account</p><h1 className="mt-2 text-3xl sm:text-4xl">Profile & preferences</h1><p className="mt-2 text-sm text-muted-foreground">Keep your treasure plan and account details in shipshape.</p></div>

      <Card className="overflow-hidden border-primary/25 bg-gradient-to-r from-[#FFF1E6] via-[#FFF9F1] to-[#E9F6FF] shadow-[0_20px_60px_rgba(255,140,66,.12)]"><CardContent className="p-6 sm:p-8"><div className="flex flex-col gap-6 sm:flex-row sm:items-center"><Avatar className="size-24 border-4 border-white shadow-[0_10px_30px_rgba(255,140,66,.18)]"><AvatarFallback className="bg-gradient-to-br from-[#FF9F5A] to-primary text-3xl font-extrabold text-white">{user.name.charAt(0).toUpperCase()}</AvatarFallback></Avatar><div className="min-w-0 flex-1">{editingName ? <div className="flex max-w-sm gap-2"><Input value={name} onChange={(event) => setName(event.target.value)} aria-label="Navigator name" /><Button type="button" size="icon" onClick={saveName} aria-label="Save name"><Check className="size-4" /></Button></div> : <div className="flex items-center gap-3"><h2 className="truncate text-3xl font-extrabold">{user.name}</h2><button type="button" onClick={() => setEditingName(true)} className="flex size-9 items-center justify-center rounded-xl bg-white/75 text-primary hover:bg-white" aria-label="Edit profile name"><Edit3 className="size-4" /></button></div>}<p className="mt-2 text-sm font-bold text-muted-foreground">Level {user.level} Navigator <span className="px-1 text-primary">•</span> {user.streak}-day voyage streak</p><div className="mt-5 flex flex-wrap gap-3"><span className="rounded-full bg-white/70 px-4 py-2 text-sm font-bold text-primary">{user.xp} XP collected</span><span className="rounded-full bg-white/70 px-4 py-2 text-sm font-bold text-[#168B6A]">₹{user.totalSaved.toLocaleString()} protected</span></div></div><span className="flex size-14 items-center justify-center rounded-3xl bg-white/70 text-primary"><Sparkles className="size-7" /></span></div></CardContent></Card>

      <section className="grid gap-4 md:grid-cols-3"><Card className="surface-card"><CardContent className="p-6"><span className="section-icon"><WalletCards className="size-5" /></span><p className="mt-4 text-sm font-bold text-muted-foreground">Expenses logged</p><p className="mt-1 text-3xl font-extrabold">{expenses.length}</p></CardContent></Card><Card className="surface-card"><CardContent className="p-6"><span className="section-icon bg-[#FFF7DF] text-[#D9950D]"><UserRound className="size-5" /></span><p className="mt-4 text-sm font-bold text-muted-foreground">Total supplies spent</p><p className="mt-1 text-3xl font-extrabold">₹{totalSpent.toLocaleString()}</p></CardContent></Card><Card className="surface-card"><CardContent className="p-6"><span className="section-icon bg-success/15 text-[#168B6A]"><ShieldCheck className="size-5" /></span><p className="mt-4 text-sm font-bold text-muted-foreground">This month saved</p><p className="mt-1 text-3xl font-extrabold">₹{monthlySavings.toLocaleString()}</p></CardContent></Card></section>

      <section className="grid gap-6 lg:grid-cols-2"><Card className="surface-card"><CardContent className="p-6 sm:p-7"><div className="flex items-center justify-between"><div className="section-heading"><span className="section-icon"><WalletCards className="size-5" /></span>Monthly treasure plan</div>{!editingBudget && <Button type="button" variant="outline" size="sm" onClick={() => setEditingBudget(true)}>Edit budget</Button>}</div>{editingBudget ? <div className="mt-6 flex flex-col gap-3 sm:flex-row"><Input type="number" inputMode="numeric" value={budget} onChange={(event) => setBudget(event.target.value)} aria-label="Monthly budget" /><Button type="button" onClick={saveBudget}>Save plan</Button><Button type="button" variant="ghost" onClick={() => { setBudget(user.monthlyBudget.toString()); setEditingBudget(false); }}>Cancel</Button></div> : <><div className="mt-6 flex items-end justify-between"><div><p className="text-sm font-bold text-muted-foreground">Spent this month</p><p className="mt-1 text-3xl font-extrabold">₹{monthSpent.toLocaleString()}</p></div><p className="text-sm font-bold text-primary">of ₹{user.monthlyBudget.toLocaleString()}</p></div><Progress value={budgetProgress} className="mt-5 h-3 bg-muted [&>div]:bg-gradient-to-r [&>div]:from-primary [&>div]:to-[#F6C453]" /><p className="mt-3 text-sm text-muted-foreground">₹{monthlySavings.toLocaleString()} remains for the rest of this month.</p></>}</CardContent></Card>
        <Card className="surface-card"><CardContent className="p-6 sm:p-7"><div className="section-heading"><span className="section-icon bg-[#F1ECFF] text-[#8063DF]"><Bell className="size-5" /></span>Notification settings</div><div className="mt-5 divide-y divide-border"><div className="flex items-center gap-4 py-4"><span className="flex size-10 items-center justify-center rounded-xl bg-muted text-primary"><WalletCards className="size-4" /></span><div className="flex-1"><p className="font-bold">Expense alerts</p><p className="mt-0.5 text-sm text-muted-foreground">A gentle note when you add a supply.</p></div><Switch checked={expenseAlerts} onCheckedChange={setExpenseAlerts} aria-label="Toggle expense alerts" /></div><div className="flex items-center gap-4 py-4"><span className="flex size-10 items-center justify-center rounded-xl bg-muted text-primary"><Bell className="size-4" /></span><div className="flex-1"><p className="font-bold">Weekly digest</p><p className="mt-0.5 text-sm text-muted-foreground">See your voyage summary each week.</p></div><Switch checked={weeklyDigest} onCheckedChange={setWeeklyDigest} aria-label="Toggle weekly digest" /></div></div></CardContent></Card></section>

      <Card className="surface-card"><CardContent className="p-6 sm:p-7"><div className="section-heading"><span className="section-icon bg-[#E9F6FF] text-[#2B6CB0]"><Palette className="size-5" /></span>Preferences & data</div><div className="mt-5 grid gap-3 md:grid-cols-3"><button type="button" onClick={() => toast.info("Berry Vault is currently using the Tropical Light theme.")} className="group flex items-center gap-3 rounded-2xl bg-[#FFFDFB] p-4 text-left hover:bg-muted/60"><span className="flex size-10 items-center justify-center rounded-xl bg-[#FFF1E6] text-primary"><Palette className="size-4" /></span><span className="min-w-0 flex-1"><span className="block font-bold">Appearance</span><span className="block text-xs text-muted-foreground">Tropical Light</span></span><ChevronRight className="size-4 text-muted-foreground group-hover:text-primary" /></button><button type="button" onClick={exportData} className="group flex items-center gap-3 rounded-2xl bg-[#FFFDFB] p-4 text-left hover:bg-muted/60"><span className="flex size-10 items-center justify-center rounded-xl bg-[#E8FBF4] text-[#168B6A]"><Download className="size-4" /></span><span className="min-w-0 flex-1"><span className="block font-bold">Export data</span><span className="block text-xs text-muted-foreground">Download your log</span></span><ChevronRight className="size-4 text-muted-foreground group-hover:text-primary" /></button><button type="button" onClick={() => toast.info("Your data stays in this browser until cloud backup is connected.")} className="group flex items-center gap-3 rounded-2xl bg-[#FFFDFB] p-4 text-left hover:bg-muted/60"><span className="flex size-10 items-center justify-center rounded-xl bg-[#F1ECFF] text-[#8063DF]"><LockKeyhole className="size-4" /></span><span className="min-w-0 flex-1"><span className="block font-bold">Privacy</span><span className="block text-xs text-muted-foreground">Stored locally</span></span><ChevronRight className="size-4 text-muted-foreground group-hover:text-primary" /></button></div></CardContent></Card>
    </div>
  );
}
