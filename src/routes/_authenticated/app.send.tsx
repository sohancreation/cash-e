import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useProfile } from "@/hooks/use-profile";
import { normalizePhone } from "@/lib/format";
import { ArrowLeft, Send, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useCasheI18n } from "@/lib/cashe-i18n";

export const Route = createFileRoute("/_authenticated/app/send")({
  component: SendPage,
});

function SendPage() {
  const nav = useNavigate();
  const qc = useQueryClient();
  const { data: p } = useProfile();
  const [phone, setPhone] = useState("");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const { tr, money } = useCasheI18n();

  const { data: contacts } = useQuery({
    queryKey: ["contacts"],
    queryFn: async () => {
      const { data } = await supabase.from("contacts").select("*").order("is_priyo", { ascending: false });
      return data ?? [];
    },
  });

  const submit = async () => {
    const cents = Math.round(Number(amount) * 100);
    if (!cents || cents <= 0) return toast.error(tr("Enter an amount"));
    if (!phone) return toast.error(tr("Pick a recipient"));
    setLoading(true);
    const { data, error } = await supabase.rpc("transfer_money", {
      p_to_phone: normalizePhone(phone),
      p_amount_cents: cents,
      p_note: note || undefined,
    });
    setLoading(false);
    if (error) return toast.error(error.message);
    toast.success(`${tr("Sent")} ${money(cents)} 🎉  +15 XP`);
    qc.invalidateQueries({ queryKey: ["profile"] });
    qc.invalidateQueries({ queryKey: ["transactions"] });
    nav({ to: "/app" });
  };

  return (
    <div className="min-h-full gradient-hero pb-8">
      <Header onBack={() => nav({ to: "/app" })} title="Send Money" />
      <div className="px-5 mt-4">
        <div className="glass-strong rounded-2xl p-4">
          <div className="text-[11px] text-muted-foreground">{tr("From your wallet")}</div>
          <div className="text-lg font-bold">{money(p?.balance_cents ?? 0)}</div>
        </div>
      </div>

      <div className="px-5 mt-4">
        <Label>{tr("Mobile number")}</Label>
        <input
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="01XXXXXXXXX"
          className="w-full glass rounded-2xl px-4 py-3 text-base font-semibold outline-none focus:border-gold/40"
        />

        <div className="mt-3 grid grid-cols-3 gap-2">
          {(contacts ?? []).slice(0, 6).map((c) => (
            <button
              key={c.id}
              onClick={() => setPhone(c.phone)}
              className={`glass rounded-2xl p-2 flex flex-col items-center gap-1 ${phone === c.phone ? "ring-2 ring-gold" : ""}`}
            >
              <div className="w-8 h-8 rounded-full bg-primary/30 flex items-center justify-center text-[10px] font-bold">
                {c.name.split(" ").map((s) => s[0]).join("").slice(0, 2)}
              </div>
              <div className="text-[10px] truncate w-full text-center">{c.name.split(" ")[0]}</div>
              {c.is_priyo && <div className="text-[8px] text-gold">★ {tr("Priyo")}</div>}
            </button>
          ))}
        </div>
      </div>

      <div className="px-5 mt-5">
        <Label>{tr("Amount (৳)")}</Label>
        <input
          value={amount}
          onChange={(e) => setAmount(e.target.value.replace(/[^\d.]/g, ""))}
          placeholder="0.00"
          inputMode="decimal"
          className="w-full glass rounded-2xl px-4 py-4 text-3xl font-bold outline-none text-center"
        />
        <div className="mt-2 flex gap-2 justify-center">
          {[100, 500, 1000, 5000].map((a) => (
            <button key={a} onClick={() => setAmount(String(a))} className="px-3 py-1.5 text-[11px] rounded-full glass">
              ৳{a}
            </button>
          ))}
        </div>
      </div>

      <div className="px-5 mt-4">
        <Label>{tr("Note (optional)")}</Label>
        <input
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder={tr("Tuition fee, gift, etc.")}
          className="w-full glass rounded-2xl px-4 py-3 text-sm outline-none"
        />
      </div>

      <div className="px-5 mt-6">
        <button
          onClick={submit}
          disabled={loading}
          className="w-full rounded-2xl py-4 gradient-gold text-black font-bold flex items-center justify-center gap-2 shadow-glow active:scale-[0.98] disabled:opacity-50"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          {tr("Send")} {amount && `৳ ${amount}`}
        </button>
        <div className="text-[10px] text-center text-muted-foreground mt-2">⚡ {tr("Instant · ৳0 fee on CASh-E to CASh-E")}</div>
      </div>
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <div className="text-[11px] uppercase tracking-wider text-muted-foreground mb-1.5">{children}</div>;
}

const TITLES_BN: Record<string, string> = {
  "Send Money": "টাকা পাঠান",
  "Sanchay": "সঞ্চয়",
  "Sanchay · Savings": "সঞ্চয়",
  "Gig Wallet": "গিগ ওয়ালেট",
  "PostPay · Doot": "পোস্টপে · দূত",
  "Bills": "বিল পরিশোধ",
  "Pay Bills": "বিল পরিশোধ",
  "Bima": "বিমা",
  "Bima · Insurance": "বিমা",
  "Khamar": "খামার",
  "Khamar · Agri": "খামার · কৃষি",
  "Student": "শিক্ষার্থী",
  "Student Mode": "শিক্ষার্থী মোড",
  "Cash In": "ক্যাশ ইন",
  "Bazaar": "বাজার",
  "Bazaar · Marketplace": "বাজার · মার্কেটপ্লেস",
  "QR Pay": "কিউআর পে",
  "My QR Code": "আমার QR কোড",
  "Profile": "প্রোফাইল",
  "My Profile": "আমার প্রোফাইল",
  "Missions": "মিশন",
  "Missions & Rewards": "মিশন ও রিওয়ার্ড",
  "Bundles": "বান্ডেল",
  "Bundles & OTT": "বান্ডেল ও OTT",
  "CASh-E AI": "ক্যাশ-ই এআই",
  "CASh-E AI · Bangla + English": "CASh-E এআই · বাংলা",
};

export function Header({ onBack, title, right }: { onBack: () => void; title: string; right?: React.ReactNode }) {
  const { tr } = useCasheI18n();
  const display = tr(title, TITLES_BN[title]);
  return (
    <div className="px-5 pt-6 pb-2 pr-16 flex items-center gap-3">
      <button onClick={onBack} className="w-9 h-9 rounded-full glass flex items-center justify-center shrink-0">
        <ArrowLeft className="w-4 h-4" />
      </button>
      <div className="flex-1 text-base font-bold truncate">{display}</div>
      {right}
    </div>
  );
}
