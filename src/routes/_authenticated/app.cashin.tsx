import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "./app.send";
import { Banknote, Building2, Loader2, MapPin, Plus } from "lucide-react";
import { toast } from "sonner";
import { useCasheI18n } from "@/lib/cashe-i18n";

export const Route = createFileRoute("/_authenticated/app/cashin")({
  component: CashInPage,
});

const channels = [
  { id: "agent", title: "Agent Cash In", sub: "Nearby CASh-E agents", icon: MapPin },
  { id: "bank", title: "Bank Transfer", sub: "Any linked bank account", icon: Building2 },
  { id: "card", title: "Debit Card", sub: "Instant card top-up", icon: Banknote },
];

function CashInPage() {
  const nav = useNavigate();
  const qc = useQueryClient();
  const [channel, setChannel] = useState(channels[0]);
  const [amount, setAmount] = useState("500");
  const [loading, setLoading] = useState(false);
  const { tr, money } = useCasheI18n();

  const cashIn = async () => {
    const cents = Math.round(Number(amount) * 100);
    if (!cents || cents <= 0) return toast.error(tr("Cash in amount"));
    setLoading(true);
    const { error } = await supabase.rpc("credit_wallet", {
      p_kind: "cashin",
      p_amount_cents: cents,
      p_counterparty: channel.title,
      p_note: `${channel.sub} · Demo top-up`,
      p_meta: { channel: channel.id } as any,
    });
    setLoading(false);
    if (error) return toast.error(error.message);
    toast.success(`${tr("Cash in successful")} · ${money(cents)}`);
    qc.invalidateQueries({ queryKey: ["profile"] });
    qc.invalidateQueries({ queryKey: ["transactions"] });
    nav({ to: "/app" });
  };

  return (
    <div className="min-h-full gradient-hero pb-8">
      <Header onBack={() => nav({ to: "/app" })} title="Cash In" />
      <div className="px-5 mt-4 space-y-3">
        {channels.map((c) => {
          const Icon = c.icon;
          const active = c.id === channel.id;
          return (
            <button key={c.id} onClick={() => setChannel(c)} className={`w-full glass-strong rounded-2xl p-4 flex items-center gap-3 text-left ${active ? "ring-2 ring-gold" : ""}`}>
              <div className="w-11 h-11 rounded-2xl bg-primary/20 text-primary flex items-center justify-center">
                <Icon className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-bold">{tr(c.title)}</div>
                <div className="text-[11px] text-muted-foreground">{tr(c.sub)}</div>
              </div>
            </button>
          );
        })}
      </div>
      <div className="px-5 mt-5">
        <input value={amount} onChange={(e) => setAmount(e.target.value.replace(/[^\d.]/g, ""))} inputMode="decimal" className="w-full glass rounded-2xl px-4 py-4 text-3xl font-bold text-center outline-none" />
        <div className="mt-2 flex justify-center gap-2">
          {[500, 1000, 2000, 5000].map((v) => <button key={v} onClick={() => setAmount(String(v))} className="px-3 py-1.5 rounded-full glass text-[11px]">৳{v}</button>)}
        </div>
        <button onClick={cashIn} disabled={loading} className="mt-5 w-full rounded-2xl py-4 gradient-gold text-black font-bold flex items-center justify-center gap-2 disabled:opacity-50">
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
          {tr("Add")} {amount ? `৳${amount}` : tr("Money")}
        </button>
      </div>
    </div>
  );
}
