import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useProfile } from "@/hooks/use-profile";
import { Trophy, Sparkles, Flame, Wallet, ChevronRight, Package } from "lucide-react";
import { Header } from "./app.send";
import { useCasheI18n } from "@/lib/cashe-i18n";

export const Route = createFileRoute("/_authenticated/app/profile")({
  component: Profile,
});

function Profile() {
  const nav = useNavigate();
  const { data: p } = useProfile();
  const { tr, money, num } = useCasheI18n();

  const subs: any[] = [];

  return (
    <div className="min-h-full gradient-hero pb-8">
      <Header onBack={() => nav({ to: "/app" })} title="My Profile" />
      <div className="px-5 mt-4">
        <div className="glass-strong rounded-3xl p-5 flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-xl font-bold border-2 border-gold/40">
            {p?.avatar_seed}
          </div>
          <div className="flex-1">
            <div className="text-lg font-bold">{p?.name}</div>
            <div className="text-xs text-muted-foreground">+{p?.phone}</div>
            <div className="mt-1 inline-block px-2 py-0.5 rounded-full bg-gold/20 text-gold text-[10px] font-bold uppercase">
              {tr(p?.tier ?? "silver")} {tr("TIER")} · {tr("Level")} {num(p?.level ?? 1)}
            </div>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2">
          <Stat
            icon={<Wallet className="w-4 h-4 text-primary" />}
            label={tr("Balance")}
            value={money(p?.balance_cents ?? 0)}
          />
          <Stat
            icon={<Sparkles className="w-4 h-4 text-violet-400" />}
            label="XP"
            value={num(p?.xp ?? 0)}
          />
          <Stat
            icon={<Flame className="w-4 h-4 text-orange-400" />}
            label={tr("Streak")}
            value={`${num(p?.streak ?? 1)}${tr("d")}`}
          />
        </div>

        <div className="mt-5">
          <h3 className="text-xs font-bold mb-2 uppercase text-muted-foreground">
            {tr("Quick links")}
          </h3>
          <div className="space-y-2">
            <Link
              to="/app/missions"
              icon={<Trophy className="w-4 h-4 text-gold" />}
              label={tr("My Missions")}
            />
            <Link
              to="/app/bundles"
              icon={<Package className="w-4 h-4 text-violet-300" />}
              label={`${tr("My Bundles")} (${num(subs?.length ?? 0)})`}
            />
          </div>
        </div>


        <div className="text-center text-[10px] text-muted-foreground mt-4">
          {tr("CASh-E Amar Desh · Built for every Bangladeshi life 🇧🇩")}
        </div>
      </div>
    </div>
  );
}

function Stat({ icon, label, value }: any) {
  return (
    <div className="glass rounded-2xl p-3 flex flex-col items-center">
      {icon}
      <div className="text-sm font-bold mt-1">{value}</div>
      <div className="text-[10px] text-muted-foreground">{label}</div>
    </div>
  );
}

function Link({ to, icon, label }: any) {
  const nav = useNavigate();
  return (
    <button
      onClick={() => nav({ to })}
      className="w-full glass rounded-2xl p-3 flex items-center gap-3"
    >
      {icon}
      <div className="flex-1 text-left text-sm font-semibold">{label}</div>
      <ChevronRight className="w-4 h-4 text-muted-foreground" />
    </button>
  );
}
