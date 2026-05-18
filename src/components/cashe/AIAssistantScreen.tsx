import { StatusBar } from "./StatusBar";
import { BottomNav } from "./BottomNav";
import { ChevronLeft, Sparkles, Mic, Send } from "lucide-react";

export function AIAssistantScreen() {
  return (
    <div className="relative h-full flex flex-col bg-gradient-to-b from-violet-950 via-background to-background">
      <StatusBar />
      <div className="px-5 pt-2 pb-3 flex items-center gap-3">
        <button className="w-10 h-10 rounded-full glass flex items-center justify-center"><ChevronLeft className="w-4 h-4" /></button>
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-primary border-2 border-background" />
          </div>
          <div>
            <h2 className="text-base font-bold">CASh-E AI</h2>
            <p className="text-[10px] text-violet-300">Bangla + English · Voice ready</p>
          </div>
        </div>
      </div>

      <div className="flex-1 px-5 space-y-3 overflow-y-auto no-scrollbar">
        <div className="glass rounded-2xl rounded-tl-sm p-3 max-w-[85%]">
          <div className="text-[10px] text-violet-300 font-semibold mb-1">CASh-E AI</div>
          <p className="text-sm">Hi Ayesha 👋 Your financial health score this month is <span className="font-bold text-primary">82/100</span> — strong!</p>
        </div>
        <div className="glass rounded-2xl rounded-tl-sm p-3 max-w-[90%]">
          <div className="text-[10px] text-violet-300 font-semibold mb-1">Suggestion</div>
          <p className="text-sm">You spent ৳ 1,840 on coaching this week. Want me to enroll you in 8% <span className="text-gold">Education Cashback</span>?</p>
          <div className="mt-2.5 flex gap-2">
            <button className="px-3 py-1.5 rounded-xl gradient-gold text-gold-foreground text-[11px] font-semibold">Yes, enroll</button>
            <button className="px-3 py-1.5 rounded-xl bg-white/10 text-[11px]">Later</button>
          </div>
        </div>
        <div className="ml-auto rounded-2xl rounded-tr-sm p-3 max-w-[80%] bg-primary text-primary-foreground">
          <p className="text-sm bangla">আমি কত টাকা সঞ্চয় করতে পারি?</p>
        </div>
        <div className="glass rounded-2xl rounded-tl-sm p-3 max-w-[88%]">
          <div className="text-[10px] text-violet-300 font-semibold mb-1">Analysis · 30 days</div>
          <p className="text-sm">Based on your income & spending, you can safely save <span className="font-bold text-gold">৳ 3,200 / month</span> — that's ৳ 38,400 a year. 💪</p>
          <div className="mt-2 grid grid-cols-3 gap-1.5 text-center">
            {[
              { l: "Income", v: "৳ 12k" },
              { l: "Spend", v: "৳ 8.8k" },
              { l: "Save", v: "৳ 3.2k" },
            ].map((s) => (
              <div key={s.l} className="bg-white/5 rounded-lg py-1.5">
                <div className="text-[9px] text-muted-foreground">{s.l}</div>
                <div className="text-[11px] font-bold">{s.v}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex gap-2 flex-wrap">
          {["Track expenses", "Fraud alert?", "Eid budget", "Pay tuition"].map((s) => (
            <button key={s} className="px-3 py-1.5 rounded-full glass text-[11px] text-foreground/80">{s}</button>
          ))}
        </div>
      </div>

      <div className="px-4 py-3">
        <div className="glass-strong rounded-2xl flex items-center gap-2 px-3 py-2">
          <input placeholder="Ask CASh-E AI..." className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground" />
          <button className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center">
            <Mic className="w-4 h-4 text-violet-300" />
          </button>
          <button className="w-9 h-9 rounded-full gradient-gold flex items-center justify-center">
            <Send className="w-4 h-4 text-gold-foreground" />
          </button>
        </div>
      </div>
      <BottomNav active="me" />
    </div>
  );
}
