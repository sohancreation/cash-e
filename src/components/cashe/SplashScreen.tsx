import { StatusBar } from "./StatusBar";
import { Logo } from "./Logo";
import { ArrowRight, ShieldCheck } from "lucide-react";

export function SplashScreen() {
  return (
    <div className="relative h-full gradient-hero flex flex-col">
      <StatusBar />
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        <div className="absolute top-20 left-10 w-40 h-40 rounded-full bg-primary/40 blur-3xl" />
        <div className="absolute bottom-32 right-8 w-52 h-52 rounded-full bg-gold/30 blur-3xl" />
      </div>
      <div className="relative flex-1 flex flex-col items-center justify-center px-8 text-center">
        <div className="relative animate-float-up">
          <div className="absolute inset-0 -m-6 rounded-full bg-primary/30 blur-3xl" />
          <Logo size={108} />
        </div>
        <div className="mt-8 space-y-2 animate-float-up" style={{ animationDelay: "120ms" }}>
          <div className="text-[10px] tracking-[0.4em] text-gold font-semibold">BANGLADESH · 2026</div>
          <h1 className="text-4xl font-bold leading-tight">
            CASh-E
            <span className="block text-primary">Amar Desh</span>
          </h1>
          <p className="bangla text-lg text-foreground/80 pt-1">আমার দেশ, আমার ক্যাশ-ই</p>
          <p className="text-sm text-muted-foreground pt-2">Built for Every Bangladeshi Life</p>
        </div>
      </div>
      <div className="relative px-6 pb-10 space-y-3 animate-float-up" style={{ animationDelay: "240ms" }}>
        <div className="glass rounded-2xl px-4 py-3 flex items-center gap-3">
          <ShieldCheck className="w-5 h-5 text-primary" />
          <div className="text-xs">
            <div className="font-semibold">Government-Backed Trust</div>
            <div className="text-muted-foreground">Powered by Bangladesh Post & NID</div>
          </div>
        </div>
        <button className="w-full py-4 rounded-2xl gradient-gold text-gold-foreground font-semibold shadow-gold flex items-center justify-center gap-2">
          Get Started <ArrowRight className="w-4 h-4" />
        </button>
        <button className="w-full py-3.5 rounded-2xl glass text-sm font-medium">I have an account</button>
        <div className="flex items-center justify-center gap-4 pt-2 text-[10px] text-muted-foreground">
          <span>বাংলা</span>
          <span className="w-1 h-1 rounded-full bg-muted-foreground" />
          <span className="text-foreground font-semibold">English</span>
          <span className="w-1 h-1 rounded-full bg-muted-foreground" />
          <span>🎙 Voice</span>
        </div>
      </div>
    </div>
  );
}
