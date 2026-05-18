import { ReactNode } from "react";

export function PhoneFrame({ children, label }: { children: ReactNode; label?: string }) {
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative">
        <div className="absolute -inset-2 rounded-[3rem] bg-gradient-to-br from-primary/30 via-transparent to-gold/20 blur-2xl" />
        <div className="relative w-[360px] h-[760px] rounded-[2.5rem] border border-white/10 bg-background shadow-card overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-7 flex justify-center items-end z-50 pointer-events-none">
            <div className="w-32 h-5 bg-black rounded-b-2xl" />
          </div>
          <div className="h-full overflow-y-auto no-scrollbar">{children}</div>
        </div>
      </div>
      {label && (
        <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground font-medium">{label}</div>
      )}
    </div>
  );
}
