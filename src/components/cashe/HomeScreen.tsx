import { StatusBar } from "./StatusBar";
import { BottomNav } from "./BottomNav";
import {
  Bell, Eye, Send, QrCode, Receipt, Plus, Sparkles, TrendingUp,
  Wheat, GraduationCap, Bike, ShieldPlus, Store, Mail,
  Train, Stethoscope, Zap, Gift, ChevronRight, Mic,
} from "lucide-react";

const quickActions = [
  { Icon: Send, label: "Send", color: "from-primary to-accent" },
  { Icon: QrCode, label: "Scan QR", color: "from-gold to-yellow-500" },
  { Icon: Receipt, label: "Pay Bill", color: "from-blue-400 to-blue-600" },
  { Icon: Plus, label: "Cash In", color: "from-pink-400 to-rose-600" },
];

const ecosystem = [
  { Icon: TrendingUp, label: "Sanchay", sub: "Savings", color: "bg-primary/20 text-primary" },
  { Icon: Wheat, label: "Khamar", sub: "Agri", color: "bg-amber-500/20 text-amber-400" },
  { Icon: GraduationCap, label: "Student", sub: "Mode", color: "bg-blue-500/20 text-blue-400" },
  { Icon: Bike, label: "Gig Wallet", sub: "Payouts", color: "bg-rose-500/20 text-rose-400" },
  { Icon: ShieldPlus, label: "Bima", sub: "Insurance", color: "bg-emerald-500/20 text-emerald-400" },
  { Icon: Store, label: "Bazaar", sub: "Shop", color: "bg-fuchsia-500/20 text-fuchsia-400" },
  { Icon: Mail, label: "PostPay", sub: "Doot", color: "bg-gold/20 text-gold" },
  { Icon: Sparkles, label: "AI", sub: "Assist", color: "bg-violet-500/20 text-violet-400" },
];

const miniApps = [
  { Icon: Train, label: "Train" },
  { Icon: Stethoscope, label: "Doctor" },
  { Icon: Zap, label: "Bidyut" },
  { Icon: Gift, label: "Zakat" },
];

const transactions = [
  { name: "Rahim Uddin", note: "Tuition fee", amount: "-৳ 2,400", time: "Today, 10:42", color: "bg-blue-500/20" },
  { name: "Khulna Bazaar", note: "Groceries · Cashback ৳12", amount: "-৳ 845", time: "Today, 09:15", color: "bg-emerald-500/20" },
  { name: "Gig Payout", note: "Pathao · 14 trips", amount: "+৳ 1,260", time: "Yesterday", color: "bg-rose-500/20" },
];

