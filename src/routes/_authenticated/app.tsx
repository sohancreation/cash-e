import { createFileRoute, Link, Outlet, useLocation, useNavigate } from "@tanstack/react-router";
import { Home, Sparkles, Store, QrCode, User } from "lucide-react";
import { Toaster } from "@/components/ui/sonner";
import { useCasheI18n } from "@/lib/cashe-i18n";

export const Route = createFileRoute("/_authenticated/app")({
  component: AppShell,
});

type Tab = { to: string; label: string; icon: any; exact?: boolean; accent?: boolean };
const tabs: Tab[] = [
  { to: "/app", label: "Home", icon: Home, exact: true },
  { to: "/app/bazaar", label: "Bazaar", icon: Store },
  { to: "/app/qr", label: "QR", icon: QrCode, accent: true },
  { to: "/app/ai", label: "AI", icon: Sparkles },
  { to: "/app/profile", label: "Me", icon: User },
];

function AppShell() {
  const loc = useLocation();
  const nav = useNavigate();
  const { tr } = useCasheI18n();
  return (
    <main className="min-h-screen bg-black flex items-center justify-center md:p-6">
      <Toaster richColors theme="dark" position="top-center" />
      <div className="relative w-full h-screen md:max-w-[420px] md:h-[calc(100vh-3rem)] md:max-h-[820px] md:rounded-[2.5rem] md:border md:border-white/10 md:shadow-2xl overflow-hidden bg-background flex flex-col">
        <div className="flex-1 overflow-y-auto no-scrollbar">
          <Outlet />
        </div>
        <nav className="shrink-0 px-3 pt-2 pb-3 bg-gradient-to-t from-background via-background/95 to-background/80">
          <div className="glass-strong rounded-2xl border border-white/10 px-2 py-2 flex items-center justify-between">
            {tabs.map((t) => {
              const active = t.exact ? loc.pathname === t.to : loc.pathname.startsWith(t.to);
              const Icon = t.icon;
              if (t.accent) {
                return (
                  <button
                    key={t.to}
                    onClick={() => nav({ to: t.to as any })}
                    className="-mt-7 w-14 h-14 rounded-full gradient-gold flex items-center justify-center shadow-glow border-4 border-background"
                  >
                    <Icon className="w-6 h-6 text-black" strokeWidth={2.4} />
                  </button>
                );
              }
              return (
                <Link
                  key={t.to}
                  to={t.to as any}
                  className={`flex-1 flex flex-col items-center gap-0.5 py-1.5 rounded-xl ${active ? "text-gold" : "text-muted-foreground"}`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-[10px] font-semibold">{tr(t.label)}</span>
                </Link>
              );
            })}
          </div>
        </nav>
      </div>
    </main>
  );
}

export async function signOut() {}
