import { StatusBar } from "./StatusBar";
import { BottomNav } from "./BottomNav";
import { ChevronLeft, Zap, ImagePlus } from "lucide-react";

export function QRScreen() {
  return (
    <div className="relative h-full flex flex-col bg-black">
      <StatusBar />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,oklch(0.3_0.12_155/30%)_0%,black_70%)]" />
      <div className="relative px-5 pt-2 pb-4 flex items-center gap-3">
        <button className="w-10 h-10 rounded-full glass flex items-center justify-center"><ChevronLeft className="w-4 h-4" /></button>
        <h2 className="text-lg font-bold">Scan to Pay</h2>
      </div>

      <div className="relative flex-1 flex flex-col items-center justify-center px-8">
        <div className="relative w-64 h-64">
          {/* corners */}
          {["top-0 left-0 border-t-2 border-l-2 rounded-tl-2xl","top-0 right-0 border-t-2 border-r-2 rounded-tr-2xl","bottom-0 left-0 border-b-2 border-l-2 rounded-bl-2xl","bottom-0 right-0 border-b-2 border-r-2 rounded-br-2xl"].map((c) => (
            <div key={c} className={`absolute w-12 h-12 border-gold ${c}`} />
          ))}
          <div className="absolute inset-3 rounded-2xl overflow-hidden bg-gradient-to-br from-emerald-900/40 to-emerald-600/10 backdrop-blur grid grid-cols-12 grid-rows-12 gap-0.5 p-3">
            {Array.from({ length: 144 }).map((_, i) => (
              <div key={i} className={`rounded-[2px] ${Math.random() > 0.5 ? "bg-foreground/90" : "bg-transparent"}`} />
            ))}
          </div>
          <div className="absolute left-3 right-3 top-1/2 h-0.5 bg-gold shadow-[0_0_20px_2px_oklch(0.82_0.14_85)]" />
        </div>
        <div className="mt-6 inline-flex items-center gap-1.5 text-[11px] px-3 py-1.5 rounded-full bg-primary/20 text-primary border border-primary/30">
          <Zap className="w-3 h-3" /> Point camera at any CASh-E QR
        </div>
      </div>

      <div className="relative px-5 mb-4 grid grid-cols-2 gap-3">
        <button className="glass rounded-2xl py-3 flex items-center justify-center gap-2 text-sm">
          <ImagePlus className="w-4 h-4" /> Upload QR
        </button>
        <button className="rounded-2xl py-3 gradient-gold text-gold-foreground font-semibold text-sm">
          Show My QR
        </button>
      </div>
      <BottomNav active="scan" />
    </div>
  );
}
