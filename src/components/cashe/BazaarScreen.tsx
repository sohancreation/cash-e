import { StatusBar } from "./StatusBar";
import { BottomNav } from "./BottomNav";
import { ChevronLeft, Search, Tag, Flame, Star, ShoppingBag } from "lucide-react";

const deals = [
  { brand: "Daraz", off: "55%", title: "Eid Mega Sale", sub: "Fashion · Electronics", color: "from-orange-500/30 to-rose-600/20", accent: "text-orange-300" },
  { brand: "Foodpanda", off: "40%", title: "Iftar Combo", sub: "Free delivery · ৳ 99", color: "from-pink-500/30 to-fuchsia-600/20", accent: "text-pink-300" },
  { brand: "Chaldal", off: "25%", title: "Grocery Cashback", sub: "Min ৳ 800 order", color: "from-emerald-500/30 to-green-700/20", accent: "text-emerald-300" },
  { brand: "Pickaboo", off: "৳2,500", title: "Smartphone Off", sub: "EMI from ৳ 1,250/mo", color: "from-blue-500/30 to-indigo-700/20", accent: "text-blue-300" },
];

const cats = [
  { Icon: ShoppingBag, label: "Fashion" },
  { Icon: Flame, label: "Trending" },
  { Icon: Tag, label: "Coupons" },
  { Icon: Star, label: "Premium" },
];

export function BazaarScreen() {
  return (
    <div className="relative h-full flex flex-col gradient-hero">
      <StatusBar />
      <div className="px-5 pt-2 pb-3 flex items-center gap-3">
        <button className="w-10 h-10 rounded-full glass flex items-center justify-center"><ChevronLeft className="w-4 h-4" /></button>
        <div className="flex-1">
          <h2 className="text-lg font-bold">Bazaar</h2>
          <p className="text-[10px] text-muted-foreground">Shop · Save · Earn cashback</p>
        </div>
        <button className="w-10 h-10 rounded-full glass flex items-center justify-center"><Search className="w-4 h-4" /></button>
      </div>

      {/* Hero cashback banner */}
      <div className="px-5">
        <div className="relative rounded-3xl p-4 overflow-hidden bg-gradient-to-br from-rose-600 via-fuchsia-600 to-violet-700 shadow-glow">
          <div className="absolute -right-6 -top-6 w-32 h-32 rounded-full bg-white/20 blur-2xl" />
          <div className="text-[10px] font-bold text-white/80 tracking-widest">CASHBACK BAZAAR</div>
          <div className="text-2xl font-extrabold text-white mt-1">Up to <span className="text-gold">৳ 1,200</span> Back</div>
          <div className="text-[11px] text-white/85 mt-0.5">on every Eid order · 200+ brands</div>
          <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/20 backdrop-blur">
            <Flame className="w-3 h-3 text-gold" />
            <span className="text-[10px] font-semibold text-white">42 deals live now</span>
          </div>
        </div>
      </div>

      {/* Category chips */}
      <div className="px-5 mt-4 grid grid-cols-4 gap-3">
        {cats.map(({ Icon, label }) => (
          <div key={label} className="flex flex-col items-center gap-1.5">
            <div className="w-11 h-11 rounded-2xl glass-strong flex items-center justify-center">
              <Icon className="w-4 h-4 text-gold" />
            </div>
            <span className="text-[10px]">{label}</span>
          </div>
        ))}
      </div>

      {/* Deals */}
      <div className="px-5 mt-4">
        <div className="flex items-center justify-between mb-2.5">
          <h3 className="text-sm font-bold">Top Discounts</h3>
          <span className="text-[10px] text-primary">See all</span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {deals.map((d) => (
            <div key={d.brand} className={`rounded-2xl p-3 bg-gradient-to-br ${d.color} border border-white/10 relative overflow-hidden`}>
              <div className={`text-[9px] font-bold ${d.accent} tracking-widest`}>{d.brand.toUpperCase()}</div>
              <div className="text-xl font-extrabold text-foreground mt-0.5">{d.off}<span className="text-xs"> OFF</span></div>
              <div className="text-[11px] font-semibold mt-1">{d.title}</div>
              <div className="text-[9px] text-foreground/70">{d.sub}</div>
              <button className="mt-2 px-2.5 py-1 rounded-lg bg-white/15 text-[9px] font-bold">CLAIM</button>
            </div>
          ))}
        </div>
      </div>

      {/* Flash strip */}
      <div className="px-5 mt-4">
        <div className="glass-strong rounded-2xl p-3 flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl gradient-gold flex items-center justify-center"><Flame className="w-4 h-4 text-gold-foreground" /></div>
          <div className="flex-1">
            <div className="text-xs font-bold">Flash Hour · 3:00 PM</div>
            <div className="text-[10px] text-muted-foreground">Extra 10% off on ALL grocery orders</div>
          </div>
          <div className="text-right">
            <div className="text-[9px] text-muted-foreground">Ends in</div>
            <div className="text-xs font-bold text-gold">02:14:08</div>
          </div>
        </div>
      </div>

      {/* Mini featured strip */}
      <div className="px-5 mt-4">
        <h3 className="text-sm font-bold mb-2.5">Brand Spotlight</h3>
        <div className="flex gap-2.5 overflow-x-auto no-scrollbar">
          {["Aarong", "Sailor", "Yellow", "Apex", "Bata", "Walton"].map((b) => (
            <div key={b} className="shrink-0 w-20 h-20 rounded-2xl glass flex flex-col items-center justify-center gap-1">
              <div className="w-7 h-7 rounded-full gradient-gold flex items-center justify-center text-[10px] font-bold text-gold-foreground">{b[0]}</div>
              <div className="text-[9px] font-semibold">{b}</div>
              <div className="text-[8px] text-emerald-300">up to 30%</div>
            </div>
          ))}
        </div>
      </div>

      <div className="h-4" />
      <BottomNav active="shop" />
    </div>
  );
}
