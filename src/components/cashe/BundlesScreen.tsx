import { StatusBar } from "./StatusBar";
import { BottomNav } from "./BottomNav";
import { ChevronLeft, Send, Phone, Wifi, Tv, Check, Sparkles } from "lucide-react";

const sendBundles = [
  { tx: "25", days: "15d", price: "৳ 79", save: "Save ৳ 46", hot: false },
  { tx: "100", days: "30d", price: "৳ 249", save: "Save ৳ 251", hot: true },
  { tx: "250", days: "60d", price: "৳ 549", save: "Save ৳ 701", hot: false },
];

const ottBundles = [
  { name: "Hoichoi", price: "৳ 99/mo", color: "from-rose-600 to-red-700", tag: "Bangla originals", letter: "H" },
  { name: "Toffee", price: "৳ 49/mo", color: "from-pink-500 to-fuchsia-600", tag: "Live cricket + drama", letter: "T" },
  { name: "Chorki", price: "৳ 79/mo", color: "from-amber-500 to-orange-600", tag: "Movies + web series", letter: "C" },
  { name: "YouTube Premium", price: "৳ 139/mo", color: "from-red-500 to-rose-700", tag: "Ad-free + Music", letter: "Y" },
];

export function BundlesScreen() {
  return (
    <div className="relative h-full flex flex-col gradient-hero">
      <StatusBar />
      <div className="px-5 pt-2 pb-3 flex items-center gap-3">
        <button className="w-10 h-10 rounded-full glass flex items-center justify-center"><ChevronLeft className="w-4 h-4" /></button>
        <div>
          <h2 className="text-lg font-bold">Bundles & Offers</h2>
          <p className="text-[10px] text-muted-foreground">Pay less · Get more · Every day</p>
        </div>
      </div>

      {/* Send Money bundles */}
      <div className="px-5">
        <div className="flex items-center gap-2 mb-2.5">
          <div className="w-7 h-7 rounded-xl bg-primary/20 flex items-center justify-center"><Send className="w-3.5 h-3.5 text-primary" /></div>
          <h3 className="text-sm font-bold">Send Money Bundles</h3>
        </div>
        <div className="grid grid-cols-3 gap-2.5">
          {sendBundles.map((b) => (
            <div key={b.tx} className={`relative rounded-2xl p-3 ${b.hot ? "bg-gradient-to-br from-primary/30 to-emerald-700/20 border border-primary/40" : "glass"}`}>
              {b.hot && (
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full gradient-gold text-[8px] font-bold text-gold-foreground">POPULAR</div>
              )}
              <div className="text-2xl font-extrabold text-center">{b.tx}</div>
              <div className="text-[9px] text-center text-muted-foreground -mt-0.5">transfers</div>
              <div className="text-[10px] text-center mt-1">{b.days}</div>
              <div className="text-base font-bold text-center text-gold mt-1.5">{b.price}</div>
              <div className="text-[9px] text-center text-emerald-300">{b.save}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Recharge bundle */}
      <div className="px-5 mt-4">
        <div className="rounded-2xl p-4 bg-gradient-to-br from-blue-600/30 to-violet-700/20 border border-blue-400/30 relative overflow-hidden">
          <div className="absolute -right-4 -top-4 w-24 h-24 rounded-full bg-blue-400/20 blur-2xl" />
          <div className="flex items-center gap-2">
            <Phone className="w-3.5 h-3.5 text-blue-300" />
            <div className="text-[10px] font-bold text-blue-300 tracking-widest">RECHARGE COMBO</div>
          </div>
          <div className="mt-1.5 text-base font-bold">28 GB + 500 Min + Unlimited SMS</div>
          <div className="text-[10px] text-muted-foreground">Grameenphone · Robi · Banglalink · 30 days</div>
          <div className="mt-2 flex items-end justify-between">
            <div>
              <div className="text-[9px] line-through text-muted-foreground">৳ 549</div>
              <div className="text-2xl font-extrabold text-gold leading-none">৳ 399</div>
            </div>
            <button className="px-3 py-1.5 rounded-xl gradient-gold text-gold-foreground text-[11px] font-bold">Activate</button>
          </div>
        </div>
      </div>

      {/* OTT bundles */}
      <div className="px-5 mt-4">
        <div className="flex items-center gap-2 mb-2.5">
          <div className="w-7 h-7 rounded-xl bg-rose-500/20 flex items-center justify-center"><Tv className="w-3.5 h-3.5 text-rose-300" /></div>
          <h3 className="text-sm font-bold">OTT & Entertainment</h3>
          <span className="ml-auto text-[9px] text-gold">Pay from wallet · auto-renew</span>
        </div>
        <div className="grid grid-cols-2 gap-2.5">
          {ottBundles.map((o) => (
            <div key={o.name} className="rounded-2xl overflow-hidden glass border border-white/10">
              <div className={`h-14 bg-gradient-to-br ${o.color} flex items-center justify-center text-2xl font-extrabold text-white`}>
                {o.letter}
              </div>
              <div className="p-2.5">
                <div className="text-[11px] font-bold">{o.name}</div>
                <div className="text-[9px] text-muted-foreground">{o.tag}</div>
                <div className="flex items-center justify-between mt-1.5">
                  <div className="text-[11px] font-bold text-gold">{o.price}</div>
                  <button className="text-[9px] font-bold text-primary">SUBSCRIBE</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mega bundle */}
      <div className="px-5 mt-4">
        <div className="rounded-2xl p-3.5 bg-gradient-to-br from-violet-600/30 to-fuchsia-700/20 border border-violet-400/30 relative">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-violet-300" />
            <div className="text-[10px] font-bold text-violet-300 tracking-widest">CASh-E SUPER PACK</div>
          </div>
          <div className="mt-1.5 text-sm font-bold">Hoichoi + Toffee + 28 GB Data + 100 Send Money</div>
          <div className="mt-2 grid grid-cols-2 gap-1 text-[9.5px] text-foreground/80">
            {["All-in-one monthly bill", "Save ৳ 420 vs separate", "Family sharing · 4 logins", "Cancel anytime"].map(p => (
              <div key={p} className="flex items-center gap-1"><Check className="w-3 h-3 text-emerald-300" />{p}</div>
            ))}
          </div>
          <div className="mt-2.5 flex items-end justify-between">
            <div className="text-2xl font-extrabold text-gold">৳ 599<span className="text-[10px] text-muted-foreground font-normal">/mo</span></div>
            <button className="px-3 py-1.5 rounded-xl bg-white/15 text-[11px] font-bold">Get Super Pack</button>
          </div>
        </div>
      </div>

      <div className="h-4" />
      <BottomNav active="shop" />
    </div>
  );
}
