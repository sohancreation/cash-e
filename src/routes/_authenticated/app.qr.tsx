import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { useProfile } from "@/hooks/use-profile";
import { Download, ScanLine } from "lucide-react";
import { Header } from "./app.send";
import { useCasheI18n } from "@/lib/cashe-i18n";

export const Route = createFileRoute("/_authenticated/app/qr")({
  component: QRPage,
});

function QRPage() {
  const nav = useNavigate();
  const { data: p } = useProfile();
  const [dataUrl, setDataUrl] = useState("");
  const { tr, money } = useCasheI18n();

  useEffect(() => {
    if (!p) return;
    const payload = JSON.stringify({ app: "CASh-E", phone: p.phone, name: p.name });
    QRCode.toDataURL(payload, {
      color: { dark: "#0b1a2f", light: "#ffffffff" },
      margin: 2,
      width: 320,
    }).then(setDataUrl);
  }, [p]);

  return (
    <div className="min-h-full gradient-hero pb-8">
      <Header onBack={() => nav({ to: "/app" })} title="My QR Code" />

      <div className="px-5 mt-4 flex flex-col items-center">
        <div className="bg-white p-4 rounded-3xl shadow-glow">
          {dataUrl ? (
            <img src={dataUrl} alt="QR" className="w-64 h-64" />
          ) : (
            <div className="w-64 h-64 animate-pulse bg-muted" />
          )}
        </div>
        <div className="mt-4 text-center">
          <div className="text-lg font-bold">{p?.name}</div>
          <div className="text-xs text-muted-foreground">+{p?.phone}</div>
          <div className="mt-2 px-3 py-1 rounded-full bg-gold/20 text-gold text-[11px] font-semibold inline-block uppercase">
            {tr(p?.tier ?? "silver")} {tr("TIER")} · {money(p?.balance_cents ?? 0)}
          </div>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-3 w-full max-w-xs">
          <a
            href={dataUrl}
            download="cashe-qr.png"
            className="glass-strong rounded-2xl py-3 flex flex-col items-center gap-1"
          >
            <Download className="w-5 h-5 text-gold" />
            <span className="text-[11px] font-semibold">{tr("Save QR")}</span>
          </a>
          <button
            onClick={() => nav({ to: "/app/send" })}
            className="glass-strong rounded-2xl py-3 flex flex-col items-center gap-1"
          >
            <ScanLine className="w-5 h-5 text-primary" />
            <span className="text-[11px] font-semibold">{tr("Scan to pay")}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
