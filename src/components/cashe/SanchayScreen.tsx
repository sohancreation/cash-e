import { StatusBar } from "./StatusBar";
import { BottomNav } from "./BottomNav";
import { ChevronLeft, Plus, Target } from "lucide-react";

const goals = [
  { emoji: "🌙", name: "Eid Savings", saved: 8400, target: 15000, color: "from-emerald-500 to-emerald-700", days: 42 },
  { emoji: "🎓", name: "Education Fund", saved: 24500, target: 60000, color: "from-blue-500 to-indigo-700", days: 180 },
  { emoji: "🚨", name: "Emergency Fund", saved: 12000, target: 30000, color: "from-rose-500 to-pink-700", days: 90 },
  { emoji: "💍", name: "Marriage Fund", saved: 65000, target: 200000, color: "from-fuchsia-500 to-purple-700", days: 365 },
];

export function SanchayScreen() {
  return (
    <div className="relative h-full flex flex-col gradient-hero">
      <StatusBar />
      <div className="px-5 pt-2 pb-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button className="w-10 h-10 rounded-full glass flex items-center justify-center"><ChevronLeft className="w-4 h-4" /></button>
          <div>
            <h2 className="text-lg font-bold">Sanchay</h2>
            <p className="text-[10px] text-muted-foreground bangla">সঞ্চয় · Micro Savings</p>
          </div>
        </div>
        <button className="w-10 h-10 rounded-full gradient-gold flex items-center justify-center shadow-gold">
          <Plus className="w-4 h-4 text-gold-foreground" />
        </button>
      </div>

      <div className="px-5">
        <div className="rounded-3xl gradient-card p-5 shadow-glow relative overflow-hidden">
          <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-gold/30 blur-2xl" />
          <div className="text-[11px] text-foreground/70">Total saved across 4 goals</div>
          <div className="text-3xl font-bold mt-1">৳ 1,09,900</div>
          <div className="mt-3 grid grid-cols-3 gap-3 text-center">
            {[
              { l: "This month", v: "৳ 4,200" },
              { l: "Interest", v: "৳ 312" },
              { l: "Streak", v: "27 days" },
            ].map((s) => (
              <div key={s.l} className="bg-white/10 rounded-xl py-2">
                <div className="text-[9px] text-foreground/70">{s.l}</div>
                <div className="text-xs font-bold text-gold">{s.v}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="px-5 mt-5 space-y-3">
        {goals.map((g) => {
          const pct = Math.round((g.saved / g.target) * 100);
          return (
            <div key={g.name} className="glass rounded-2xl p-4">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${g.color} flex items-center justify-center text-2xl`}>
                  {g.emoji}
                </div>
                <div className="flex-1">
                  <div className="text-sm font-semibold">{g.name}</div>
                  <div className="text-[10px] text-muted-foreground flex items-center gap-1">
                    <Target className="w-3 h-3" /> ৳ {g.target.toLocaleString()} · {g.days} days
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold">৳ {g.saved.toLocaleString()}</div>
                  <div className="text-[10px] text-primary font-semibold">{pct}%</div>
                </div>
              </div>
              <div className="mt-3 h-2 rounded-full bg-white/10 overflow-hidden">
                <div className={`h-full bg-gradient-to-r ${g.color} rounded-full`} style={{ width: `${pct}%` }} />
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex-1" />
      <BottomNav active="wallet" />
    </div>
  );
}
