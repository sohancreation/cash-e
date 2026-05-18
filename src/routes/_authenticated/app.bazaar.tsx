import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useProfile } from "@/hooks/use-profile";
import { Loader2, ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { Header } from "./app.send";
import { useCasheI18n } from "@/lib/cashe-i18n";

export const Route = createFileRoute("/_authenticated/app/bazaar")({
  component: Bazaar,
});

const merchants = [
  { id: "daraz", name: "Daraz", tag: "Free delivery", color: "from-orange-500 to-rose-600", emoji: "🛍️", price: 1200, off: 12 },
  { id: "aarong", name: "Aarong", tag: "Heritage fashion", color: "from-rose-500 to-pink-700", emoji: "🧣", price: 2400, off: 8 },
  { id: "foodpanda", name: "Foodpanda", tag: "Iftar bundles", color: "from-pink-500 to-fuchsia-600", emoji: "🍱", price: 450, off: 15 },
  { id: "apex", name: "Apex", tag: "Eid collection", color: "from-amber-500 to-orange-600", emoji: "👟", price: 3200, off: 10 },
  { id: "chaldal", name: "Chaldal", tag: "Grocery", color: "from-emerald-500 to-green-700", emoji: "🥬", price: 850, off: 6 },
  { id: "pathao", name: "Pathao", tag: "Ride · 1st free", color: "from-fuchsia-500 to-violet-700", emoji: "🛵", price: 120, off: 100 },
];

function Bazaar() {
  const nav = useNavigate();
  const qc = useQueryClient();
  const { data: p } = useProfile();
  const [buying, setBuying] = useState<string | null>(null);
  const { tr, money } = useCasheI18n();

  const buy = async (m: typeof merchants[number]) => {
    const final = Math.round(m.price * (1 - m.off / 100));
    const cents = final * 100;
    if ((p?.balance_cents ?? 0) < cents) return toast.error(tr("Insufficient balance"));
    setBuying(m.id);
    const { error } = await supabase.rpc("debit_wallet", {
      p_kind: "bazaar",
      p_amount_cents: cents,
      p_counterparty: m.name,
      p_note: `${m.tag} · ${m.off}% off`,
      p_meta: { merchant: m.id, off: m.off } as any,
      p_award_xp: 10,
    });
    setBuying(null);
    if (error) return toast.error(error.message);
    const cashback = Math.round(cents * 0.02);
    await supabase.rpc("credit_wallet", {
      p_kind: "reward",
      p_amount_cents: cashback,
      p_counterparty: m.name,
      p_note: "2% Bazaar cashback",
      p_meta: {} as any,
    });
    toast.success(`${tr("Pay")} ${money(cents)} · ${money(cashback)} ${tr("cashback")} 🎉`);
    qc.invalidateQueries({ queryKey: ["profile"] });
    qc.invalidateQueries({ queryKey: ["transactions"] });
  };

  return (
    <div className="min-h-full gradient-hero pb-8">
      <Header onBack={() => nav({ to: "/app" })} title="Bazaar · Marketplace" />

      <div className="px-5 mt-3">
        <div className="glass-strong rounded-2xl p-3 flex items-center gap-3">
          <ShoppingBag className="w-6 h-6 text-fuchsia-400" />
          <div className="text-[11px]">
            <div className="font-semibold">{tr("Flash Hour · 6–9 PM")}</div>
            <div className="text-muted-foreground">{tr("Extra 2% cashback on every order")}</div>
          </div>
        </div>
      </div>

      <div className="px-5 mt-4 grid grid-cols-2 gap-3">
        {merchants.map((m) => {
          const final = Math.round(m.price * (1 - m.off / 100));
          return (
            <button
              key={m.id}
              disabled={buying === m.id}
              onClick={() => buy(m)}
              className={`relative text-left rounded-2xl p-3 bg-gradient-to-br ${m.color} overflow-hidden active:scale-[0.98] transition shadow-card`}
            >
              <div className="text-3xl">{m.emoji}</div>
              <div className="text-sm font-bold mt-1">{m.name}</div>
              <div className="text-[10px] text-white/80">{tr(m.tag)}</div>
              <div className="mt-2 flex items-end justify-between">
                <div>
                  <div className="text-[10px] line-through text-white/60">৳{m.price}</div>
                  <div className="text-base font-bold">৳{final}</div>
                </div>
                <div className="px-2 py-0.5 rounded-full bg-black/40 text-[10px] font-bold">-{m.off}%</div>
              </div>
              {buying === m.id && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <Loader2 className="w-5 h-5 animate-spin" />
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
