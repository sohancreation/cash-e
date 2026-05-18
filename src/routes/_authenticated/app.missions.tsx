import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Trophy, Check, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Header } from "./app.send";
import { useCasheI18n } from "@/lib/cashe-i18n";

export const Route = createFileRoute("/_authenticated/app/missions")({
  component: Missions,
});

function Missions() {
  const nav = useNavigate();
  const qc = useQueryClient();
  const { tr, money, num } = useCasheI18n();
  const { data: missions } = useQuery({
    queryKey: ["missions"],
    queryFn: async () => (await supabase.from("missions").select("*").order("created_at")).data ?? [],
  });

  const claim = useMutation({
    mutationFn: async (id: string) => {
      const { data, error } = await supabase.rpc("claim_mission", { p_mission: id });
      if (error) throw error;
      return data as { xp: number; cashback_cents: number };
    },
    onSuccess: (d) => {
      toast.success(`🏆 +${num(d.xp)} XP${d.cashback_cents > 0 ? ` · ${money(d.cashback_cents)}` : ""}`);
      qc.invalidateQueries({ queryKey: ["missions"] });
      qc.invalidateQueries({ queryKey: ["profile"] });
    },
    onError: (e: any) => toast.error(e.message),
  });

  const list = missions ?? [];
  const completedCount = list.filter((m) => m.completed).length;
  const totalXp = list.reduce((s, m) => s + (m.completed ? (m.reward_xp as number) : 0), 0);

  return (
    <div className="min-h-full gradient-hero pb-8">
      <Header onBack={() => nav({ to: "/app" })} title="Missions & Rewards" />

      <div className="px-5 mt-4">
        <div className="rounded-2xl p-4 bg-gradient-to-br from-gold/15 to-transparent border border-gold/20 grid grid-cols-3 gap-3 text-center">
          <div>
            <div className="text-lg font-bold text-gold">{num(completedCount)}/{num(list.length)}</div>
            <div className="text-[10px] text-muted-foreground uppercase">{tr("Completed")}</div>
          </div>
          <div>
            <div className="text-lg font-bold text-primary">+{num(totalXp)}</div>
            <div className="text-[10px] text-muted-foreground uppercase">{tr("XP earned")}</div>
          </div>
          <div>
            <div className="text-lg font-bold text-emerald-400">{num(list.length - completedCount)}</div>
            <div className="text-[10px] text-muted-foreground uppercase">{tr("Active")}</div>
          </div>
        </div>
      </div>

      <div className="px-5 mt-4 space-y-3">
        {list.map((m) => {
          const progress = m.progress as number;
          const target = m.target as number;
          const pct = Math.min(100, Math.round((progress / target) * 100));
          const ready = progress >= target && !m.completed;
          return (
            <div
              key={m.id}
              className={`glass-strong rounded-2xl p-4 ${ready ? "border border-gold/50 shadow-glow" : ""}`}
            >
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${m.completed ? "bg-emerald-500/20" : "gradient-gold"}`}>
                  {m.completed ? <Check className="w-5 h-5 text-emerald-400" /> : <Trophy className="w-5 h-5 text-black" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <div className="text-sm font-bold">{tr(m.title ?? "")}</div>
                    {m.completed && <span className="text-[10px] text-emerald-400 font-bold uppercase">✓ {tr("Claimed")}</span>}
                  </div>
                  <div className="text-[11px] text-muted-foreground">{tr(m.description ?? "")}</div>
                  <div className="mt-2 h-1.5 rounded-full bg-white/10 overflow-hidden">
                    <div className={`h-full rounded-full transition-all ${m.completed ? "bg-emerald-400" : "gradient-gold"}`} style={{ width: `${pct}%` }} />
                  </div>
                  <div className="mt-1.5 flex items-center justify-between text-[10px]">
                    <span className="text-muted-foreground">{num(progress)}/{num(target)}</span>
                    <span className="text-gold font-bold">
                      +{num(m.reward_xp ?? 0)} XP{(m.reward_cashback_cents as number) > 0 ? ` · ${money(m.reward_cashback_cents as number)} ${tr("cashback")}` : ""}
                    </span>
                  </div>
                  {ready && (
                    <button
                      onClick={() => claim.mutate(m.id as string)}
                      disabled={claim.isPending}
                      className="mt-3 w-full py-2 rounded-xl gradient-gold text-black text-xs font-bold flex items-center justify-center gap-1.5 active:scale-95"
                    >
                      <Sparkles className="w-3.5 h-3.5" /> {tr("Claim reward")}
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        {list.length === 0 && (
          <div className="text-center py-12 text-sm text-muted-foreground">{tr("No missions yet")}</div>
        )}
      </div>
    </div>
  );
}
