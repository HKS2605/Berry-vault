import { useRef, useState } from "react";
import { useNavigate } from "react-router";
import {
  CalendarDays,
  CheckCircle2,
  Frown,
  Meh,
  Plus,
  Save,
  Smile,
  Store,
  Tag,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { useAppContext } from "../../context/AppContext";
import foodIcon from "../../../assets/food.png";
import travelIcon from "../../../assets/travel.png";
import shoppingIcon from "../../../assets/shopping.png";
import subscriptionsIcon from "../../../assets/subscriptions.png";
import entertainmentIcon from "../../../assets/entertainment.png";
import educationIcon from "../../../assets/education.png";
import otherIcon from "../../../assets/orange.svg";

const categories = [
  { id: "food", icon: foodIcon, label: "Food", tone: "bg-[#FFF0E5]" },
  { id: "travel", icon: travelIcon, label: "Travel", tone: "bg-[#E9F6FF]" },
  { id: "shopping", icon: shoppingIcon, label: "Shopping", tone: "bg-[#E8FBF4]" },
  { id: "subscriptions", icon: subscriptionsIcon, label: "Subscriptions", tone: "bg-[#F2EDFF]" },
  { id: "entertainment", icon: entertainmentIcon, label: "Fun", tone: "bg-[#FFF7DF]" },
  { id: "education", icon: educationIcon, label: "Learning", tone: "bg-[#EEF4FF]" },
  { id: "other", icon: otherIcon, label: "Other", tone: "bg-[#F6F1EB]" },
];

const quickTags = ["Hungry",
  "Bored",
  "Reward",
  "Stress",
  "Impulse",
  "Why the fuck",
  "Friends",
  "Date",
  "Travel",];
  
const moods = [
  { label: "Low", icon: Frown },
  { label: "Neutral", icon: Meh },
  { label: "Happy", icon: Smile },
];

export function AddExpense() {
  const { addExpense } = useAppContext();
  const navigate = useNavigate();
  const receiptInput = useRef<HTMLInputElement>(null);
  const [amount, setAmount] = useState("");
  const [merchant, setMerchant] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [note, setNote] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [mood, setMood] = useState(1);

  const toggleTag = (tag: string) => setSelectedTags((current) => current.includes(tag) ? current.filter((item) => item !== tag) : [...current, tag]);

  const handleSubmit = () => {
    const parsedAmount = Number(amount.replace(/,/g, ""));
    const normalizedAmount = Number.isFinite(parsedAmount) ? Math.round(parsedAmount * 100) / 100 : NaN;
    if (!normalizedAmount || normalizedAmount <= 0 || !selectedCategory) {
      toast.error("Enter a valid amount and choose a category.");
      return;
    }

    addExpense({
      amount: normalizedAmount,
      category: selectedCategory,
      tags: selectedTags,
      note: merchant.trim() || note.trim(),
      mood,
      emoji: "",
      date: `${date}T12:00:00`,
    });
    toast.success("Expense safely added to your treasure log.");
    setTimeout(() => navigate("/"), 650);
  };

  return (
    <div className="page-shell max-w-6xl">
      <div className="mb-7 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div><p className="eyebrow">Voyage supplies</p><h1 className="mt-2 text-3xl sm:text-4xl">Add an expense</h1><p className="mt-2 text-sm text-muted-foreground">Give every spend a place on your map.</p></div>
        <div className="inline-flex items-center gap-2 rounded-full bg-success/15 px-4 py-2 text-sm font-bold text-[#168B6A]"><CheckCircle2 className="size-4" />Your log saves automatically</div>
      </div>

      <Card className="surface-card overflow-hidden">
        <CardContent className="p-5 sm:p-8">
          <div className="grid gap-8 lg:grid-cols-[1.25fr_.75fr]">
            <div className="space-y-7">
              <div>
                <label htmlFor="amount" className="mb-3 block text-sm font-bold text-foreground">How much did you spend?</label>
                <div className="relative"><span className="pointer-events-none absolute left-6 top-1/2 -translate-y-1/2 text-3xl font-extrabold text-primary">₹</span><Input id="amount" type="text" inputMode="decimal" min="0" value={amount} onChange={(event) => setAmount(event.target.value)} placeholder="0" className="h-24 border-primary/20 bg-[#FFFDFB] pl-14 text-4xl font-extrabold tracking-tight shadow-inner shadow-primary/5 sm:text-5xl" /></div>
              </div>

              <div><label className="mb-3 block text-sm font-bold">Choose a category</label><div className="grid grid-cols-2 gap-3 sm:grid-cols-4">{categories.map((category) => { const selected = selectedCategory === category.id; return <button type="button" key={category.id} onClick={() => setSelectedCategory(category.id)} className={`group rounded-2xl border p-3 text-left transition-all ${selected ? "border-primary bg-[#FFF1E6] shadow-[0_8px_20px_rgba(255,140,66,.14)]" : "border-border bg-card hover:-translate-y-0.5 hover:border-primary/35"}`}><span className={`mb-3 flex size-11 items-center justify-center rounded-xl ${category.tone}`}><img src={category.icon} alt="" className="size-8 object-contain" /></span><span className="block text-xs font-bold sm:text-sm">{category.label}</span></button>; })}</div></div>

              <div><div className="mb-3 flex items-center justify-between"><label className="text-sm font-bold">Tag this moment</label><Tag className="size-4 text-primary" /></div><div className="flex flex-wrap gap-2">{quickTags.map((tag) => <button type="button" key={tag} onClick={() => toggleTag(tag)} className={`rounded-full px-4 py-2 text-sm font-bold transition-all ${selectedTags.includes(tag) ? "bg-primary text-white shadow-[0_5px_14px_rgba(255,140,66,.22)]" : "bg-muted/70 text-muted-foreground hover:bg-accent hover:text-primary"}`}>{tag}</button>)}<button type="button" onClick={() => toast.info("Custom tags will be available in the next voyage update.")} className="inline-flex items-center gap-1 rounded-full border border-dashed border-primary/40 px-4 py-2 text-sm font-bold text-primary hover:bg-accent"><Plus className="size-4" />Custom</button></div></div>

              <div><label htmlFor="note" className="mb-3 block text-sm font-bold">A small note <span className="font-medium text-muted-foreground">(optional)</span></label><Textarea id="note" value={note} onChange={(event) => setNote(event.target.value)} placeholder="What made this spend worthwhile?" rows={4} /></div>
            </div>

            <div className="space-y-5 rounded-3xl bg-gradient-to-b from-[#FFF9F3] to-[#FFF1E6]/70 p-5 sm:p-6">
              <div><p className="eyebrow">Details</p><h2 className="mt-1 text-xl">Log the essentials</h2></div>
              <div><label htmlFor="merchant" className="mb-2 block text-sm font-bold">Merchant</label><div className="relative"><Store className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-primary" /><Input id="merchant" value={merchant} onChange={(event) => setMerchant(event.target.value)} placeholder="Where did you spend?" className="pl-11" /></div></div>
              <div><label htmlFor="date" className="mb-2 block text-sm font-bold">Date</label><div className="relative"><CalendarDays className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-primary" /><Input id="date" type="date" value={date} onChange={(event) => setDate(event.target.value)} className="pl-11" /></div></div>
              <div><label className="mb-2 block text-sm font-bold">How did it feel?</label><div className="grid grid-cols-3 gap-2">{moods.map((item, index) => { const Icon = item.icon; return <button type="button" onClick={() => setMood(index)} key={item.label} className={`flex min-h-16 flex-col items-center justify-center gap-1 rounded-2xl border text-xs font-bold transition-all ${mood === index ? "border-primary bg-white text-primary" : "border-transparent bg-white/70 text-muted-foreground"}`}><Icon className="size-5" />{item.label}</button>; })}</div></div>
            </div>
          </div>
          <div className="mt-8 flex flex-col-reverse gap-3 border-t border-border pt-6 sm:flex-row sm:justify-end"><Button type="button" variant="ghost" onClick={() => navigate(-1)} className="text-muted-foreground hover:text-primary">Cancel</Button><Button type="button" size="lg" onClick={handleSubmit} className="min-w-[210px]"><Save className="size-4" />Save to treasure log</Button></div>
        </CardContent>
      </Card>
    </div>
  );
}
