import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Header } from "./app.send";
import { CalendarDays, CloudSun, Sprout, Wheat } from "lucide-react";
import { useCasheI18n } from "@/lib/cashe-i18n";

export const Route = createFileRoute("/_authenticated/app/khamar")({
  component: KhamarPage,
});

const crops = [
  { name: "ধান", stage: "Harvest in 18 days", price: "৳3,150 / মন", mood: "High demand" },
  { name: "আলু", stage: "Planting window", price: "৳1,080 / মন", mood: "Stable" },
  { name: "পাট", stage: "Loan eligible", price: "৳2,720 / মন", mood: "Rising" },
];

function KhamarPage() {
  const nav = useNavigate();
  const { tr } = useCasheI18n();
  return (
    <div className="min-h-full gradient-hero pb-8">
      <Header onBack={() => nav({ to: "/app" })} title="Khamar · Agri" />
      <div className="px-5 mt-4">
        <div className="rounded-3xl p-5 bg-gradient-to-br from-emerald-700/70 to-lime-700/30 shadow-card">
          <Wheat className="w-8 h-8 text-gold" />
          <h1 className="mt-3 text-2xl font-bold">{tr("Farmer wallet")}</h1>
          <p className="mt-1 text-xs text-foreground/75">{tr("Crop prices, seasonal reminders, and agri-finance in one place.")}</p>
        </div>
      </div>
      <div className="px-5 mt-4 grid grid-cols-2 gap-3">
        <Info icon={<CloudSun className="w-5 h-5" />} title={tr("Weather")} value={tr("29°C · Light rain")} />
        <Info icon={<CalendarDays className="w-5 h-5" />} title={tr("Next action")} value={tr("Fertilizer in 4 days")} />
      </div>
      <div className="px-5 mt-5 space-y-3">
        {crops.map((crop) => (
          <div key={crop.name} className="glass-strong rounded-2xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center"><Sprout className="w-5 h-5" /></div>
            <div className="flex-1">
              <div className="text-sm font-bold">{crop.name}</div>
              <div className="text-[11px] text-muted-foreground">{tr(crop.stage)}</div>
            </div>
            <div className="text-right">
              <div className="text-xs font-bold text-gold">{crop.price}</div>
              <div className="text-[10px] text-muted-foreground">{tr(crop.mood)}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Info({ icon, title, value }: { icon: React.ReactNode; title: string; value: string }) {
  return <div className="glass rounded-2xl p-3"><div className="text-primary">{icon}</div><div className="mt-2 text-[10px] text-muted-foreground">{title}</div><div className="text-xs font-bold">{value}</div></div>;
}