export function HomeScreen() {
  return (
    <div className="relative h-full flex flex-col gradient-hero">
      <StatusBar />

      {/* Header */}
      <div className="px-5 pt-2 pb-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-sm font-bold border-2 border-gold/40">
            AR
          </div>
          <div>
            <div className="text-[11px] text-muted-foreground">Assalamu Alaikum</div>
            <div className="text-sm font-semibold">Ayesha Rahman · <span className="text-gold">Student</span></div>
          </div>
        </div>
        <button className="relative w-10 h-10 rounded-full glass flex items-center justify-center">
          <Bell className="w-4 h-4" />
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-destructive" />
        </button>
      </div>

      {/* Balance card */}
      <div className="px-5">
        <div className="relative rounded-3xl gradient-card p-5 overflow-hidden shadow-glow">
          <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-gold/30 blur-3xl" />
          <div className="absolute -left-6 -bottom-6 w-32 h-32 rounded-full bg-primary/40 blur-2xl" />
          <div className="relative flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 text-[11px] text-foreground/70">
                Available Balance <Eye className="w-3 h-3" />
              </div>
              <div className="text-3xl font-bold mt-1 tracking-tight">৳ 24,580<span className="text-base text-foreground/60">.50</span></div>
              <div className="text-[11px] text-foreground/60 bangla mt-0.5">চব্বিশ হাজার পাঁচশত আশি টাকা</div>
            </div>
            <div className="text-right">
              <div className="px-2.5 py-1 rounded-full bg-gold/20 border border-gold/30 text-gold text-[10px] font-semibold">GOLD TIER</div>
              <div className="text-[11px] mt-2 text-foreground/70">Points</div>
              <div className="text-sm font-bold text-gold">1,240 ⭐</div>
            </div>
          </div>
          <div className="relative mt-4 grid grid-cols-4 gap-2">
            {quickActions.map(({ Icon, label, color }) => (
              <button key={label} className="flex flex-col items-center gap-1.5 group">
                <div className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center shadow-lg group-active:scale-95 transition`}>
                  <Icon className="w-4 h-4 text-white" strokeWidth={2.2} />
                </div>
                <span className="text-[10px] font-medium text-foreground/85">{label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* AI banner */}
      <div className="px-5 mt-4">
        <div className="glass-strong rounded-2xl p-3.5 flex items-center gap-3 relative overflow-hidden">
          <div className="absolute -right-6 -top-6 w-24 h-24 rounded-full bg-violet-500/20 blur-2xl" />
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center shrink-0">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[11px] text-violet-300 font-semibold">CASh-E AI · Bangla</div>
            <div className="text-xs text-foreground/85 truncate">"You can save ৳800 this month for Eid Fund 🌙"</div>
          </div>
          <button className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center">
            <Mic className="w-4 h-4 text-violet-300" />
          </button>
        </div>
      </div>

      {/* Ecosystem grid */}
      <div className="px-5 mt-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold">CASh-E Ecosystem</h3>
          <button className="text-[11px] text-primary flex items-center gap-0.5">All <ChevronRight className="w-3 h-3" /></button>
        </div>
        <div className="grid grid-cols-4 gap-3">
          {ecosystem.map(({ Icon, label, sub, color }) => (
            <button key={label} className="flex flex-col items-center gap-1.5 glass rounded-2xl py-3 px-1">
              <div className={`w-9 h-9 rounded-xl ${color} flex items-center justify-center`}>
                <Icon className="w-4 h-4" strokeWidth={2.2} />
              </div>
              <div className="text-center leading-tight">
                <div className="text-[10px] font-semibold">{label}</div>
                <div className="text-[9px] text-muted-foreground">{sub}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Savings goal preview */}
      <div className="px-5 mt-5">
        <div className="rounded-2xl p-4 bg-gradient-to-br from-emerald-900/40 to-emerald-700/20 border border-emerald-500/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 text-3xl opacity-30">🌙</div>
          <div className="text-[11px] font-semibold text-emerald-300">EID SAVINGS · SANCHAY</div>
          <div className="text-base font-bold mt-1">৳ 8,400 <span className="text-xs text-muted-foreground">of ৳ 15,000</span></div>
          <div className="mt-2 h-2 rounded-full bg-white/10 overflow-hidden">
            <div className="h-full w-[56%] gradient-gold rounded-full" />
          </div>
          <div className="text-[10px] text-muted-foreground mt-1.5">56% · 42 days to Eid 🌙</div>
        </div>
      </div>

      {/* Mini apps */}
      <div className="px-5 mt-5">
        <h3 className="text-sm font-bold mb-3">Mini Apps</h3>
        <div className="grid grid-cols-4 gap-3">
          {miniApps.map(({ Icon, label }) => (
            <div key={label} className="flex flex-col items-center gap-1.5">
              <div className="w-11 h-11 rounded-2xl glass flex items-center justify-center">
                <Icon className="w-4 h-4 text-foreground/80" />
              </div>
              <span className="text-[10px] text-foreground/70">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent transactions */}
      <div className="px-5 mt-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold">Recent Activity</h3>
          <button className="text-[11px] text-primary">View all</button>
        </div>
        <div className="space-y-2">
          {transactions.map((t) => (
            <div key={t.name} className="glass rounded-2xl p-3 flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl ${t.color} flex items-center justify-center text-xs font-bold`}>
                {t.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-semibold truncate">{t.name}</div>
                <div className="text-[10px] text-muted-foreground truncate">{t.note}</div>
              </div>
              <div className="text-right">
                <div className={`text-xs font-bold ${t.amount.startsWith("+") ? "text-primary" : ""}`}>{t.amount}</div>
                <div className="text-[10px] text-muted-foreground">{t.time}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="h-4" />
      <BottomNav active="home" />
    </div>
  );
}
