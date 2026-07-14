import { useMemo } from "react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Award, Crown, Flame, Gem, LockKeyhole, MapPinned, Sparkles, Target, Trophy, Vault as VaultIcon } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { Progress } from "../ui/progress";
import { useAppContext } from "../../context/AppContext";

const achievements = [
  { icon: Trophy, title: "First treasure logged", description: "Add your first voyage expense", type: "first" },
  { icon: Target, title: "Budget guardian", description: "Keep a month under budget", type: "budget" },
  { icon: Award, title: "Steady navigator", description: "Maintain a 7-day streak", type: "streak" },
  { icon: Crown, title: "Vault keeper", description: "Save ₹50,000 in treasure", type: "savings" },
];

export function TreasureVault() {
  const { user, expenses, getMonthlySavings } = useAppContext();
  const monthlySavings = getMonthlySavings();
  const savingsGoal = Math.max(user.monthlyBudget, 1000);
  const savingsProgress = Math.min((monthlySavings / savingsGoal) * 100, 100);
  const xpProgress = (user.xp % 1000) / 10;

  const history = useMemo(() => {
    const now = new Date();
    return Array.from({ length: 5 }, (_, index) => {
      const weekStart = new Date(now);
      weekStart.setDate(now.getDate() - (4 - index) * 7);
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 7);
      const activity = expenses.filter((expense) => { const date = new Date(expense.date); return date >= weekStart && date < weekEnd; }).length;
      return { week: `W${index + 1}`, xp: Math.min(1000, user.xp - (4 - index) * 70 + activity * 10) };
    });
  }, [expenses, user.xp]);

  const unlocked = (type: string) => {
    if (type === "first") return expenses.length > 0;
    if (type === "budget") return monthlySavings > 0;
    if (type === "streak") return user.streak >= 7;
    return user.totalSaved >= 50000;
  };

  const rewardCount = achievements.filter((achievement) => unlocked(achievement.type)).length;

  return (
    <div className="page-shell space-y-6">
      <div><p className="eyebrow">Your protected treasure</p><h1 className="mt-2 text-3xl sm:text-4xl">Treasure Vault</h1><p className="mt-2 text-sm text-muted-foreground">Every mindful choice adds another coin to your adventure.</p></div>

      <section className="grid gap-6 xl:grid-cols-12">
        <Card className="overflow-hidden border-primary/30 bg-gradient-to-br from-[#FFF1E6] via-[#FFF8E8] to-[#E8F7FF] shadow-[0_20px_60px_rgba(255,140,66,.14)] xl:col-span-8"><CardContent className="relative p-6 sm:p-8"><div className="absolute -right-10 -top-12 size-48 rounded-full bg-primary/15 blur-3xl" /><div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between"><div><div className="flex items-center gap-2 text-primary"><Sparkles className="size-5" /><span className="text-xs font-bold uppercase tracking-[.16em]">Monthly treasure goal</span></div><h2 className="mt-3 text-3xl font-extrabold">₹{monthlySavings.toLocaleString()}</h2><p className="mt-1 text-sm text-muted-foreground">of ₹{savingsGoal.toLocaleString()} protected this month</p></div><div className="flex size-24 items-center justify-center rounded-full border-[7px] border-[#FFE1C7] bg-white shadow-[0_10px_30px_rgba(255,140,66,.16)]"><VaultIcon className="size-10 text-primary" /></div></div><div className="relative mt-7"><div className="mb-2 flex items-center justify-between text-sm font-bold"><span>Chest fill</span><span className="text-primary">{Math.round(savingsProgress)}%</span></div><Progress value={savingsProgress} className="h-4 bg-white/75 [&>div]:bg-gradient-to-r [&>div]:from-primary [&>div]:to-[#F6C453]" /></div></CardContent></Card>
        <Card className="surface-card xl:col-span-4"><CardContent className="p-6 sm:p-7"><div className="flex items-center justify-between"><span className="section-icon bg-[#FFF7DF] text-[#D9950D]"><Flame className="size-5" /></span><span className="rounded-full bg-[#FFF1E6] px-3 py-1 text-xs font-bold text-primary">Live streak</span></div><p className="mt-5 text-4xl font-extrabold">{user.streak}<span className="ml-1 text-xl text-muted-foreground">days</span></p><p className="mt-2 text-sm leading-6 text-muted-foreground">Keep logging your supplies to extend your voyage streak.</p></CardContent></Card>
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <Card className="surface-card"><CardContent className="p-6"><span className="section-icon bg-[#F1ECFF] text-[#8063DF]"><Gem className="size-5" /></span><p className="mt-4 text-sm font-bold text-muted-foreground">Collected treasure</p><p className="mt-1 text-3xl font-extrabold">₹{user.totalSaved.toLocaleString()}</p><p className="mt-2 text-xs font-bold text-[#8063DF]">A vault that keeps growing</p></CardContent></Card>
        <Card className="surface-card"><CardContent className="p-6"><span className="section-icon"><MapPinned className="size-5" /></span><p className="mt-4 text-sm font-bold text-muted-foreground">Current level</p><p className="mt-1 text-3xl font-extrabold">Level {user.level}</p><p className="mt-2 text-xs font-bold text-primary">Navigator apprentice</p></CardContent></Card>
        <Card className="surface-card"><CardContent className="p-6"><span className="section-icon bg-success/15 text-[#168B6A]"><Trophy className="size-5" /></span><p className="mt-4 text-sm font-bold text-muted-foreground">Rewards unlocked</p><p className="mt-1 text-3xl font-extrabold">{rewardCount}<span className="ml-1 text-xl text-muted-foreground">/ {achievements.length}</span></p><p className="mt-2 text-xs font-bold text-[#168B6A]">Keep going, navigator</p></CardContent></Card>
      </section>

      <section className="grid gap-6 xl:grid-cols-12">
        <Card className="surface-card xl:col-span-7"><CardContent className="p-6 sm:p-7"><div className="section-heading"><span className="section-icon"><Target className="size-5" /></span>Voyage progress</div><div className="mt-6 rounded-3xl bg-[#FFF9F3] p-5"><div className="flex items-end justify-between gap-4"><div><p className="text-sm font-bold text-muted-foreground">Level {user.level} to level {user.level + 1}</p><p className="mt-1 text-2xl font-extrabold">{user.xp % 1000} <span className="text-sm text-muted-foreground">/ 1,000 XP</span></p></div><span className="text-sm font-extrabold text-primary">{Math.round(xpProgress)}%</span></div><Progress value={xpProgress} className="mt-5 h-3 bg-[#FFE5CC] [&>div]:bg-gradient-to-r [&>div]:from-primary [&>div]:to-[#F6C453]" /></div><div className="mt-6 h-48"><ResponsiveContainer width="100%" height="100%"><AreaChart data={history} margin={{ top: 8, right: 8, left: -20 }}><defs><linearGradient id="xpFill" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#A78BFA" stopOpacity={.28}/><stop offset="100%" stopColor="#A78BFA" stopOpacity={.01}/></linearGradient></defs><XAxis dataKey="week" axisLine={false} tickLine={false} tick={{ fill: "#9CA3AF", fontSize: 12 }} /><YAxis axisLine={false} tickLine={false} tick={{ fill: "#9CA3AF", fontSize: 12 }} /><Tooltip contentStyle={{ borderRadius: 16, border: "1px solid #F2E8DC" }} /><Area type="monotone" dataKey="xp" stroke="#A78BFA" strokeWidth={3} fill="url(#xpFill)" /></AreaChart></ResponsiveContainer></div></CardContent></Card>
        <Card className="surface-card xl:col-span-5"><CardContent className="p-6 sm:p-7"><div className="section-heading"><span className="section-icon bg-success/15 text-[#168B6A]"><Crown className="size-5" /></span>Next milestone</div><div className="mt-6 rounded-3xl border border-dashed border-primary/30 bg-[#FFFDFB] p-5"><p className="text-sm font-bold text-primary">Keep 7 days in your log</p><p className="mt-2 text-sm leading-6 text-muted-foreground">You&apos;re {Math.max(0, 7 - user.streak)} day{Math.max(0, 7 - user.streak) === 1 ? "" : "s"} away from unlocking the Steady Navigator reward.</p></div></CardContent></Card>
      </section>

      <Card className="surface-card"><CardContent className="p-6 sm:p-7"><div className="section-heading"><span className="section-icon bg-[#F1ECFF] text-[#8063DF]"><Award className="size-5" /></span>Achievements</div><div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{achievements.map((achievement) => { const Icon = achievement.icon; const isUnlocked = unlocked(achievement.type); return <div key={achievement.type} className={`rounded-3xl border p-5 ${isUnlocked ? "border-primary/25 bg-gradient-to-br from-[#FFF8EF] to-[#FFF1E6]" : "border-border bg-[#FFFDFB]"}`}><span className={`flex size-11 items-center justify-center rounded-2xl ${isUnlocked ? "bg-primary text-white" : "bg-muted text-muted-foreground"}`}>{isUnlocked ? <Icon className="size-5" /> : <LockKeyhole className="size-5" />}</span><p className="mt-4 font-extrabold">{achievement.title}</p><p className="mt-1 text-sm leading-5 text-muted-foreground">{achievement.description}</p><p className={`mt-4 text-xs font-bold ${isUnlocked ? "text-primary" : "text-muted-foreground"}`}>{isUnlocked ? "Unlocked" : "Locked"}</p></div>; })}</div></CardContent></Card>
    </div>
  );
}
