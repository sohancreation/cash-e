import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useProfile, useTransactions } from "@/hooks/use-profile";
import { useCasheI18n } from "@/lib/cashe-i18n";
import {
  Bell, Eye, Send, QrCode, Receipt, Plus, Sparkles, TrendingUp,
  Wheat, GraduationCap, Bike, ShieldPlus, Store, Mail,
  Mic, Package, Trophy, ChevronRight, Flame, Gift,
  Ticket, Smartphone, Cpu, Heart, Gamepad, Moon,
  ChevronLeft, Check, Play,
} from "lucide-react";

function useUnreadCount() {
  const qc = useQueryClient();
  const q = useQuery({
    queryKey: ["notifications-unread"],
    queryFn: async () => {
      const { count, error } = await supabase
        .from("notifications")
        .select("*", { count: "exact", head: true })
        .eq("read", false);
      if (error) throw error;
      return count ?? 0;
    },
  });
  useEffect(() => {
    const ch = supabase
      .channel("notif-unread-watch")
      .on("postgres_changes", { event: "*", schema: "public", table: "notifications" }, () => {
        qc.invalidateQueries({ queryKey: ["notifications-unread"] });
      })
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [qc]);
  return q;
}

export const Route = createFileRoute("/_authenticated/app/")({
  component: Home,
});

const quickActions = [
  { to: "/app/send", Icon: Send, label: "Send", color: "from-primary to-accent" },
  { to: "/app/qr", Icon: QrCode, label: "Scan QR", color: "from-gold to-yellow-500" },
  { to: "/app/bills", Icon: Receipt, label: "Pay Bill", color: "from-blue-400 to-blue-600" },
  { to: "/app/cashin", Icon: Plus, label: "Cash In", color: "from-pink-400 to-rose-600" },
];

const ecosystem = [
  { to: "/app/sanchay", Icon: TrendingUp, label: "Sanchay", sub: "Savings", color: "bg-primary/20 text-primary" },
  { to: "/app/khamar", Icon: Wheat, label: "Khamar", sub: "Agri", color: "bg-amber-500/20 text-amber-400" },
  { to: "/app/student", Icon: GraduationCap, label: "Student", sub: "Mode", color: "bg-blue-500/20 text-blue-400" },
  { to: "/app/gig", Icon: Bike, label: "Gig Wallet", sub: "Payouts", color: "bg-rose-500/20 text-rose-400" },
  { to: "/app/bima", Icon: ShieldPlus, label: "Bima", sub: "Insurance", color: "bg-emerald-500/20 text-emerald-400" },
  { to: "/app/bazaar", Icon: Store, label: "Bazaar", sub: "Shop", color: "bg-fuchsia-500/20 text-fuchsia-400" },
  { to: "/app/postpay", Icon: Mail, label: "PostPay", sub: "Doot", color: "bg-gold/20 text-gold" },
  { to: "/app/ai", Icon: Sparkles, label: "AI", sub: "Assist", color: "bg-violet-500/20 text-violet-400" },
];

function Home() {
  const { data: p } = useProfile();
  const { data: txs } = useTransactions(5);
  const { isBn, tr, money, num } = useCasheI18n();
  const { data: unread = 0 } = useUnreadCount();
  const qc = useQueryClient();

  // Interactive Mini-Apps State
  const [activeService, setActiveService] = useState<string | null>(null);

  // Tickets Mini-App State
  const [ticketType, setTicketType] = useState<"bus" | "train" | "flight">("bus");
  const [selectedSeat, setSelectedSeat] = useState<string | null>(null);
  const [fromCity, setFromCity] = useState("Dhaka");
  const [toCity, setToCity] = useState("Chattogram");
  const [travelerName, setTravelerName] = useState("");
  const [bookingStep, setBookingStep] = useState<"form" | "success">("form");
  const [bookedTicket, setBookedTicket] = useState<any>(null);
  const [payingService, setPayingService] = useState(false);

  // Operators Mini-App State
  const [selectedOp, setSelectedOp] = useState<"gp" | "robi" | "bl" | "teletalk">("gp");
  const [roamingActive, setRoamingActive] = useState(false);
  const [selectedPack, setSelectedPack] = useState<any>(null);
  const [opStep, setOpStep] = useState<"list" | "success">("list");

  // Games Mini-App State (Spin Wheel)
  const [isSpinning, setIsSpinning] = useState(false);
  const [spinAngle, setSpinAngle] = useState(0);
  const [spinResult, setSpinResult] = useState<string | null>(null);

  // Subscriptions Mini-App State
  const [subStep, setSubStep] = useState<"list" | "success">("list");
  const [selectedSubscription, setSelectedSubscription] = useState<any>(null);

  // Deen Mini-App State
  const [tasbihCount, setTasbihCount] = useState(0);
  const [tasbihMax, setTasbihMax] = useState(33);

  // Invest Edu Mini-App State
  const [eduStep, setEduStep] = useState<"article" | "quiz" | "success">("article");
  const [quizAnswer, setQuizAnswer] = useState<number | null>(null);
  const [quizChecked, setQuizChecked] = useState(false);

  // Live Wallet Pay Action
  const payForService = async (amountCents: number, serviceName: string, serviceNote: string, xpReward: number, onSuccess: () => void) => {
    if ((p?.balance_cents ?? 0) < amountCents) {
      toast.error(tr("Insufficient balance in your CASh-E wallet!", "আপনার ক্যাশ-ই ওয়ালেটে পর্যাপ্ত ব্যালেন্স নেই!"));
      return;
    }
    setPayingService(true);
    const { error } = await supabase.rpc("debit_wallet", {
      p_kind: "bill",
      p_amount_cents: amountCents,
      p_counterparty: serviceName,
      p_note: serviceNote,
      p_meta: { type: "mini_app" } as any,
      p_award_xp: xpReward,
    });
    setPayingService(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    qc.invalidateQueries({ queryKey: ["profile"] });
    qc.invalidateQueries({ queryKey: ["transactions"] });
    onSuccess();
  };

  // Live Game Winning Credit Action
  const creditWinnings = async (amountCents: number, prizeName: string) => {
    const { error } = await supabase.rpc("credit_wallet", {
      p_kind: "cashin",
      p_amount_cents: amountCents,
      p_counterparty: "CASh-E Play Zone",
      p_note: `Spin Wheel Prize · ${prizeName}`,
      p_meta: { game: "spin_wheel" } as any,
    });
    if (error) {
      toast.error(error.message);
      return;
    }
    qc.invalidateQueries({ queryKey: ["profile"] });
    qc.invalidateQueries({ queryKey: ["transactions"] });
  };

  const seed = p?.avatar_seed ?? "CE";
  const name = tr("CASh-E User");

  const xp = p?.xp ?? 0;
  const level = p?.level ?? 1;
  const xpInLevel = xp % 100;
  const xpToNext = 100 - xpInLevel;
  const today = new Date().toISOString().slice(0, 10);
  const checkedInToday = p?.last_active_date === today;

  const checkin = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.rpc("daily_checkin");
      if (error) throw error;
      return data as { ok: boolean; streak: number; xp: number; reason?: string };
    },
    onSuccess: (d) => {
      if (d.ok) toast.success(`🔥 ${tr("Day")} ${num(d.streak)} · +${num(d.xp)} XP`);
      else toast.info(tr("Already checked in today"));
      qc.invalidateQueries({ queryKey: ["profile"] });
    },
    onError: (e: any) => toast.error(e.message),
  });

  return (
    <div className="gradient-hero min-h-full">
      {/* Header */}
      <div className="px-5 pt-6 pb-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-sm font-bold border-2 border-gold/40">
            {seed}
          </div>
          <div>
              <div className="text-[11px] text-muted-foreground">{tr("Assalamu Alaikum")}</div>
              <div className="text-sm font-semibold">{name} · <span className="text-gold capitalize">{tr(p?.tier ?? "silver")}</span></div>
          </div>
        </div>
        <Link to="/app/notifications" className="relative w-10 h-10 rounded-full glass flex items-center justify-center">
          <Bell className="w-4 h-4" />
          {unread > 0 && (
            <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-1 rounded-full bg-destructive text-white text-[9px] font-bold flex items-center justify-center">
              {unread > 9 ? "9+" : num(unread)}
            </span>
          )}
        </Link>
      </div>

      {/* Balance */}
      <div className="px-5">
        <div className="relative rounded-3xl gradient-card p-5 overflow-hidden shadow-glow">
          <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-gold/30 blur-3xl" />
          <div className="absolute -left-6 -bottom-6 w-32 h-32 rounded-full bg-primary/40 blur-2xl" />
          <div className="relative flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 text-[11px] text-foreground/70">
                {tr("Available Balance")} <Eye className="w-3 h-3" />
              </div>
              <div className="text-3xl font-bold mt-1 tracking-tight">{money(p?.balance_cents ?? 0)}</div>
              <div className="text-[11px] text-foreground/60 mt-0.5">+{num(p?.xp ?? 0)} XP · {tr("Level")} {num(p?.level ?? 1)}</div>
            </div>
            <div className="text-right">
              <div className="px-2.5 py-1 rounded-full bg-gold/20 border border-gold/30 text-gold text-[10px] font-semibold uppercase">{tr(p?.tier ?? "silver")} {tr("TIER")}</div>
              <div className="text-[11px] mt-2 text-foreground/70">{tr("Streak")}</div>
              <div className="text-sm font-bold text-gold">🔥 {num(p?.streak ?? 1)} {tr("d")}</div>
            </div>
          </div>
          <div className="relative mt-4 grid grid-cols-4 gap-2">
            {quickActions.map(({ to, Icon, label, color }) => (
              <Link key={label} to={to as any} className="flex flex-col items-center gap-1.5 group">
                <div className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center shadow-lg group-active:scale-95 transition`}>
                  <Icon className="w-4 h-4 text-white" strokeWidth={2.2} />
                </div>
                <span className="text-[10px] font-medium text-foreground/85">{tr(label)}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Gamification: Level + Streak + Daily check-in */}
      <div className="px-5 mt-4">
        <div className="rounded-2xl p-4 bg-gradient-to-br from-gold/15 via-amber-500/5 to-transparent border border-gold/20">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl gradient-gold flex items-center justify-center shadow-glow">
                <Trophy className="w-5 h-5 text-black" />
              </div>
              <div>
                <div className="text-[11px] text-muted-foreground">{tr("Level")} {num(level)} · <span className="text-gold capitalize">{tr(p?.tier ?? "silver")}</span></div>
                <div className="text-sm font-bold">{num(xpInLevel)}/100 XP <span className="text-muted-foreground font-normal">— {num(xpToNext)} {tr("to next")}</span></div>
              </div>
            </div>
            <button
              onClick={() => checkin.mutate()}
              disabled={checkedInToday || checkin.isPending}
              className={`px-3 py-2 rounded-xl text-[11px] font-bold flex items-center gap-1.5 ${
                checkedInToday
                  ? "bg-white/5 text-muted-foreground"
                  : "gradient-gold text-black active:scale-95 shadow-glow"
              }`}
            >
              <Flame className="w-3.5 h-3.5" />
              {checkedInToday ? tr("Checked in") : tr("Check in")}
            </button>
          </div>
          <div className="mt-3 h-2 rounded-full bg-white/10 overflow-hidden">
            <div className="h-full gradient-gold rounded-full transition-all" style={{ width: `${xpInLevel}%` }} />
          </div>
          <div className="mt-3 grid grid-cols-3 gap-2 text-center">
            <div className="rounded-xl bg-white/5 py-2">
              <div className="text-base font-bold text-gold">🔥 {num(p?.streak ?? 1)}</div>
              <div className="text-[9px] text-muted-foreground uppercase tracking-wide">{tr("Streak")}</div>
            </div>
            <Link to="/app/missions" className="rounded-xl bg-white/5 py-2 active:scale-95 transition">
              <div className="text-base font-bold text-primary flex items-center justify-center gap-1"><Gift className="w-4 h-4" /></div>
              <div className="text-[9px] text-muted-foreground uppercase tracking-wide">{tr("Missions")}</div>
            </Link>
            <div className="rounded-xl bg-white/5 py-2">
              <div className="text-base font-bold text-emerald-400">{num(xp)}</div>
              <div className="text-[9px] text-muted-foreground uppercase tracking-wide">{tr("Total XP")}</div>
            </div>
          </div>
        </div>
      </div>
      <Link to="/app/ai" className="block px-5 mt-4">
        <div className="glass-strong rounded-2xl p-3.5 flex items-center gap-3 relative overflow-hidden">
          <div className="absolute -right-6 -top-6 w-24 h-24 rounded-full bg-violet-500/20 blur-2xl" />
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center shrink-0">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[11px] text-violet-300 font-semibold">{tr("CASh-E AI · Bangla")}</div>
            <div className="text-xs text-foreground/85 truncate">“{tr("Ask me how to save ৳800 this month 🌙")}”</div>
          </div>
          <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center">
            <Mic className="w-4 h-4 text-violet-300" />
          </div>
        </div>
      </Link>

      {/* Ecosystem */}
      <div className="px-5 mt-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold">{tr("CASh-E Ecosystem")}</h3>
          <Link to="/app/missions" className="text-[11px] text-primary flex items-center gap-0.5">
            <Trophy className="w-3 h-3" /> {tr("Missions")} <ChevronRight className="w-3 h-3" />
          </Link>
        </div>
        <div className="grid grid-cols-4 gap-3">
          {ecosystem.map(({ to, Icon, label, sub, color }) => (
            <Link key={label} to={to as any} className="flex flex-col items-center gap-1.5 glass rounded-2xl py-3 px-1">
              <div className={`w-9 h-9 rounded-xl ${color} flex items-center justify-center`}>
                <Icon className="w-4 h-4" strokeWidth={2.2} />
              </div>
              <div className="text-center leading-tight">
                <div className="text-[10px] font-semibold">{tr(label)}</div>
                <div className="text-[9px] text-muted-foreground">{tr(sub)}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Offers Section */}
      <div className="px-5 mt-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold">{tr("Offers", "অফারসমূহ")}</h3>
          <button onClick={() => toast.info(tr("More offers coming soon!", "আরও অফার শীঘ্রই আসছে!"))} className="text-[11px] text-primary flex items-center gap-0.5 hover:underline">
            {tr("View all", "সব দেখুন")} <ChevronRight className="w-3 h-3" />
          </button>
        </div>
        <div className="flex gap-3 overflow-x-auto no-scrollbar px-5 -mx-5 pb-2">
          {/* Offer 1 */}
          <div 
            onClick={() => toast.success(tr("৳300 Cashback offer collected! 🎉", "৳৩০০ ক্যাশব্যাক অফার সংগ্রহ করা হয়েছে! 🎉"))}
            className="flex-shrink-0 w-[150px] rounded-2xl overflow-hidden glass border border-white/5 active:scale-98 transition cursor-pointer"
          >
            <div className="bg-[#e91e63] h-20 flex items-center justify-center relative">
              <span className="absolute top-2 right-2 text-[8px] font-bold bg-white/20 px-2 py-0.5 rounded-full text-white backdrop-blur-sm">
                TAP
              </span>
              <Gift className="w-8 h-8 text-white animate-pulse" />
            </div>
            <div className="p-3 bg-black/40">
              <div className="text-xs font-bold text-white">{tr("৳300 Cashback", "৳৩০০ ক্যাশব্যাক")}</div>
              <div className="text-[9px] text-muted-foreground mt-0.5">{tr("Importers Hub", "ইম্পোর্টার্স হাব")}</div>
            </div>
          </div>

          {/* Offer 2 */}
          <div 
            onClick={() => toast.success(tr("৳300 Cashback offer collected! 🎉", "৳৩০০ ক্যাশব্যাক অফার সংগ্রহ করা হয়েছে! 🎉"))}
            className="flex-shrink-0 w-[150px] rounded-2xl overflow-hidden glass border border-white/5 active:scale-98 transition cursor-pointer"
          >
            <div className="bg-[#ff9800] h-20 flex items-center justify-center">
              <Gift className="w-8 h-8 text-white" />
            </div>
            <div className="p-3 bg-black/40">
              <div className="text-xs font-bold text-white">{tr("৳300 Cashback", "৳৩০০ ক্যাশব্যাক")}</div>
              <div className="text-[9px] text-muted-foreground mt-0.5">{tr("HomeTex BD", "হোমটেক্স বিডি")}</div>
            </div>
          </div>

          {/* Offer 3 */}
          <div 
            onClick={() => toast.success(tr("৳150 Discount offer collected! 🍕", "৳১৫০ ডিসকাউন্ট অফার সংগ্রহ করা হয়েছে! 🍕"))}
            className="flex-shrink-0 w-[150px] rounded-2xl overflow-hidden glass border border-white/5 active:scale-98 transition cursor-pointer"
          >
            <div className="bg-[#e53935] h-20 flex items-center justify-center">
              <Gift className="w-8 h-8 text-white" />
            </div>
            <div className="p-3 bg-black/40">
              <div className="text-xs font-bold text-white">{tr("৳150 Discount", "৳১৫০ ডিসকাউন্ট")}</div>
              <div className="text-[9px] text-muted-foreground mt-0.5">{tr("Pizza Hut", "পিৎজা হাট")}</div>
            </div>
          </div>

          {/* Offer 4 */}
          <div 
            onClick={() => toast.success(tr("10% Cashback offer collected! 👟", "১০% ক্যাশব্যাক অফার সংগ্রহ করা হয়েছে! 👟"))}
            className="flex-shrink-0 w-[150px] rounded-2xl overflow-hidden glass border border-white/5 active:scale-98 transition cursor-pointer"
          >
            <div className="bg-[#1e88e5] h-20 flex items-center justify-center">
              <Gift className="w-8 h-8 text-white" />
            </div>
            <div className="p-3 bg-black/40">
              <div className="text-xs font-bold text-white">{tr("10% Cashback", "১০% ক্যাশব্যাক")}</div>
              <div className="text-[9px] text-muted-foreground mt-0.5">{tr("Apex Shoes", "এপেক্স শুজ")}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Other Services Section */}
      <div className="px-5 mt-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold">{tr("Other Services", "অন্যান্য সেবা")}</h3>
          <button onClick={() => toast.info(tr("Explore other digital services!", "অন্যান্য ডিজিটাল সেবা এক্সপ্লোর করুন!"))} className="text-[11px] text-primary flex items-center gap-0.5 hover:underline">
            {tr("View all", "সব দেখুন")} <ChevronRight className="w-3 h-3" />
          </button>
        </div>
        <div className="grid grid-cols-4 gap-4 mt-1 bg-black/20 p-4 rounded-3xl border border-white/5">
          {/* Service 1 - Tickets */}
          <div 
            onClick={() => {
              setActiveService("tickets");
              setBookingStep("form");
              setSelectedSeat(null);
              setTravelerName("");
            }} 
            className="flex flex-col items-center cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-full border border-emerald-500/20 bg-emerald-950/20 flex items-center justify-center group-active:scale-95 transition-all shadow-sm">
              <Ticket className="w-5 h-5 text-emerald-400 group-hover:text-emerald-300" />
            </div>
            <span className="text-[10px] font-semibold text-center text-foreground/90 mt-1 leading-tight">{tr("Tickets", "টিকিট")}</span>
          </div>

          {/* Service 2 - Recharge Plans */}
          <Link 
            to="/app/bills" 
            search={{ biller: "btrc" } as any}
            className="flex flex-col items-center cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-full border border-emerald-500/20 bg-emerald-950/20 flex items-center justify-center group-active:scale-95 transition-all shadow-sm">
              <Smartphone className="w-5 h-5 text-emerald-400 group-hover:text-emerald-300" />
            </div>
            <span className="text-[10px] font-semibold text-center text-foreground/90 mt-1 leading-tight">{tr("Recharge Plans", "রিচার্জ প্ল্যান")}</span>
          </Link>

          {/* Service 3 - Operators */}
          <div 
            onClick={() => {
              setActiveService("operators");
              setOpStep("list");
              setSelectedPack(null);
            }} 
            className="flex flex-col items-center cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-full border border-emerald-500/20 bg-emerald-950/20 flex items-center justify-center group-active:scale-95 transition-all shadow-sm">
              <Cpu className="w-5 h-5 text-emerald-400 group-hover:text-emerald-300" />
            </div>
            <span className="text-[10px] font-semibold text-center text-foreground/90 mt-1 leading-tight">{tr("Operators", "অপারেটর")}</span>
          </div>

          {/* Service 4 - Insurance */}
          <Link 
            to="/app/bima" 
            className="flex flex-col items-center cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-full border border-emerald-500/20 bg-[#061411]/40 flex items-center justify-center group-active:scale-95 transition-all shadow-sm">
              <Heart className="w-5 h-5 text-emerald-400 group-hover:text-emerald-300" />
            </div>
            <span className="text-[10px] font-semibold text-center text-foreground/90 mt-1 leading-tight">{tr("Insurance", "বিমা")}</span>
          </Link>

          {/* Service 5 - Games */}
          <div 
            onClick={() => {
              setActiveService("games");
              setIsSpinning(false);
              setSpinResult(null);
            }} 
            className="flex flex-col items-center cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-full border border-emerald-500/20 bg-emerald-950/20 flex items-center justify-center group-active:scale-95 transition-all shadow-sm">
              <Gamepad className="w-5 h-5 text-emerald-400 group-hover:text-emerald-300" />
            </div>
            <span className="text-[10px] font-semibold text-center text-foreground/90 mt-1 leading-tight">{tr("Games", "গেমস")}</span>
          </div>

          {/* Service 6 - Subscriptions */}
          <div 
            onClick={() => {
              setActiveService("subscriptions");
              setSubStep("list");
              setSelectedSubscription(null);
            }} 
            className="flex flex-col items-center cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-full border border-emerald-500/20 bg-emerald-950/20 flex items-center justify-center group-active:scale-95 transition-all shadow-sm">
              <Sparkles className="w-5 h-5 text-emerald-400 group-hover:text-emerald-300" />
            </div>
            <span className="text-[10px] font-semibold text-center text-foreground/90 mt-1 leading-tight">{tr("Subscriptions", "সাবস্ক্রিপশন")}</span>
          </div>

          {/* Service 7 - Deen */}
          <div 
            onClick={() => {
              setActiveService("deen");
              setTasbihCount(0);
            }} 
            className="flex flex-col items-center cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-full border border-emerald-500/20 bg-emerald-950/20 flex items-center justify-center group-active:scale-95 transition-all shadow-sm">
              <Moon className="w-5 h-5 text-emerald-400 group-hover:text-emerald-300" />
            </div>
            <span className="text-[10px] font-semibold text-center text-foreground/90 mt-1 leading-tight">{tr("Deen", "দীন")}</span>
          </div>

          {/* Service 8 - Invest Edu */}
          <div 
            onClick={() => {
              setActiveService("investedu");
              setEduStep("article");
              setQuizAnswer(null);
              setQuizChecked(false);
            }} 
            className="flex flex-col items-center cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-full border border-emerald-500/20 bg-emerald-950/20 flex items-center justify-center group-active:scale-95 transition-all shadow-sm">
              <TrendingUp className="w-5 h-5 text-emerald-400 group-hover:text-emerald-300" />
            </div>
            <span className="text-[10px] font-semibold text-center text-foreground/90 mt-1 leading-tight">{tr("Invest Edu", "ইনভেস্ট এডু")}</span>
          </div>
        </div>
      </div>

      {/* CASh-E Bundles Section */}
      <div className="px-5 mt-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold">{tr("CASh-E Bundles", "ক্যাশ-ই বান্ডেল")}</h3>
          <Link to="/app/bundles" className="text-[11px] text-primary flex items-center gap-0.5 hover:underline">
            {tr("View all", "সব দেখুন")} <ChevronRight className="w-3 h-3" />
          </Link>
        </div>
        <div className="flex gap-3 overflow-x-auto no-scrollbar px-5 -mx-5 pb-2">
          {/* Bundle 1 */}
          <Link 
            to="/app/bundles"
            className="flex-shrink-0 w-[240px] rounded-3xl p-4 bg-[#061411]/90 border border-emerald-950 relative overflow-hidden flex flex-col justify-between active:scale-98 transition shadow-card"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center font-bold text-lg text-white">
                  ৳
                </div>
                <div>
                  <div className="text-xs font-bold text-white">{tr("100 Send Money", "১০০ সেন্ড মানি")}</div>
                  <div className="text-[10px] text-muted-foreground">{tr("30 days", "৩০ দিন")}</div>
                </div>
              </div>
              <div className="text-base font-bold text-emerald-400">
                ৳{num("249")}
              </div>
            </div>
            <div className="mt-3 flex">
              <span className="inline-flex items-center gap-1 bg-[#e2ad3e] text-black font-bold text-[9px] px-2 py-0.5 rounded-full shadow-sm">
                % {tr("Save ৳251", "সাশ্রয় ৳২৫১")}
              </span>
            </div>
          </Link>

          {/* Bundle 2 */}
          <Link 
            to="/app/bundles"
            className="flex-shrink-0 w-[240px] rounded-3xl p-4 bg-[#061411]/90 border border-emerald-950 relative overflow-hidden flex flex-col justify-between active:scale-98 transition shadow-card"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center font-bold text-lg text-white">
                  ৳
                </div>
                <div>
                  <div className="text-xs font-bold text-white">{tr("50 Send Money", "৫০ সেন্ড মানি")}</div>
                  <div className="text-[10px] text-muted-foreground">{tr("30 days", "৩০ দিন")}</div>
                </div>
              </div>
              <div className="text-base font-bold text-emerald-400">
                ৳{num("149")}
              </div>
            </div>
            <div className="mt-3 flex">
              <span className="inline-flex items-center gap-1 bg-[#e2ad3e] text-black font-bold text-[9px] px-2 py-0.5 rounded-full shadow-sm">
                % {tr("Save ৳125", "সাশ্রয় ৳১২৫")}
              </span>
            </div>
          </Link>

          {/* Bundle 3 */}
          <Link 
            to="/app/bundles"
            className="flex-shrink-0 w-[240px] rounded-3xl p-4 bg-[#061411]/90 border border-emerald-950 relative overflow-hidden flex flex-col justify-between active:scale-98 transition shadow-card"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center font-bold text-lg text-white">
                  ৳
                </div>
                <div>
                  <div className="text-xs font-bold text-white">{tr("300 Send Money", "৩০০ সেন্ড মানি")}</div>
                  <div className="text-[10px] text-muted-foreground">{tr("30 days", "৩০ দিন")}</div>
                </div>
              </div>
              <div className="text-base font-bold text-emerald-400">
                ৳{num("599")}
              </div>
            </div>
            <div className="mt-3 flex">
              <span className="inline-flex items-center gap-1 bg-[#e2ad3e] text-black font-bold text-[9px] px-2 py-0.5 rounded-full shadow-sm">
                % {tr("Save ৳601", "সাশ্রয় ৳৬০১")}
              </span>
            </div>
          </Link>
        </div>
      </div>

      {/* Sanchay · Eid Fund Section */}
      <div className="px-5 mt-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold">{tr("Sanchay · Eid Fund", "সঞ্চয় · ঈদ ফান্ড")}</h3>
          <Link to="/app/sanchay" className="text-[11px] text-primary flex items-center gap-0.5 hover:underline">
            {tr("View all", "সব দেখুন")} <ChevronRight className="w-3 h-3" />
          </Link>
        </div>
        <Link 
          to="/app/sanchay"
          className="block rounded-3xl p-5 bg-[#061411]/90 border border-emerald-950 relative overflow-hidden active:scale-[0.99] transition shadow-card"
        >
          <div className="flex items-center gap-5">
            {/* Progress Circle */}
            <div className="relative w-14 h-14 flex items-center justify-center shrink-0">
              <svg className="absolute w-full h-full -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-emerald-950/65"
                  stroke="currentColor"
                  strokeWidth="3.2"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-emerald-400"
                  stroke="currentColor"
                  strokeWidth="3.2"
                  strokeDasharray="68, 100"
                  strokeLinecap="round"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <span className="text-[11px] font-bold text-white leading-none">{num("68")}%</span>
            </div>

            {/* Content info */}
            <div className="flex-1 min-w-0">
              <div className="text-base font-bold text-white tracking-tight flex items-baseline gap-1">
                <span>৳ {num("13,600")}</span>
                <span className="text-xs text-muted-foreground font-normal">/ ৳ {num("20,000")}</span>
              </div>
              <div className="text-[10px] text-muted-foreground mt-0.5">
                ৳ {num("320")}/{tr("day", "দিন")} · {num("20")} {tr("days to goal", "দিন বাকি")}
              </div>
              <div className="text-[10px] font-bold text-emerald-400 flex items-center gap-1 mt-1.5">
                <span className="animate-pulse">⚡</span> {tr("Auto-save active", "অটো-সেভ সক্রিয়")}
              </div>
            </div>
            
            <ChevronRight className="w-4 h-4 text-emerald-400 shrink-0" />
          </div>
        </Link>
      </div>

      {/* Recent activity */}
      <div className="px-5 mt-5">
        <h3 className="text-sm font-bold mb-3">{tr("Recent Activity")}</h3>
        <div className="space-y-2">
          {(txs ?? []).slice(0, 5).map((t) => (
            <div key={t.id} className="glass rounded-2xl p-3 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-xs font-bold">
                {(t.counterparty ?? "•").charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-semibold truncate">{t.counterparty ?? t.kind}</div>
                <div className="text-[10px] text-muted-foreground truncate">{t.note ?? t.kind}</div>
              </div>
              <div className="text-right">
                <div className={`text-xs font-bold ${t.amount_cents > 0 ? "text-emerald-400" : ""}`}>
                  {t.amount_cents > 0 ? "+" : ""}{money(t.amount_cents)}
                </div>
                <div className="text-[10px] text-muted-foreground">{new Date(t.created_at).toLocaleDateString(isBn ? "bn-BD" : "en-BD", { day: "numeric", month: "short" })}</div>
              </div>
            </div>
          ))}
          {(txs ?? []).length === 0 && (
            <div className="text-center text-xs text-muted-foreground py-8">{tr("No activity yet")}</div>
          )}
        </div>
      </div>

      <div className="h-6" />

      {/* Interactive Service Overlay Sheets */}
      {activeService && (
        <div className="absolute inset-0 z-50 bg-[#061210] flex flex-col no-scrollbar overflow-y-auto pb-8 animate-in slide-in-from-bottom duration-300">
          {/* Sticky Header */}
          <div className="sticky top-0 bg-[#061210]/95 backdrop-blur-md px-5 py-4 flex items-center justify-between border-b border-white/5 z-10">
            <button 
              onClick={() => setActiveService(null)}
              className="w-9 h-9 rounded-full glass flex items-center justify-center active:scale-95 transition"
            >
              <ChevronLeft className="w-4 h-4 text-emerald-400" />
            </button>
            <h2 className="text-sm font-bold text-white tracking-tight">
              {activeService === "tickets" && tr("Tickets Portal", "টিকিট পোর্টাল")}
              {activeService === "operators" && tr("Operators & Packs", "অপারেটর ও প্যাকেজ")}
              {activeService === "games" && tr("CASh-E Play Zone", "প্লে জোন")}
              {activeService === "subscriptions" && tr("Streaming Hub", "স্ট্রিমিং হাব")}
              {activeService === "deen" && tr("Deen · Islamic Hub", "দ্বীন · ইসলামিক হাব")}
              {activeService === "investedu" && tr("Invest Edu Quiz", "ইনভেস্ট এডু কুইজ")}
            </h2>
            <div className="w-9" /> {/* Spacer */}
          </div>

          {/* Service Content */}
          <div className="p-5 flex-1 flex flex-col">
            {/* 1. TICKETS PORTAL */}
            {activeService === "tickets" && (
              <div className="flex-1 flex flex-col gap-4">
                {bookingStep === "form" ? (
                  <>
                    {/* Travel Type Select */}
                    <div className="grid grid-cols-3 gap-2 bg-black/30 p-1 rounded-2xl border border-white/5">
                      {(["bus", "train", "flight"] as const).map((t) => (
                        <button
                          key={t}
                          onClick={() => {
                            setTicketType(t);
                            setSelectedSeat(null);
                          }}
                          className={`py-2 rounded-xl text-xs font-bold capitalize transition-all ${
                            ticketType === t ? "bg-emerald-500 text-black shadow-md" : "text-muted-foreground hover:text-white"
                          }`}
                        >
                          {tr(t, t === "bus" ? "বাস" : t === "train" ? "ট্রেন" : "ফ্লাইট")}
                        </button>
                      ))}
                    </div>

                    {/* From & To */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[10px] text-muted-foreground uppercase tracking-wider">{tr("From", "কোথা থেকে")}</label>
                        <select 
                          value={fromCity}
                          onChange={(e) => setFromCity(e.target.value)}
                          className="w-full bg-black/40 border border-white/10 rounded-2xl px-3 py-2.5 text-xs text-white outline-none mt-1"
                        >
                          <option value="Dhaka">Dhaka (ঢাকা)</option>
                          <option value="Sylhet">Sylhet (সিলেট)</option>
                          <option value="Chattogram">Chattogram (চট্টগ্রাম)</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[10px] text-muted-foreground uppercase tracking-wider">{tr("To", "কোথায়")}</label>
                        <select 
                          value={toCity}
                          onChange={(e) => setToCity(e.target.value)}
                          className="w-full bg-black/40 border border-white/10 rounded-2xl px-3 py-2.5 text-xs text-white outline-none mt-1"
                        >
                          <option value="Chattogram">Chattogram (চট্টগ্রাম)</option>
                          <option value="Cox's Bazar">Cox's Bazar (কক্সবাজার)</option>
                          <option value="Sylhet">Sylhet (সিলেট)</option>
                          <option value="Rajshahi">Rajshahi (রাজশাহী)</option>
                        </select>
                      </div>
                    </div>

                    {/* Passenger Info */}
                    <div>
                      <label className="text-[10px] text-muted-foreground uppercase tracking-wider">{tr("Traveler Name", "যাত্রীর নাম")}</label>
                      <input 
                        type="text"
                        value={travelerName}
                        onChange={(e) => setTravelerName(e.target.value)}
                        placeholder={tr("Enter traveler name", "যাত্রীর নাম লিখুন")}
                        className="w-full bg-black/40 border border-white/10 rounded-2xl px-4 py-2.5 text-xs text-white outline-none mt-1"
                      />
                    </div>

                    {/* Interactive Seat Selector */}
                    <div>
                      <label className="text-[10px] text-muted-foreground uppercase tracking-wider block mb-2">{tr("Select Seat", "আসন নির্বাচন করুন")}</label>
                      <div className="grid grid-cols-4 gap-2 bg-black/20 p-4 rounded-2xl border border-white/5">
                        {["A1", "A2", "B1", "B2", "C1", "C2", "D1", "D2", "E1", "E2"].map((seat) => {
                          const isOccupied = seat === "A1" || seat === "C2";
                          const isSelected = selectedSeat === seat;
                          return (
                            <button
                              key={seat}
                              disabled={isOccupied}
                              onClick={() => setSelectedSeat(isSelected ? null : seat)}
                              className={`h-9 rounded-lg flex items-center justify-center text-xs font-bold transition-all border ${
                                isOccupied ? "bg-black/40 border-white/5 text-muted-foreground/30 cursor-not-allowed" :
                                isSelected ? "bg-emerald-400 border-emerald-400 text-black shadow-glow" :
                                "bg-emerald-950/20 border-emerald-500/20 text-emerald-400 hover:bg-emerald-950/40"
                              }`}
                            >
                              {seat}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Cost Preview & Buy */}
                    {selectedSeat && (
                      <div className="mt-auto pt-4 border-t border-white/5 space-y-3">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">{tr("Ticket Fee", "টিকিট মূল্য")} ({selectedSeat})</span>
                          <span className="text-white font-bold">
                            ৳{ticketType === "bus" ? num("450") : ticketType === "train" ? num("650") : num("2,500")}
                          </span>
                        </div>
                        <button
                          disabled={payingService || !travelerName.trim()}
                          onClick={() => {
                            const cost = ticketType === "bus" ? 45000 : ticketType === "train" ? 65000 : 250000;
                            payForService(
                              cost,
                              ticketType === "bus" ? "Hanif Travels" : ticketType === "train" ? "Bangladesh Railway" : "Biman Bangladesh",
                              `Ticket ${selectedSeat} (${fromCity} ➔ ${toCity})`,
                              15,
                              () => {
                                setBookedTicket({
                                  id: Math.floor(Math.random() * 900000) + 100000,
                                  type: ticketType,
                                  seat: selectedSeat,
                                  traveler: travelerName,
                                  from: fromCity,
                                  to: toCity,
                                  date: new Date().toLocaleDateString(isBn ? "bn-BD" : "en-US", { weekday: "short", day: "numeric", month: "short" }),
                                  cost,
                                });
                                setBookingStep("success");
                              }
                            );
                          }}
                          className="w-full py-3.5 rounded-2xl bg-emerald-400 text-black font-bold text-xs flex items-center justify-center gap-2 shadow-glow active:scale-98 transition disabled:opacity-50"
                        >
                          {payingService ? tr("Booking...", "বুকিং হচ্ছে...") : tr("Confirm Booking & Pay", "বুকিং সম্পন্ন এবং পেমেন্ট করুন")}
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  // Success Ticket E-Boarding Pass
                  <div className="flex-1 flex flex-col items-center justify-center py-4">
                    <div className="w-full glass-strong rounded-3xl overflow-hidden border border-emerald-500/20 relative shadow-glow">
                      {/* Pink Header Ticket Cut */}
                      <div className="bg-gradient-to-r from-emerald-600 to-emerald-800 p-4 text-center relative">
                        <div className="text-[10px] text-emerald-200 font-bold uppercase tracking-widest">{tr("E-BOARDING PASS", "ই-বোর্ডিং পাস")}</div>
                        <div className="text-sm font-bold text-white mt-1 capitalize">
                          {bookedTicket.type} {tr("Ticket", "টিকিট")}
                        </div>
                        {/* Half-circles on sides */}
                        <div className="absolute -left-3 -bottom-3 w-6 h-6 rounded-full bg-[#061210]" />
                        <div className="absolute -right-3 -bottom-3 w-6 h-6 rounded-full bg-[#061210]" />
                      </div>

                      {/* Ticket Details */}
                      <div className="p-5 space-y-4 bg-black/40 relative">
                        {/* Cut lines */}
                        <div className="absolute -left-3 -top-3 w-6 h-6 rounded-full bg-[#061210]" />
                        <div className="absolute -right-3 -top-3 w-6 h-6 rounded-full bg-[#061210]" />

                        <div className="grid grid-cols-2 gap-4 text-xs">
                          <div>
                            <span className="text-[9px] text-muted-foreground block uppercase">{tr("Traveler", "যাত্রী")}</span>
                            <span className="text-white font-semibold truncate block">{bookedTicket.traveler}</span>
                          </div>
                          <div>
                            <span className="text-[9px] text-muted-foreground block uppercase">{tr("Seat", "আসন")}</span>
                            <span className="text-emerald-400 font-bold">{bookedTicket.seat}</span>
                          </div>
                          <div>
                            <span className="text-[9px] text-muted-foreground block uppercase">{tr("Route", "রুট")}</span>
                            <span className="text-white font-semibold">{bookedTicket.from} ➔ {bookedTicket.to}</span>
                          </div>
                          <div>
                            <span className="text-[9px] text-muted-foreground block uppercase">{tr("Date / Time", "তারিখ / সময়")}</span>
                            <span className="text-white font-semibold">{bookedTicket.date} · 09:00 AM</span>
                          </div>
                        </div>

                        {/* Barcode/QR Simulator */}
                        <div className="pt-4 border-t border-white/5 flex flex-col items-center gap-2">
                          {/* Animated barcode lines */}
                          <div className="w-full h-12 flex items-center justify-between px-4 bg-white/5 rounded-xl border border-white/5">
                            {[1, 2, 4, 1, 3, 2, 4, 2, 1, 3, 4, 2, 1, 4, 2, 3, 1, 4, 2, 1, 3, 4, 1, 2, 3].map((w, idx) => (
                              <div key={idx} className="bg-white/80 h-8" style={{ width: `${w}px` }} />
                            ))}
                          </div>
                          <span className="text-[9px] font-mono tracking-widest text-muted-foreground">CSHE-TKT-{bookedTicket.id}</span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setActiveService(null);
                        setBookingStep("form");
                      }}
                      className="mt-8 px-6 py-2.5 rounded-full border border-emerald-500/30 bg-emerald-950/20 text-emerald-400 text-xs font-bold hover:bg-emerald-950/40 active:scale-95 transition"
                    >
                      {tr("Done · Back to Home", "সম্পন্ন · হোম এ ফিরুন")}
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* 2. OPERATORS PORTAL */}
            {activeService === "operators" && (
              <div className="flex-1 flex flex-col gap-4">
                {opStep === "list" ? (
                  <>
                    {/* Operator Tabs */}
                    <div className="grid grid-cols-4 gap-2">
                      {(["gp", "robi", "bl", "teletalk"] as const).map((op) => (
                        <button
                          key={op}
                          onClick={() => {
                            setSelectedOp(op);
                            setSelectedPack(null);
                          }}
                          className={`py-2 rounded-xl text-xs font-bold uppercase border transition-all ${
                            selectedOp === op
                              ? "bg-emerald-500 border-emerald-500 text-black shadow-md"
                              : "bg-black/30 border-white/5 text-muted-foreground hover:text-white"
                          }`}
                        >
                          {op}
                        </button>
                      ))}
                    </div>

                    {/* Dynamic Roaming Switch */}
                    <div className="glass-strong rounded-2xl p-4 flex items-center justify-between border border-white/5">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${roamingActive ? "bg-emerald-400 shadow-glow animate-pulse" : "bg-muted-foreground/30"}`} />
                        <div>
                          <div className="text-xs font-bold text-white">{tr("International Roaming", "আন্তর্জাতিক রোমিং")}</div>
                          <div className="text-[9px] text-muted-foreground">{tr("Enable active roaming out of BD", "বাংলাদেশের বাইরে রোমিং সক্রিয় করুন")}</div>
                        </div>
                      </div>
                      <button 
                        onClick={() => {
                          setRoamingActive(!roamingActive);
                          toast.success(roamingActive ? tr("Roaming disabled!", "রোমিং নিষ্ক্রিয় করা হয়েছে!") : tr("International Roaming Activated! 🌍", "আন্তর্জাতিক রোমিং সক্রিয় করা হয়েছে! 🌍"));
                        }}
                        className={`w-9 h-5 rounded-full p-0.5 transition-all duration-300 ${roamingActive ? "bg-emerald-500" : "bg-white/10"}`}
                      >
                        <div className={`w-4 h-4 rounded-full bg-black transition-transform duration-300 ${roamingActive ? "translate-x-4" : "translate-x-0"}`} />
                      </button>
                    </div>

                    {/* Package list */}
                    <div className="space-y-3">
                      <label className="text-[10px] text-muted-foreground uppercase tracking-wider block mb-1">
                        {tr("Exclusive Data & Talk Packs", "বিশেষ ইন্টারনেট ও টকটাইম প্যাক")}
                      </label>
                      {[
                        { id: 1, title: "30GB Super Study Pack", price: 149, dur: "30 Days", val: "30 GB" },
                        { id: 2, title: "100 Min Talktime Pack", price: 79, dur: "7 Days", val: "100 Minutes" },
                        { id: 3, title: "60GB Mega Eid Pack", price: 299, dur: "30 Days", val: "60 GB" },
                        { id: 4, title: "1GB Daily Boost Pack", price: 29, dur: "1 Day", val: "1 GB" },
                      ].map((pack) => {
                        const isSelected = selectedPack?.id === pack.id;
                        return (
                          <button
                            key={pack.id}
                            onClick={() => setSelectedPack(pack)}
                            className={`w-full glass-strong rounded-2xl p-4 text-left border flex items-center justify-between transition-all ${
                              isSelected ? "border-emerald-400 ring-1 ring-emerald-400 bg-emerald-950/10" : "border-white/5 bg-black/20 hover:bg-black/30"
                            }`}
                          >
                            <div>
                              <div className="text-xs font-bold text-white">{tr(pack.title)}</div>
                              <div className="text-[10px] text-muted-foreground mt-0.5">{tr(pack.dur)} · {tr(pack.val)}</div>
                            </div>
                            <div className="text-sm font-bold text-emerald-400">
                              ৳{num(String(pack.price))}
                            </div>
                          </button>
                        );
                      })}
                    </div>

                    {/* Buy operators pack */}
                    {selectedPack && (
                      <div className="mt-auto pt-4 border-t border-white/5">
                        <button
                          disabled={payingService}
                          onClick={() => {
                            payForService(
                              selectedPack.price * 100,
                              selectedOp.toUpperCase() + " Telecom",
                              `${selectedPack.title} Active Activation`,
                              12,
                              () => {
                                setOpStep("success");
                              }
                            );
                          }}
                          className="w-full py-3.5 rounded-2xl bg-emerald-400 text-black font-bold text-xs flex items-center justify-center gap-2 shadow-glow active:scale-98 transition disabled:opacity-50"
                        >
                          {payingService ? tr("Processing...", "প্রসেসিং হচ্ছে...") : `${tr("Activate Pack for", "প্যাকটি সক্রিয় করুন")} ৳${num(String(selectedPack.price))}`}
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  // Success pack activated
                  <div className="flex-1 flex flex-col items-center justify-center py-4 text-center">
                    <div className="w-16 h-16 rounded-full bg-emerald-950/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-glow mb-4 animate-bounce">
                      <Check className="w-8 h-8" />
                    </div>
                    <h3 className="text-base font-bold text-white">{tr("Package Activated! 🎉", "প্যাকেজ সক্রিয় হয়েছে! 🎉")}</h3>
                    <p className="text-xs text-muted-foreground mt-2 max-w-[250px]">
                      {tr(selectedPack.title)} {tr("has been successfully activated on your", "আপনার")} <span className="uppercase text-emerald-400 font-bold">{selectedOp}</span> {tr("sim profile.", "সিম প্রোফাইলে সক্রিয় করা হয়েছে।")}
                    </p>
                    <div className="mt-6 glass rounded-2xl p-4 text-xs space-y-2 w-full max-w-[280px] text-left border border-white/5">
                      <div className="flex justify-between"><span className="text-muted-foreground">{tr("Price", "মূল্য")}</span><span className="text-white font-bold">৳{num(String(selectedPack.price))}</span></div>
                      <div className="flex justify-between"><span className="text-muted-foreground">{tr("Validity", "মেয়াদ")}</span><span className="text-white font-bold">{tr(selectedPack.dur)}</span></div>
                      <div className="flex justify-between"><span className="text-muted-foreground">{tr("Benefit", "সুবিধা")}</span><span className="text-white font-bold">{tr(selectedPack.val)}</span></div>
                      <div className="flex justify-between"><span className="text-muted-foreground">{tr("Reward", "পুরস্কার")}</span><span className="text-gold font-bold">+12 XP</span></div>
                    </div>
                    <button
                      onClick={() => {
                        setActiveService(null);
                        setOpStep("list");
                      }}
                      className="mt-8 px-6 py-2.5 rounded-full border border-emerald-500/30 bg-emerald-950/20 text-emerald-400 text-xs font-bold hover:bg-emerald-950/40 active:scale-95 transition"
                    >
                      {tr("Done · Back to Home", "সম্পন্ন · হোম এ ফিরুন")}
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* 3. SPIN THE WHEEL GAME */}
            {activeService === "games" && (
              <div className="flex-1 flex flex-col items-center justify-center gap-6">
                <div className="text-center">
                  <h3 className="text-base font-bold text-white">{tr("CASh-E Spin & Win!", "ক্যাশ-ই স্পিন ও উইন!")}</h3>
                  <p className="text-[11px] text-muted-foreground mt-1 max-w-[260px]">
                    {tr("Spin the wheel for ৳10 to win massive Cashbacks or XP boosts instantly!", "৳১০ ফি দিয়ে চাকা ঘুরিয়ে জিতে নিন আকর্ষনীয় ক্যাশব্যাক অথবা এক্সপি বোনাস!")}
                  </p>
                </div>

                {/* Spinning Wheel */}
                <div className="relative w-64 h-64 flex items-center justify-center">
                  {/* Outer glowing border */}
                  <div className="absolute inset-0 rounded-full border-4 border-gold/30 shadow-glow animate-pulse" />
                  {/* Pointer arrow */}
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-gold rotate-45 rounded-tl-md z-20 border-t border-l border-white/20 shadow-md" />
                  
                  {/* Wheel container */}
                  <svg 
                    className="w-full h-full rounded-full transition-transform duration-[4000ms] ease-[cubic-bezier(0.1,0.8,0.2,1)]"
                    style={{ transform: `rotate(${spinAngle}deg)` }}
                    viewBox="0 0 100 100"
                  >
                    {/* Wedges */}
                    {[
                      { prize: "৳10", col: "#e91e63", rot: 0 },
                      { prize: "20 XP", col: "#9c27b0", rot: 60 },
                      { prize: "৳5", col: "#ff9800", rot: 120 },
                      { prize: "50 XP", col: "#3f51b5", rot: 180 },
                      { prize: "Try Again", col: "#607d8b", rot: 240 },
                      { prize: "100 XP", col: "#009688", rot: 300 },
                    ].map((w, i) => (
                      <g key={i} transform={`rotate(${w.rot} 50 50)`}>
                        <path d="M50,50 L50,0 A50,50 0 0,1 93.3,25 Z" fill={w.col} opacity={0.8} stroke="#071311" strokeWidth="0.5" />
                        <text 
                          x="70" 
                          y="30" 
                          fill="white" 
                          fontSize="4" 
                          fontWeight="bold" 
                          transform="rotate(30 70 30)" 
                          textAnchor="middle"
                        >
                          {w.prize}
                        </text>
                      </g>
                    ))}
                  </svg>

                  {/* Golden Center cap */}
                  <div className="absolute w-12 h-12 rounded-full bg-gold border-2 border-white/40 shadow-glow flex items-center justify-center text-black font-extrabold text-[10px] z-10 select-none">
                    C-E
                  </div>
                </div>

                {/* Spin CTA */}
                <div className="w-full max-w-[280px] space-y-4">
                  {spinResult ? (
                    <div className="text-center p-4 glass-strong rounded-2xl border border-gold/30 animate-in zoom-in-95 duration-200">
                      <div className="text-[10px] text-gold font-bold uppercase tracking-widest">{tr("CONGRATULATIONS!", "অভিনন্দন!")}</div>
                      <div className="text-lg font-black text-white mt-1">
                        {spinResult === "Try Again" ? tr("Try Again!", "আবার চেষ্টা করুন!") : `${tr("You Won", "আপনি জিতেছেন")} ${spinResult}!`}
                      </div>
                      <button
                        onClick={() => {
                          setSpinResult(null);
                          setSpinAngle(0);
                        }}
                        className="mt-3 px-4 py-1.5 rounded-full bg-gold text-black text-[10px] font-bold active:scale-95 transition"
                      >
                        {tr("Spin Again", "আবার খেলুন")}
                      </button>
                    </div>
                  ) : (
                    <button
                      disabled={isSpinning}
                      onClick={async () => {
                        if ((p?.balance_cents ?? 0) < 1000) {
                          toast.error(tr("You need at least ৳10 to spin!", "খেলার জন্য আপনার কমপক্ষে ৳১০ প্রয়োজন!"));
                          return;
                        }
                        setIsSpinning(true);
                        
                        // Deduct 10 Taka entry fee
                        const { error } = await supabase.rpc("debit_wallet", {
                          p_kind: "bill",
                          p_amount_cents: 1000,
                          p_counterparty: "CASh-E Play Zone",
                          p_note: "Spin Wheel Entry Fee",
                          p_meta: { game: "spin_wheel" } as any,
                          p_award_xp: 5,
                        });
                        if (error) {
                          toast.error(error.message);
                          setIsSpinning(false);
                          return;
                        }

                        // Spin calculation
                        const randomSector = Math.floor(Math.random() * 6);
                        const wedgeAngle = 60;
                        const targetAngle = 1800 + (360 - (randomSector * wedgeAngle) - 30);
                        
                        setSpinAngle(targetAngle);

                        setTimeout(async () => {
                          setIsSpinning(false);
                          const sectorPrizes = ["৳10", "20 XP", "৳5", "50 XP", "Try Again", "100 XP"];
                          const prize = sectorPrizes[randomSector];
                          setSpinResult(prize);

                          // Credit prize
                          if (prize === "৳10") {
                            await creditWinnings(1000, "10 Taka Cashback");
                            toast.success(tr("৳10 Cashback added to wallet! 💰", "৳১০ ক্যাশব্যাক ওয়ালেটে যোগ হয়েছে! 💰"));
                          } else if (prize === "৳5") {
                            await creditWinnings(500, "5 Taka Cashback");
                            toast.success(tr("৳5 Cashback added to wallet! 💰", "৳৫ ক্যাশব্যাক ওয়ালেটে যোগ হয়েছে! 💰"));
                          } else if (prize === "20 XP") {
                            // Deduct ৳0 but award 20 XP
                            await supabase.rpc("debit_wallet", {
                              p_kind: "bill",
                              p_amount_cents: 0,
                              p_counterparty: "CASh-E Play Zone",
                              p_note: "Spin Wheel XP Reward",
                              p_meta: { game: "spin_wheel" } as any,
                              p_award_xp: 20,
                            });
                            toast.success(tr("+20 XP Boost Rewarded! ⚡", "+২০ এক্সপি বুস্ট যোগ হয়েছে! ⚡"));
                          } else if (prize === "50 XP") {
                            await supabase.rpc("debit_wallet", {
                              p_kind: "bill",
                              p_amount_cents: 0,
                              p_counterparty: "CASh-E Play Zone",
                              p_note: "Spin Wheel XP Reward",
                              p_meta: { game: "spin_wheel" } as any,
                              p_award_xp: 50,
                            });
                            toast.success(tr("+50 XP Boost Rewarded! ⚡", "+৫০ এক্সপি বুস্ট যোগ হয়েছে! ⚡"));
                          } else if (prize === "100 XP") {
                            await supabase.rpc("debit_wallet", {
                              p_kind: "bill",
                              p_amount_cents: 0,
                              p_counterparty: "CASh-E Play Zone",
                              p_note: "Spin Wheel XP Reward",
                              p_meta: { game: "spin_wheel" } as any,
                              p_award_xp: 100,
                            });
                            toast.success(tr("+100 XP Jackpot Rewarded! 🏆", "+১০০ এক্সপি জ্যাকপট যোগ হয়েছে! 🏆"));
                          }

                          qc.invalidateQueries({ queryKey: ["profile"] });
                          qc.invalidateQueries({ queryKey: ["transactions"] });
                        }, 4000);
                      }}
                      className="w-full py-3.5 rounded-2xl bg-gold text-black font-extrabold text-xs shadow-glow active:scale-98 transition flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {isSpinning ? tr("Spinning Wheel...", "চাকা ঘুরছে...") : `${tr("Spin & Win (Entry ৳10)", "স্পিন করুন ও জিতুন (ফি ৳১০)")}`}
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* 4. STREAMING SUBSCRIPTIONS */}
            {activeService === "subscriptions" && (
              <div className="flex-1 flex flex-col gap-4">
                {subStep === "list" ? (
                  <>
                    <div className="text-center mb-2">
                      <p className="text-xs text-muted-foreground">
                        {tr("Subscribe to premium streaming services instantly with your wallet balance.", "ওয়ালেট ব্যালেন্সের মাধ্যমে তাত্ক্ষণিকভাবে প্রিমিয়াম স্ট্রিমিং সার্ভিস সাবস্ক্রাইব করুন।")}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { id: "netflix", name: "Netflix Premium", price: 399, col: "from-[#e50914]/20 to-black border-red-600/30" },
                        { id: "spotify", name: "Spotify Premium", price: 129, col: "from-[#1DB954]/20 to-black border-green-600/30" },
                        { id: "chorki", name: "Chorki Pro BD", price: 149, col: "from-[#ff6d00]/20 to-black border-orange-600/30" },
                        { id: "hoichoi", name: "Hoichoi TV", price: 199, col: "from-[#ff2d55]/20 to-black border-pink-600/30" },
                      ].map((sub) => {
                        const isSelected = selectedSubscription?.id === sub.id;
                        return (
                          <button
                            key={sub.id}
                            onClick={() => setSelectedSubscription(sub)}
                            className={`rounded-2xl p-4 bg-gradient-to-b ${sub.col} border text-left flex flex-col justify-between h-28 transition-all ${
                              isSelected ? "ring-2 ring-emerald-400" : "opacity-85 hover:opacity-100"
                            }`}
                          >
                            <span className="text-xs font-bold text-white block">{sub.name}</span>
                            <div className="mt-auto">
                              <span className="text-[9px] text-muted-foreground block">{tr("Monthly Plan", "মাসিক প্যাক")}</span>
                              <span className="text-sm font-bold text-white">৳{num(String(sub.price))}/{tr("mo", "মাস")}</span>
                            </div>
                          </button>
                        );
                      })}
                    </div>

                    {selectedSubscription && (
                      <div className="mt-auto pt-4 border-t border-white/5">
                        <button
                          disabled={payingService}
                          onClick={() => {
                            payForService(
                              selectedSubscription.price * 100,
                              selectedSubscription.name,
                              `${selectedSubscription.name} Subscription`,
                              20,
                              () => {
                                setSubStep("success");
                              }
                            );
                          }}
                          className="w-full py-3.5 rounded-2xl bg-emerald-400 text-black font-bold text-xs shadow-glow active:scale-98 transition disabled:opacity-50"
                        >
                          {payingService ? tr("Processing...", "প্রসেসিং...") : `${tr("Activate Subscription for", "সাবস্ক্রিপশন চালু করুন")} ৳${num(String(selectedSubscription.price))}`}
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  // Success subscription
                  <div className="flex-1 flex flex-col items-center justify-center py-4 text-center">
                    <div className="w-16 h-16 rounded-full bg-emerald-950/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-glow mb-4 animate-bounce">
                      <Check className="w-8 h-8" />
                    </div>
                    <h3 className="text-base font-bold text-white">{tr("Subscription Activated! 🎬", "সাবস্ক্রিপশন সক্রিয় হয়েছে! 🎬")}</h3>
                    <p className="text-xs text-muted-foreground mt-2 max-w-[250px]">
                      {tr("Your premium subscription to", "আপনার")} <span className="text-emerald-400 font-bold">{selectedSubscription.name}</span> {tr("is now active. Your credentials and receipt have been messaged to you.", "প্রিমিয়াম প্ল্যান সক্রিয় হয়েছে। বিবরণ আপনার মেসেজে পাঠানো হয়েছে।")}
                    </p>
                    <button
                      onClick={() => {
                        setActiveService(null);
                        setSubStep("list");
                      }}
                      className="mt-8 px-6 py-2.5 rounded-full border border-emerald-500/30 bg-emerald-950/20 text-emerald-400 text-xs font-bold hover:bg-emerald-950/40 active:scale-95 transition"
                    >
                      {tr("Done · Back to Home", "সম্পন্ন · হোম এ ফিরুন")}
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* 5. DEEN · ISLAMIC HUB */}
            {activeService === "deen" && (
              <div className="flex-1 flex flex-col gap-5">
                {/* Prayer Times Widget */}
                <div className="glass-strong rounded-3xl p-4 border border-white/5">
                  <div className="text-[10px] text-muted-foreground uppercase tracking-wider block mb-2">{tr("Dhaka Prayer Timings", "ঢাকা নামাজের সময়সূচী")}</div>
                  <div className="space-y-2">
                    {[
                      { name: "Fajr (ফজর)", time: "4:10 AM" },
                      { name: "Dhuhr (যোহর)", time: "12:05 PM", next: true },
                      { name: "Asr (আসর)", time: "4:35 PM" },
                      { name: "Maghrib (মাগরিব)", time: "6:40 PM" },
                      { name: "Isha (এশা)", time: "8:05 PM" },
                    ].map((pTime) => (
                      <div 
                        key={pTime.name} 
                        className={`flex items-center justify-between p-2 rounded-xl text-xs ${
                          pTime.next ? "bg-emerald-500/10 border border-emerald-500/20" : ""
                        }`}
                      >
                        <span className={pTime.next ? "text-emerald-400 font-bold" : "text-muted-foreground"}>{pTime.name}</span>
                        <div className="flex items-center gap-1.5">
                          {pTime.next && <span className="text-[8px] bg-emerald-500 text-black px-1.5 py-0.5 rounded-full font-bold uppercase">{tr("Next", "পরবর্তী")}</span>}
                          <span className={pTime.next ? "text-emerald-400 font-bold" : "text-white"}>{pTime.time}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Digital Tasbih clicker */}
                <div className="glass-strong rounded-3xl p-5 border border-white/5 flex flex-col items-center gap-3">
                  <span className="text-xs font-bold text-white uppercase tracking-wider">
                    {tasbihCount < 33 ? tr("Subhan Allah (সোবহান আল্লাহ)", "সোবহান আল্লাহ") :
                     tasbihCount < 66 ? tr("Alhamdulillah (আলহামদুলিল্লাহ)", "আলহামদুলিল্লাহ") :
                     tr("Allahu Akbar (আল্লাহু আকবার)", "আল্লাহু আকবার")}
                  </span>
                  
                  {/* Digital Counter Indicator */}
                  <div className="text-4xl font-black text-emerald-400 font-mono my-1 select-none">
                    {tasbihCount % 33} <span className="text-xs text-muted-foreground font-normal">/ 33</span>
                  </div>
                  <div className="text-[10px] text-muted-foreground">Total Cycle count: {tasbihCount}</div>

                  {/* Tap Button */}
                  <button
                    onClick={() => {
                      setTasbihCount(tasbihCount + 1);
                      if ((tasbihCount + 1) % 33 === 0) {
                        toast.success(tr("Subhanallah cycle complete! 🎉", "একটি সাইকেল সম্পন্ন হয়েছে! 🎉"));
                      }
                    }}
                    className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-700 text-black font-extrabold flex items-center justify-center shadow-glow active:scale-95 transition-all text-xs uppercase"
                  >
                    {tr("TAP", "ট্যাপ")}
                  </button>

                  <button
                    onClick={() => setTasbihCount(0)}
                    className="text-[9px] text-muted-foreground hover:text-white hover:underline mt-1"
                  >
                    {tr("Reset Counter", "পুনরায় শুরু")}
                  </button>
                </div>

                {/* Qibla Direction rotated indicator */}
                <div className="glass-strong rounded-3xl p-4 border border-white/5 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-emerald-950/20 flex items-center justify-center shrink-0">
                    <svg className="w-8 h-8 text-gold animate-pulse" viewBox="0 0 24 24" style={{ transform: "rotate(263deg)" }}>
                      <path fill="currentColor" d="M12,2L4.5,20.29L5.21,21L12,18L18.79,21L19.5,20.29L12,2Z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">{tr("Qibla Finder Compass", "কিবলা কম্পাস")}</div>
                    <div className="text-[9px] text-muted-foreground">{tr("Pointing directly to Kaaba (263° West in Dhaka)", "কাবা ঘরের দিক নির্দেশক (ঢাকা থেকে ২৬৩° পশ্চিম)")}</div>
                  </div>
                </div>
              </div>
            )}

            {/* 6. INVEST EDU QUIZ */}
            {activeService === "investedu" && (
              <div className="flex-1 flex flex-col gap-4">
                {eduStep === "article" ? (
                  <>
                    {/* Course overview */}
                    <div className="glass-strong rounded-3xl p-5 border border-white/5 space-y-3">
                      <div className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[9px] font-bold uppercase tracking-wider inline-block">
                        {tr("Micro-savings 101", "সঞ্চয় শিক্ষা ১০১")}
                      </div>
                      <h3 className="text-base font-bold text-white">{tr("Why Compound Savings Matters?", "চক্রবৃদ্ধি সঞ্চয় কেন গুরুত্বপূর্ণ?")}</h3>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {tr("Micro-savings allow you to save small amounts daily (like ৳320/day) which accumulate and earn profit-sharing returns over time. In Halal finance, profit is shared through cooperative ventures (Mudarabah), rather than static interest (Riba). This allows sustainable compound wealth generation without violating ethics.", 
                           "মাইক্রো-সেভিংস এর মাধ্যমে আপনি প্রতিদিন ছোট ছোট অংক সঞ্চয় করতে পারেন যা পরবর্তীতে মুনাফা অর্জনে সাহায্য করে। হালাল অর্থায়নে, মুনাফা অংশীদারিত্বের (মুদারাবাহ) মাধ্যমে অর্জিত হয়, যা আপনার সঞ্চিত অর্থকে শরিয়াহ সম্মত উপায়ে চক্রবৃদ্ধি হারে বৃদ্ধি করতে সক্ষম করে।")}
                      </p>
                    </div>

                    <button
                      onClick={() => setEduStep("quiz")}
                      className="w-full mt-auto py-3.5 rounded-2xl bg-emerald-400 text-black font-bold text-xs flex items-center justify-center gap-2 shadow-glow active:scale-98 transition"
                    >
                      <Play className="w-4 h-4 text-black" fill="currentColor" /> {tr("Start 3-Min Quiz (+15 XP)", "কুইজ শুরু করুন (+১৫ এক্সপি)")}
                    </button>
                  </>
                ) : eduStep === "quiz" ? (
                  <>
                    {/* Quiz Question */}
                    <div className="glass-strong rounded-3xl p-5 border border-white/5 space-y-4">
                      <span className="text-[10px] text-muted-foreground uppercase tracking-widest">{tr("QUESTION 1 OF 1", "প্রশ্ন ১/১")}</span>
                      <h4 className="text-xs font-bold text-white leading-relaxed">
                        {tr("What is the key principle of Halal Micro-savings compound growth?", "হালাল মাইক্রো-সেভিংসের চক্রবৃদ্ধি বৃদ্ধির মূল নীতিটি কী?")}
                      </h4>

                      <div className="space-y-2">
                        {[
                          { id: 1, text: tr("Static interest rates backed by central banking bonds", "কেন্দ্রীয় ব্যাংকিং বন্ড দ্বারা নিশ্চিত নির্দিষ্ট সুদের হার") },
                          { id: 2, text: tr("Halal Profit and Loss Sharing (Mudarabah) yields", "হালাল লাভ ও লোকসান অংশীদারিত্ব (মুদারাবাহ) লভ্যাংশ"), correct: true },
                          { id: 3, text: tr("Short-selling equity shares in high volatility startups", "ঝুঁকিপূর্ণ স্টার্টআপে ইকুইটি শেয়ার শর্ট-সেল করা") },
                        ].map((ans) => {
                          const isSelected = quizAnswer === ans.id;
                          return (
                            <button
                              key={ans.id}
                              onClick={() => {
                                if (!quizChecked) setQuizAnswer(ans.id);
                              }}
                              className={`w-full p-4 rounded-2xl border text-left text-xs transition-all ${
                                quizChecked && ans.correct ? "bg-emerald-500/20 border-emerald-500 text-emerald-400 font-semibold" :
                                quizChecked && isSelected && !ans.correct ? "bg-red-500/20 border-red-500 text-red-400" :
                                isSelected ? "bg-emerald-950/30 border-emerald-400 text-white" :
                                "bg-black/20 border-white/5 text-muted-foreground hover:text-white"
                              }`}
                            >
                              {ans.text}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="mt-auto pt-4">
                      {!quizChecked ? (
                        <button
                          disabled={quizAnswer === null}
                          onClick={() => {
                            setQuizChecked(true);
                            if (quizAnswer === 2) {
                              toast.success(tr("Correct Answer! 🎉 +15 XP", "সঠিক উত্তর! 🎉 +১৫ এক্সপি"));
                              // Reward XP via debit_wallet
                              supabase.rpc("debit_wallet", {
                                p_kind: "bill",
                                p_amount_cents: 0,
                                p_counterparty: "Invest Edu Academy",
                                p_note: "Quiz Complete XP Reward",
                                p_meta: { academy: "micro_savings_101" } as any,
                                p_award_xp: 15,
                              }).then(() => {
                                qc.invalidateQueries({ queryKey: ["profile"] });
                              });
                            } else {
                              toast.error(tr("Wrong Answer! Try again.", "ভুল উত্তর! আবার চেষ্টা করুন।"));
                            }
                          }}
                          className="w-full py-3.5 rounded-2xl bg-emerald-400 text-black font-bold text-xs shadow-glow active:scale-98 transition disabled:opacity-50"
                        >
                          {tr("Submit Answer", "উত্তর জমা দিন")}
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            if (quizAnswer === 2) {
                              setEduStep("success");
                            } else {
                              setQuizAnswer(null);
                              setQuizChecked(false);
                              setEduStep("article");
                            }
                          }}
                          className="w-full py-3.5 rounded-2xl bg-emerald-400 text-black font-bold text-xs shadow-glow active:scale-98 transition"
                        >
                          {quizAnswer === 2 ? tr("Claim Reward & Finish", "পুরস্কার সংগ্রহ করে শেষ করুন") : tr("Back to Lesson & Retry", "পুনরায় চেষ্টা করুন")}
                        </button>
                      )}
                    </div>
                  </>
                ) : (
                  // Success Edu Complete
                  <div className="flex-1 flex flex-col items-center justify-center py-4 text-center">
                    <div className="w-16 h-16 rounded-full bg-emerald-950/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-glow mb-4 animate-bounce">
                      <Trophy className="w-8 h-8 text-gold" />
                    </div>
                    <h3 className="text-base font-bold text-white">{tr("Topic Mastered! 🎓", "বিষয়টি আয়ত্ত হয়েছে! 🎓")}</h3>
                    <p className="text-xs text-muted-foreground mt-2 max-w-[250px]">
                      {tr("Congratulations! You completed the Micro-savings course and scored 100% on the quiz. +15 XP has been added to your profile.", "অভিনন্দন! আপনি মাইক্রো-সেভিংস কোর্সটি সম্পন্ন করেছেন এবং কুইজে ১০০% স্কোর করেছেন। আপনার প্রোফাইলে +১৫ এক্সপি যোগ করা হয়েছে।")}
                    </p>
                    <button
                      onClick={() => {
                        setActiveService(null);
                        setEduStep("article");
                      }}
                      className="mt-8 px-6 py-2.5 rounded-full border border-emerald-500/30 bg-emerald-950/20 text-emerald-400 text-xs font-bold hover:bg-emerald-950/40 active:scale-95 transition"
                    >
                      {tr("Done · Back to Home", "সম্পন্ন · হোম এ ফিরুন")}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
