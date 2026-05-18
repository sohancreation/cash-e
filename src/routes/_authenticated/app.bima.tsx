import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Header } from "./app.send";
import { HeartPulse, ShieldCheck, ShieldPlus, Umbrella } from "lucide-react";
import { useCasheI18n } from "@/lib/cashe-i18n";

export const Route = createFileRoute("/_authenticated/app/bima")({
  component: BimaPage,
});

const plans = [
  { icon: HeartPulse, name: "Health Cover", sub: "Clinic support up to ৳20,000", price: "৳79/mo" },
  { icon: Umbrella, name: "Family Safety", sub: "Emergency protection for family", price: "৳129/mo" },
  { icon: ShieldCheck, name: "Device Guard", sub: "Phone screen and theft support", price: "৳49/mo" },
];

function BimaPage() {
  const nav = useNavigate();
  const { tr } = useCasheI18n();
  return (
    <div className="min-h-full gradient-hero pb-8">
      <Header onBack={() => nav({ to: "/app" })} title="Bima · Insurance" />
      <div className="px-5 mt-4">
        <div className="rounded-3xl p-5 bg-gradient-to-br from-emerald-700/70 to-teal-700/30 shadow-card">
          <ShieldPlus className="w-9 h-9 text-gold" />
          <h1 className="mt-3 text-2xl font-bold">{tr("Micro insurance")}</h1>
          <p className="mt-1 text-xs text-foreground/75">{tr("Affordable protection plans for health, family, and daily life.")}</p>
        </div>
      </div>
      <div className="px-5 mt-5 space-y-3">
        {plans.map((plan) => {
          const Icon = plan.icon;
          return <button key={plan.name} className="w-full glass-strong rounded-2xl p-4 flex items-center gap-3 text-left"><div className="w-11 h-11 rounded-2xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center"><Icon className="w-5 h-5" /></div><div className="flex-1"><div className="text-sm font-bold">{tr(plan.name)}</div><div className="text-[11px] text-muted-foreground">{tr(plan.sub)}</div></div><div className="text-xs font-bold text-gold">{plan.price}</div></button>;
        })}
      </div>
    </div>
  );
}
