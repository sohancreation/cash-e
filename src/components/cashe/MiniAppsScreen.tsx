import { StatusBar } from "./StatusBar";
import { BottomNav } from "./BottomNav";
import {
  ChevronLeft, Train, Stethoscope, Zap, Droplet, Flame, Wifi, Phone,
  Plane, BookOpen, HeartHandshake, FileText, Bus, Tv, Receipt, ShoppingCart,
} from "lucide-react";

const cats = [
  { title: "Travel", color: "from-blue-500/20 to-blue-700/10", items: [
    { Icon: Train, label: "Train" }, { Icon: Bus, label: "Bus" }, { Icon: Plane, label: "Flight" },
  ]},
  { title: "Bills", color: "from-amber-500/20 to-amber-700/10", items: [
    { Icon: Zap, label: "Bidyut" }, { Icon: Droplet, label: "Water" }, { Icon: Flame, label: "Gas" },
    { Icon: Wifi, label: "Internet" }, { Icon: Tv, label: "DTH" }, { Icon: Phone, label: "Recharge" },
  ]},
  { title: "Government", color: "from-emerald-500/20 to-emerald-700/10", items: [
    { Icon: FileText, label: "Passport" }, { Icon: Receipt, label: "BRTA" }, { Icon: BookOpen, label: "Tax" },
  ]},
  { title: "Health & Donate", color: "from-rose-500/20 to-rose-700/10", items: [
    { Icon: Stethoscope, label: "Doctor" }, { Icon: HeartHandshake, label: "Zakat" }, { Icon: ShoppingCart, label: "Pharmacy" },
  ]},
];

export function MiniAppsScreen() {
  return (
    <div className="relative h-full flex flex-col gradient-hero">
      <StatusBar />
      <div className="px-5 pt-2 pb-3 flex items-center gap-3">
        <button className="w-10 h-10 rounded-full glass flex items-center justify-center"><ChevronLeft className="w-4 h-4" /></button>
        <div>
          <h2 className="text-lg font-bold">Mini Apps</h2>
          <p className="text-[10px] text-muted-foreground">One app · whole Bangladesh in your pocket</p>
        </div>
      </div>

      <div className="px-5">
        <div className="glass-strong rounded-2xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl gradient-gold flex items-center justify-center text-lg">🇧🇩</div>
          <div className="flex-1">
            <div className="text-xs font-semibold">National Digital Services</div>
            <div className="text-[10px] text-muted-foreground">42 services · verified by Govt. of Bangladesh</div>
          </div>
        </div>
      </div>

      <div className="px-5 mt-4 space-y-4">
        {cats.map((cat) => (
          <div key={cat.title}>
            <div className="text-[11px] text-muted-foreground mb-2 uppercase tracking-wider">{cat.title}</div>
            <div className={`rounded-2xl p-3 bg-gradient-to-br ${cat.color} border border-white/5`}>
              <div className="grid grid-cols-4 gap-3">
                {cat.items.map((it) => (
                  <button key={it.label} className="flex flex-col items-center gap-1.5">
                    <div className="w-11 h-11 rounded-2xl glass-strong flex items-center justify-center">
                      <it.Icon className="w-4 h-4 text-foreground/85" />
                    </div>
                    <span className="text-[10px]">{it.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="h-4" />
      <BottomNav active="shop" />
    </div>
  );
}
