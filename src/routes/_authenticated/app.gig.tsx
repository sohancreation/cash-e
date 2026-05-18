import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Header } from "./app.send";
import { Bike, Clock, MapPinned, WalletCards } from "lucide-react";
import { useCasheI18n } from "@/lib/cashe-i18n";

export const Route = createFileRoute("/_authenticated/app/gig")({
  component: GigPage,
});

function GigPage() {
  const nav = useNavigate();
  const { tr } = useCasheI18n();
  return (
    <div className="min-h-full gradient-hero pb-8">
      <Header onBack={() => nav({ to: "/app" })} title="Gig Wallet" />
      <div className="px-5 mt-4">
        <div className="rounded-3xl p-5 bg-gradient-to-br from-rose-700/70 to-orange-700/30 shadow-card">
          <Bike className="w-9 h-9 text-gold" />
          <h1 className="mt-3 text-2xl font-bold">{tr("Daily payout hub")}</h1>
          <p className="mt-1 text-xs text-foreground/75">{tr("Track rider earnings, instant withdrawals, and fuel rewards.")}</p>
        </div>
      </div>
      <div className="px-5 mt-4 grid grid-cols-3 gap-3">
        <Metric icon={<WalletCards className="w-4 h-4" />} label={tr("Today")} value="৳1,840" />
        <Metric icon={<Clock className="w-4 h-4" />} label={tr("Trips")} value="18" />
        <Metric icon={<MapPinned className="w-4 h-4" />} label={tr("Bonus")} value="৳220" />
      </div>
      <div className="px-5 mt-5 glass-strong rounded-2xl p-4">
        <div className="text-sm font-bold">{tr("Fuel cashback unlocked")}</div>
        <div className="mt-1 text-[11px] text-muted-foreground">{tr("Complete 2 more trips today to receive 4% fuel cashback.")}</div>
        <div className="mt-3 h-2 rounded-full bg-white/10 overflow-hidden"><div className="h-full gradient-gold rounded-full w-3/4" /></div>
      </div>
    </div>
  );
}

function Metric({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return <div className="glass rounded-2xl p-3 text-center"><div className="mx-auto w-8 h-8 rounded-xl bg-rose-500/20 text-rose-300 flex items-center justify-center">{icon}</div><div className="mt-2 text-[10px] text-muted-foreground">{label}</div><div className="text-xs font-bold">{value}</div></div>;
}
