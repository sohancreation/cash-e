import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useProfile } from "@/hooks/use-profile";
import { Plus, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Header } from "./app.send";
import { useCasheI18n } from "@/lib/cashe-i18n";

export const Route = createFileRoute("/_authenticated/app/sanchay")({
  component: Sanchay,
});

function Sanchay() {
  const nav = useNavigate();
  const qc = useQueryClient();
  const { data: p } = useProfile();
  const { tr, money, num } = useCasheI18n();
  const { data: goals } = useQuery({
    queryKey: ["goals"],
    queryFn: async () => {
      const { data } = await supabase.from("savings_goals").select("*").order("created_at");
      return data ?? [];
    },
  });

  const [adding, setAdding] = useState<string | null>(null);

  const topUp = async (goalId: string, amount: number) => {
    const cents = amount * 100;
    if ((p?.balance_cents ?? 0) < cents) return toast.error(tr("Insufficient balance"));
    setAdding(goalId);
    const goal = goals?.find((g) => g.id === goalId);
    if (!goal) return;
    const { error } = await supabase.rpc("debit_wallet", {
      p_kind: "savings",
      p_amount_cents: cents,
      p_counterparty: `Sanchay · ${goal.name}`,
      p_note: `Saved into ${goal.emoji} ${goal.name}`,
      p_meta: { goal_id: goalId } as any,
      p_award_xp: 20,
    });
    if (!error) {
      await supabase
        .from("savings_goals")
        .update({ saved_cents: (goal.saved_cents as number) + cents })
        .eq("id", goalId);
    }
    setAdding(null);
    if (error) return toast.error(error.message);
    toast.success(`${tr("Saved")} ৳${num(amount)} · +20 XP 🌟`);
    qc.invalidateQueries({ queryKey: ["profile"] });
    qc.invalidateQueries({ queryKey: ["goals"] });
    qc.invalidateQueries({ queryKey: ["transactions"] });
  };

  const createGoal = async () => {
    const name = prompt(tr("Goal name?"));
    if (!name) return;
    const targetStr = prompt(tr("Target amount in ৳?"));
    const target = Number(targetStr);
    if (!target) return;
    const sess = await supabase.auth.getSession();
    await supabase.from("savings_goals").insert({
      user_id: sess.data.session!.user.id,
      name,
      emoji: "🎯",
      target_cents: target * 100,
      saved_cents: 0,
    });
    qc.invalidateQueries({ queryKey: ["goals"] });
  };

  return (
    <div className="min-h-full gradient-hero pb-8">
      <Header
        onBack={() => nav({ to: "/app" })}
        title="Sanchay · Savings"
        right={
          <button onClick={createGoal} className="w-9 h-9 rounded-full gradient-gold flex items-center justify-center">
            <Plus className="w-4 h-4 text-black" />
          </button>
        }
      />

      <div className="px-5 mt-4 space-y-3">
        {(goals ?? []).map((g) => {
          const pct = Math.min(100, Math.round(((g.saved_cents as number) / (g.target_cents as number)) * 100));
          return (
            <div key={g.id} className="rounded-2xl p-4 bg-gradient-to-br from-emerald-900/40 to-emerald-700/20 border border-emerald-500/20 relative overflow-hidden">
              <div className="absolute top-1 right-3 text-3xl opacity-40">{g.emoji}</div>
              <div className="text-[11px] font-semibold text-emerald-300 uppercase">{g.name}</div>
              <div className="text-lg font-bold mt-0.5">{money(g.saved_cents as number)}
                <span className="text-xs text-muted-foreground"> {tr("of")} {money(g.target_cents as number)}</span>
              </div>
              <div className="mt-2 h-2 rounded-full bg-white/10 overflow-hidden">
                <div className="h-full gradient-gold rounded-full transition-all" style={{ width: `${pct}%` }} />
              </div>
              <div className="text-[10px] text-muted-foreground mt-1.5">{num(pct)}% {tr("complete")}</div>
              <div className="mt-3 flex gap-2">
                {[100, 500, 1000].map((amt) => (
                  <button
                    key={amt}
                    disabled={adding === g.id}
                    onClick={() => topUp(g.id as string, amt)}
                    className="flex-1 rounded-xl py-2 text-xs font-bold glass-strong disabled:opacity-50 flex items-center justify-center gap-1"
                  >
                     {adding === g.id ? <Loader2 className="w-3 h-3 animate-spin" /> : `+ ৳${num(amt)}`}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
        {(goals ?? []).length === 0 && (
          <div className="text-center text-xs text-muted-foreground py-12">
            {tr("No savings goals yet. Tap + to add one.")}
          </div>
        )}
      </div>
    </div>
  );
}
