import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useProfile } from "@/hooks/use-profile";
import { Header } from "./app.send";
import { Bolt, Droplets, Flame, Loader2, Phone, Wifi } from "lucide-react";
import { toast } from "sonner";
import { useCasheI18n } from "@/lib/cashe-i18n";

export const Route = createFileRoute("/_authenticated/app/bills")({
  validateSearch: (search: Record<string, unknown>) => ({
    biller: (search.biller as string) || undefined,
  }),
  component: BillsPage,
});

const billers = [
  { id: "desco", name: "DESCO Electricity", icon: Bolt, color: "bg-yellow-500/20 text-yellow-300", sample: 1250 },
  { id: "titas", name: "Titas Gas", icon: Flame, color: "bg-orange-500/20 text-orange-300", sample: 850 },
  { id: "wasa", name: "WASA Water", icon: Droplets, color: "bg-sky-500/20 text-sky-300", sample: 620 },
  { id: "btrc", name: "Mobile Recharge", icon: Phone, color: "bg-emerald-500/20 text-emerald-300", sample: 200 },
  { id: "isp", name: "Internet Bill", icon: Wifi, color: "bg-violet-500/20 text-violet-300", sample: 1000 },
];

function BillsPage() {
  const nav = useNavigate();
  const qc = useQueryClient();
  const { biller } = Route.useSearch();
  const { data: p } = useProfile();
  const [selected, setSelected] = useState(() => {
    return billers.find((b) => b.id === biller) ?? billers[0];
  });
  const [account, setAccount] = useState("");
  const [amount, setAmount] = useState(String(billers[0].sample));
  const [paying, setPaying] = useState(false);
  const { tr, money } = useCasheI18n();

  const pay = async () => {
    const cents = Math.round(Number(amount) * 100);
    if (!account.trim()) return toast.error(tr("Enter account or meter number"));
    if (!cents || cents <= 0) return toast.error(tr("Enter bill amount"));
    if ((p?.balance_cents ?? 0) < cents) return toast.error(tr("Insufficient balance"));
    setPaying(true);
    const { error } = await supabase.rpc("debit_wallet", {
      p_kind: "bill",
      p_amount_cents: cents,
      p_counterparty: selected.name,
      p_note: `Bill payment · ${account}`,
      p_meta: { biller: selected.id, account } as any,
      p_award_xp: 12,
    });
    setPaying(false);
    if (error) return toast.error(error.message);
    toast.success(`${tr(selected.name)} ${tr("paid")} · ${money(cents)} · +12 XP`);
    qc.invalidateQueries({ queryKey: ["profile"] });
    qc.invalidateQueries({ queryKey: ["transactions"] });
    nav({ to: "/app" });
  };

  return (
    <div className="min-h-full gradient-hero pb-8">
      <Header onBack={() => nav({ to: "/app" })} title="Pay Bills" />
      <div className="px-5 mt-4">
        <div className="glass-strong rounded-2xl p-4">
          <div className="text-[11px] text-muted-foreground">{tr("Available balance")}</div>
          <div className="text-xl font-bold">{money(p?.balance_cents ?? 0)}</div>
        </div>
      </div>
      <div className="px-5 mt-4 grid grid-cols-2 gap-2">
        {billers.map((b) => {
          const Icon = b.icon;
          const active = selected.id === b.id;
          return (
            <button
              key={b.id}
              onClick={() => {
                setSelected(b);
                setAmount(String(b.sample));
              }}
              className={`glass rounded-2xl p-3 text-left ${active ? "ring-2 ring-gold" : ""}`}
            >
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${b.color}`}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="mt-2 text-xs font-bold">{tr(b.name)}</div>
            </button>
          );
        })}
      </div>
      <div className="px-5 mt-5 space-y-3">
        <input
          value={account}
          onChange={(e) => setAccount(e.target.value)}
          placeholder={tr("Account / meter / mobile number")}
          className="w-full glass rounded-2xl px-4 py-3 text-sm outline-none"
        />
        <input
          value={amount}
          onChange={(e) => setAmount(e.target.value.replace(/[^\d.]/g, ""))}
          inputMode="decimal"
          placeholder={tr("Amount")}
          className="w-full glass rounded-2xl px-4 py-4 text-3xl font-bold text-center outline-none"
        />
        <button
          onClick={pay}
          disabled={paying}
          className="w-full rounded-2xl py-4 gradient-gold text-black font-bold flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {paying && <Loader2 className="w-4 h-4 animate-spin" />}
          {tr("Pay")} {amount ? `৳${amount}` : tr("Bill")}
        </button>
      </div>
    </div>
  );
}
