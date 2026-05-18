import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { useProfile } from "@/hooks/use-profile";
import { Loader2, Package, Check } from "lucide-react";
import { toast } from "sonner";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Header } from "./app.send";
import { useCasheI18n } from "@/lib/cashe-i18n";

export const Route = createFileRoute("/_authenticated/app/bundles")({
  component: Bundles,
});

const sendBundles = [
  { id: "send-50",  name: "50 transfers",  quota: 50,  price: 149, save: "Save ৳51" },
  { id: "send-100", name: "100 transfers", quota: 100, price: 249, save: "Save ৳151" },
  { id: "send-300", name: "300 transfers", quota: 300, price: 599, save: "Save ৳601" },
];
const ottBundles = [
  { id: "hoichoi",  name: "Hoichoi",         emoji: "🎬", price: 199, color: "from-rose-500 to-red-700" },
  { id: "chorki",   name: "Chorki",          emoji: "🍿", price: 149, color: "from-orange-500 to-amber-700" },
  { id: "yt",       name: "YouTube Premium", emoji: "▶️", price: 299, color: "from-rose-600 to-pink-700" },
  { id: "super",    name: "CASh-E Super Pack", emoji: "🌟", price: 449, color: "from-violet-500 to-fuchsia-700" },
];

function Bundles() {
  const nav = useNavigate();
  const qc = useQueryClient();
  const { data: p } = useProfile();
  const [buying, setBuying] = useState<string | null>(null);
  const { tr } = useCasheI18n();

  const { data: subs } = useQuery({
    queryKey: ["subs"],
    queryFn: async () => {
      const { data } = await supabase.from("subscriptions").select("*").eq("status", "active");
      return data ?? [];
    },
  });

  const purchase = async (kind: string, plan: any) => {
    const cents = plan.price * 100;
    if ((p?.balance_cents ?? 0) < cents) return toast.error(tr("Insufficient balance"));
    setBuying(plan.id);
    const { error } = await supabase.rpc("debit_wallet", {
      p_kind: "bundle",
      p_amount_cents: cents,
      p_counterparty: plan.name,
      p_note: `${kind} bundle`,
      p_meta: { plan_id: plan.id } as any,
      p_award_xp: 25,
    });
    if (!error) {
      const sess = await supabase.auth.getSession();
      await supabase.from("subscriptions").insert({
        user_id: sess.data.session!.user.id,
        kind,
        plan_id: plan.id,
        plan_name: plan.name,
        price_cents: cents,
        bundle_quota: plan.quota ?? null,
        expires_at: new Date(Date.now() + 30 * 86400000).toISOString(),
      });
    }
    setBuying(null);
    if (error) return toast.error(error.message);
    toast.success(`${plan.name} activated 🎉 +25 XP`);
    qc.invalidateQueries({ queryKey: ["profile"] });
    qc.invalidateQueries({ queryKey: ["subs"] });
    qc.invalidateQueries({ queryKey: ["transactions"] });
  };

  const isActive = (id: string) => subs?.some((s) => s.plan_id === id);

  return (
    <div className="min-h-full gradient-hero pb-8">
      <Header onBack={() => nav({ to: "/app" })} title="Bundles & OTT" />

      <div className="px-5 mt-4">
        <SectionTitle icon="💸">{tr("Send Money Bundles")}</SectionTitle>
        <div className="space-y-2">
          {sendBundles.map((b) => (
            <Row key={b.id} title={tr(b.name)} sub={`${tr("30 days")} · ${tr(b.save)}`} price={b.price}
              active={isActive(b.id)} loading={buying === b.id} onBuy={() => purchase("send", b)} />
          ))}
        </div>

        <SectionTitle icon="🎬" className="mt-6">{tr("OTT Entertainment")}</SectionTitle>
        <div className="grid grid-cols-2 gap-3">
          {ottBundles.map((b) => (
            <button
              key={b.id}
              onClick={() => purchase("ott", b)}
              disabled={buying === b.id || isActive(b.id)}
              className={`relative rounded-2xl p-4 text-left bg-gradient-to-br ${b.color} active:scale-[0.98] shadow-card disabled:opacity-80`}
            >
              <div className="text-3xl">{b.emoji}</div>
              <div className="text-sm font-bold mt-2">{b.name}</div>
              <div className="text-[10px] text-white/80">{tr("30 days")}</div>
              <div className="text-base font-bold mt-2">৳{b.price}<span className="text-[10px] text-white/70">/mo</span></div>
              {isActive(b.id) && (
                <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-black/60 text-[9px] font-bold flex items-center gap-1">
                  <Check className="w-2.5 h-2.5" /> {tr("ACTIVE")}
                </div>
              )}
              {buying === b.id && (
                <div className="absolute inset-0 bg-black/40 rounded-2xl flex items-center justify-center">
                  <Loader2 className="w-5 h-5 animate-spin" />
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function SectionTitle({ children, icon, className = "" }: { children: React.ReactNode; icon: string; className?: string }) {
  return <h3 className={`text-sm font-bold mb-3 flex items-center gap-2 ${className}`}><span>{icon}</span>{children}</h3>;
}

function Row({ title, sub, price, active, loading, onBuy }: any) {
  const { tr } = useCasheI18n();
  return (
    <div className="glass-strong rounded-2xl p-3 flex items-center gap-3">
      <Package className="w-6 h-6 text-violet-300" />
      <div className="flex-1">
        <div className="text-sm font-bold">{title}</div>
        <div className="text-[10px] text-muted-foreground">{sub}</div>
      </div>
      <button
        onClick={onBuy}
        disabled={loading || active}
        className="px-3 py-2 rounded-xl gradient-gold text-black text-xs font-bold disabled:opacity-50 flex items-center gap-1"
      >
        {loading && <Loader2 className="w-3 h-3 animate-spin" />}
        {active ? tr("Active") : `৳${price}`}
      </button>
    </div>
  );
}
