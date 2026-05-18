import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Header } from "./app.send";
import { Mail, PackageCheck, Route as RouteIcon, Truck } from "lucide-react";
import { useCasheI18n } from "@/lib/cashe-i18n";

export const Route = createFileRoute("/_authenticated/app/postpay")({
  component: PostPayPage,
});

const deliveries = [
  { id: "DHK-24018", title: "Documents to Chattogram", status: "In transit", eta: "Tomorrow" },
  { id: "KHL-10392", title: "Merchant parcel", status: "Ready for pickup", eta: "Today" },
];

function PostPayPage() {
  const nav = useNavigate();
  const { tr } = useCasheI18n();
  return (
    <div className="min-h-full gradient-hero pb-8">
      <Header onBack={() => nav({ to: "/app" })} title="PostPay · Doot" />
      <div className="px-5 mt-4">
        <div className="rounded-3xl p-5 bg-gradient-to-br from-amber-700/70 to-yellow-700/30 shadow-card">
          <Mail className="w-9 h-9 text-gold" />
          <h1 className="mt-3 text-2xl font-bold">{tr("Pay, post, track")}</h1>
          <p className="mt-1 text-xs text-foreground/75">{tr("Courier payments and Bangladesh Post services from your wallet.")}</p>
        </div>
      </div>
      <div className="px-5 mt-4 grid grid-cols-2 gap-3">
        <Action icon={<Truck className="w-5 h-5" />} title={tr("New delivery")} />
        <Action icon={<RouteIcon className="w-5 h-5" />} title={tr("Track parcel")} />
      </div>
      <div className="px-5 mt-5 space-y-3">
        {deliveries.map((d) => <div key={d.id} className="glass-strong rounded-2xl p-4 flex items-center gap-3"><div className="w-10 h-10 rounded-2xl bg-gold/20 text-gold flex items-center justify-center"><PackageCheck className="w-5 h-5" /></div><div className="flex-1"><div className="text-sm font-bold">{tr(d.title)}</div><div className="text-[11px] text-muted-foreground">{d.id} · {tr(d.status)}</div></div><div className="text-[10px] font-bold text-gold">{tr(d.eta)}</div></div>)}
      </div>
    </div>
  );
}

function Action({ icon, title }: { icon: React.ReactNode; title: string }) {
  return <button className="glass rounded-2xl p-4 text-left"><div className="text-gold">{icon}</div><div className="mt-2 text-xs font-bold">{title}</div></button>;
}
