import { StatusBar } from "./StatusBar";
import { BottomNav } from "./BottomNav";
import { ChevronLeft, ScanLine, Zap } from "lucide-react";

export function SendMoneyScreen() {
  const contacts = [
    { name: "Karim", color: "from-blue-500 to-blue-700" },
    { name: "Fatima", color: "from-rose-500 to-pink-700" },
    { name: "Hasan", color: "from-emerald-500 to-emerald-700" },
    { name: "Nila", color: "from-amber-500 to-orange-700" },
    { name: "Ratul", color: "from-violet-500 to-purple-700" },
  ];
  return (
    <div className="relative h-full flex flex-col gradient-hero">
      <StatusBar />
      <div className="px-5 pt-2 pb-4 flex items-center gap-3">
        <button className="w-10 h-10 rounded-full glass flex items-center justify-center"><ChevronLeft className="w-4 h-4" /></button>
        <h2 className="text-lg font-bold">Send Money</h2>
      </div>

      <div className="px-5">
        <div className="glass-strong rounded-3xl p-6 text-center">
          <div className="text-[11px] text-muted-foreground">You are sending</div>
          <div className="mt-3 flex items-baseline justify-center gap-2">
            <span className="text-2xl text-foreground/60">৳</span>
            <span className="text-6xl font-bold tracking-tight">2,500</span>
          </div>
          <div className="text-[10px] text-muted-foreground mt-1 bangla">দুই হাজার পাঁচশত টাকা</div>
          <div className="mt-4 inline-flex items-center gap-1.5 text-[10px] px-2.5 py-1 rounded-full bg-primary/15 text-primary border border-primary/30">
            <Zap className="w-3 h-3" /> Free · instant transfer
          </div>
        </div>
      </div>

      <div className="px-5 mt-5">
        <div className="text-[11px] text-muted-foreground mb-3 uppercase tracking-wider">Recent</div>
        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
          <button className="flex flex-col items-center gap-1.5 shrink-0">
            <div className="w-14 h-14 rounded-full glass border border-dashed border-white/20 flex items-center justify-center">
              <ScanLine className="w-5 h-5 text-gold" />
            </div>
            <span className="text-[10px]">Scan</span>
          </button>
          {contacts.map((c) => (
            <button key={c.name} className="flex flex-col items-center gap-1.5 shrink-0">
              <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${c.color} flex items-center justify-center font-bold text-sm border-2 border-white/20`}>
                {c.name.charAt(0)}
              </div>
              <span className="text-[10px]">{c.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="px-5 mt-5">
        <div className="grid grid-cols-3 gap-2">
          {["1","2","3","4","5","6","7","8","9",".","0","⌫"].map((k) => (
            <button key={k} className="h-14 glass rounded-2xl text-xl font-semibold active:scale-95 transition">
              {k}
            </button>
          ))}
        </div>
      </div>

      <div className="px-5 mt-4">
        <button className="w-full py-4 rounded-2xl gradient-gold text-gold-foreground font-bold shadow-gold">
          Send ৳ 2,500
        </button>
      </div>

      <div className="flex-1" />
      <BottomNav active="wallet" />
    </div>
  );
}
