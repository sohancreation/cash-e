import { StatusBar } from "./StatusBar";
import { BottomNav } from "./BottomNav";
import { ChevronLeft, Sun, CloudRain, Wheat, ShieldCheck, Tractor } from "lucide-react";

export function KhamarScreen() {
  return (
    <div className="relative h-full flex flex-col bg-gradient-to-b from-amber-950 via-background to-background">
      <StatusBar />
      <div className="px-5 pt-2 pb-3 flex items-center gap-3">
        <button className="w-10 h-10 rounded-full glass flex items-center justify-center"><ChevronLeft className="w-4 h-4" /></button>
        <div>
          <h2 className="text-lg font-bold">Khamar</h2>
          <p className="text-[10px] text-muted-foreground bangla">খামার · কৃষকের সাথী</p>
        </div>
      </div>

      <div className="px-5">
        <div className="rounded-3xl p-5 bg-gradient-to-br from-amber-600 via-amber-700 to-orange-900 shadow-glow relative overflow-hidden">
          <div className="absolute -right-6 -top-6 w-32 h-32 rounded-full bg-yellow-300/30 blur-2xl" />
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[10px] text-amber-100/90 uppercase tracking-wider">Khulna · Dumuria</div>
              <div className="text-2xl font-bold mt-1">32°C ☀️</div>
              <div className="text-[11px] text-amber-100/90">Clear · Good for harvest</div>
            </div>
            <div className="text-right space-y-2">
              <div className="flex items-center gap-1 text-[10px] bg-white/15 rounded-full px-2 py-1"><Sun className="w-3 h-3" /> Tomorrow 33°</div>
              <div className="flex items-center gap-1 text-[10px] bg-white/15 rounded-full px-2 py-1"><CloudRain className="w-3 h-3" /> Rain in 3 days</div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-5 mt-4 grid grid-cols-2 gap-3">
        {[
          { Icon: Wheat, label: "Agri Loan", v: "৳ 25k", sub: "0% for 30d", color: "bg-amber-500/20 text-amber-300" },
          { Icon: ShieldCheck, label: "Crop Bima", v: "৳ 50/mo", sub: "Drought safe", color: "bg-emerald-500/20 text-emerald-300" },
          { Icon: Tractor, label: "Fertilizer", v: "EMI", sub: "3 installment", color: "bg-orange-500/20 text-orange-300" },
          { Icon: Wheat, label: "Harvest Save", v: "৳ 8,200", sub: "+12% interest", color: "bg-yellow-500/20 text-yellow-300" },
        ].map((c) => (
          <div key={c.label} className="glass rounded-2xl p-3.5">
            <div className={`w-9 h-9 rounded-xl ${c.color} flex items-center justify-center`}>
              <c.Icon className="w-4 h-4" />
            </div>
            <div className="text-xs font-semibold mt-2">{c.label}</div>
            <div className="text-base font-bold">{c.v}</div>
            <div className="text-[10px] text-muted-foreground">{c.sub}</div>
          </div>
        ))}
      </div>

      <div className="px-5 mt-4">
        <div className="glass rounded-2xl p-4">
          <div className="text-[11px] text-amber-300 font-semibold">MARKET PRICE · TODAY</div>
          <div className="mt-2 space-y-2">
            {[
              { name: "Rice (Boro)", price: "৳ 52/kg", up: true, pct: "+2.1%" },
              { name: "Jute", price: "৳ 3,400/maund", up: true, pct: "+5.4%" },
              { name: "Potato", price: "৳ 28/kg", up: false, pct: "-1.2%" },
            ].map((r) => (
              <div key={r.name} className="flex items-center justify-between text-xs">
                <span className="text-foreground/85">{r.name}</span>
                <span className="font-semibold">{r.price}</span>
                <span className={r.up ? "text-primary" : "text-destructive"}>{r.pct}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1" />
      <BottomNav active="wallet" />
    </div>
  );
}
