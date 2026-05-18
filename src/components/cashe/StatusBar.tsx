import { Signal, Wifi, BatteryFull } from "lucide-react";

export function StatusBar({ dark = false }: { dark?: boolean }) {
  const cls = dark ? "text-foreground" : "text-foreground";
  return (
    <div className={`flex items-center justify-between px-7 pt-3 pb-1 text-[11px] font-semibold ${cls}`}>
      <span>9:41</span>
      <div className="flex items-center gap-1.5">
        <Signal className="w-3 h-3" />
        <Wifi className="w-3 h-3" />
        <BatteryFull className="w-4 h-4" />
      </div>
    </div>
  );
}
