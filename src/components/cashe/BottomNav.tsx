import { Home, Wallet, ScanLine, ShoppingBag, User } from "lucide-react";
import { useCasheI18n } from "@/lib/cashe-i18n";

export function BottomNav({ active = "home" }: { active?: string }) {
  const { tr } = useCasheI18n();
  const items = [
    { id: "home", label: "Home", Icon: Home },
    { id: "wallet", label: "Wallet", Icon: Wallet },
    { id: "scan", label: "Scan", Icon: ScanLine },
    { id: "shop", label: "Shop", Icon: ShoppingBag },
    { id: "me", label: "Me", Icon: User },
  ];
  return (
    <div className="sticky bottom-0 inset-x-0 pb-2 pt-3 px-4 bg-gradient-to-t from-background via-background/95 to-transparent">
      <div className="glass-strong rounded-3xl flex items-center justify-between px-3 py-2.5 relative">
        {items.map(({ id, label, Icon }) => {
          const isActive = id === active;
          const isScan = id === "scan";
          if (isScan) {
            return (
              <div key={id} className="-mt-8 relative">
                <div className="absolute inset-0 rounded-full bg-primary/40 blur-xl" />
                <button className="relative w-14 h-14 rounded-full gradient-gold shadow-gold flex items-center justify-center border-4 border-background">
                  <ScanLine className="w-6 h-6 text-gold-foreground" strokeWidth={2.5} />
                </button>
              </div>
            );
          }
          return (
            <button key={id} className={`flex flex-col items-center gap-1 px-3 py-1 ${isActive ? "text-primary" : "text-muted-foreground"}`}>
              <Icon className="w-5 h-5" strokeWidth={isActive ? 2.5 : 1.8} />
              <span className="text-[10px] font-medium">{tr(label)}</span>
              {isActive && <span className="w-1 h-1 rounded-full bg-primary" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}
