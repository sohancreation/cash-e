import { StatusBar } from "./StatusBar";
import { BottomNav } from "./BottomNav";
import { ChevronLeft, MapPin, Mail, Package, Banknote, UserCheck } from "lucide-react";

export function PostPayScreen() {
  return (
    <div className="relative h-full flex flex-col bg-gradient-to-b from-red-950/60 via-background to-background">
      <StatusBar />
      <div className="px-5 pt-2 pb-3 flex items-center gap-3">
        <button className="w-10 h-10 rounded-full glass flex items-center justify-center"><ChevronLeft className="w-4 h-4" /></button>
        <div>
          <h2 className="text-lg font-bold">PostPay Network</h2>
          <p className="text-[10px] text-muted-foreground">Bangladesh Post × CASh-E</p>
        </div>
      </div>

      <div className="px-5">
        <div className="rounded-3xl p-5 bg-gradient-to-br from-red-700 via-red-800 to-red-950 shadow-glow relative overflow-hidden">
          <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-gold/30 blur-2xl" />
          <div className="flex items-start justify-between">
            <div>
              <div className="text-[10px] uppercase tracking-wider text-red-200">CASh-E Doot</div>
              <div className="text-xl font-bold mt-1">Your local postman</div>
              <p className="text-[11px] text-red-100/85 mt-1">A trusted digital agent at your doorstep — rural Bangladesh, connected.</p>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-white/15 flex items-center justify-center text-3xl">📮</div>
          </div>
          <div className="mt-4 flex items-center gap-2 text-[11px] bg-white/10 rounded-xl px-3 py-2">
            <MapPin className="w-3.5 h-3.5 text-gold" />
            <span>3 Doot agents within 2 km · Khulna</span>
          </div>
        </div>
      </div>

      <div className="px-5 mt-4 grid grid-cols-2 gap-3">
        {[
          { Icon: Banknote, label: "Cash In/Out", sub: "9,800 kiosks", color: "bg-emerald-500/20 text-emerald-300" },
          { Icon: Package, label: "Parcel COD", sub: "Pay on delivery", color: "bg-blue-500/20 text-blue-300" },
          { Icon: UserCheck, label: "Pension", sub: "Govt. payouts", color: "bg-amber-500/20 text-amber-300" },
          { Icon: Mail, label: "Rural KYC", sub: "Assisted NID", color: "bg-rose-500/20 text-rose-300" },
        ].map((c) => (
          <div key={c.label} className="glass rounded-2xl p-3.5">
            <div className={`w-9 h-9 rounded-xl ${c.color} flex items-center justify-center`}>
              <c.Icon className="w-4 h-4" />
            </div>
            <div className="text-xs font-semibold mt-2">{c.label}</div>
            <div className="text-[10px] text-muted-foreground">{c.sub}</div>
          </div>
        ))}
      </div>

      <div className="px-5 mt-5">
        <div className="text-[11px] text-muted-foreground mb-3 uppercase tracking-wider">Nearby Doot Agents</div>
        <div className="space-y-2">
          {[
            { name: "Md. Karim · Doot", dist: "0.4 km · Dumuria PO", rating: "4.9" },
            { name: "Rashida Begum · Doot", dist: "1.2 km · Khulna Sadar", rating: "4.8" },
            { name: "Abdul Hai · Doot", dist: "1.8 km · Rupsha", rating: "5.0" },
          ].map((a) => (
            <div key={a.name} className="glass rounded-2xl p-3 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center text-lg">📮</div>
              <div className="flex-1">
                <div className="text-xs font-semibold">{a.name}</div>
                <div className="text-[10px] text-muted-foreground">{a.dist}</div>
              </div>
              <div className="text-[11px] font-bold text-gold">★ {a.rating}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1" />
      <BottomNav active="wallet" />
    </div>
  );
}
