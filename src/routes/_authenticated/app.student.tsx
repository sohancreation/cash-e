import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Header } from "./app.send";
import { BookOpen, GraduationCap, TicketPercent, Trophy } from "lucide-react";
import { useCasheI18n } from "@/lib/cashe-i18n";

export const Route = createFileRoute("/_authenticated/app/student")({
  component: StudentPage,
});

const offers = [
  { icon: BookOpen, title: "Study data pack", sub: "10GB education sites", tag: "৳99" },
  { icon: TicketPercent, title: "Campus food deal", sub: "15% at partner canteens", tag: "Save" },
  { icon: Trophy, title: "Exam savings goal", sub: "Auto-save weekly", tag: "+XP" },
];

function StudentPage() {
  const nav = useNavigate();
  const { tr } = useCasheI18n();
  return (
    <div className="min-h-full gradient-hero pb-8">
      <Header onBack={() => nav({ to: "/app" })} title="Student Mode" />
      <div className="px-5 mt-4">
        <div className="rounded-3xl p-5 bg-gradient-to-br from-blue-700/70 to-cyan-700/30 shadow-card">
          <GraduationCap className="w-9 h-9 text-gold" />
          <h1 className="mt-3 text-2xl font-bold">{tr("Campus wallet")}</h1>
          <p className="mt-1 text-xs text-foreground/75">{tr("Pay tuition, get student offers, and build savings habits.")}</p>
        </div>
      </div>
      <div className="px-5 mt-5 space-y-3">
        {offers.map((offer) => {
          const Icon = offer.icon;
          return <div key={offer.title} className="glass-strong rounded-2xl p-4 flex items-center gap-3"><div className="w-11 h-11 rounded-2xl bg-blue-500/20 text-blue-300 flex items-center justify-center"><Icon className="w-5 h-5" /></div><div className="flex-1"><div className="text-sm font-bold">{tr(offer.title)}</div><div className="text-[11px] text-muted-foreground">{tr(offer.sub)}</div></div><div className="px-2 py-1 rounded-full bg-gold/20 text-gold text-[10px] font-bold">{tr(offer.tag)}</div></div>;
        })}
      </div>
    </div>
  );
}
