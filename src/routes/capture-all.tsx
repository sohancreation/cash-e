import { createFileRoute } from "@tanstack/react-router";
import { SplashScreen } from "@/components/cashe/SplashScreen";
import { HomeScreen } from "@/components/cashe/HomeScreen";
import { SendMoneyScreen } from "@/components/cashe/SendMoneyScreen";
import { QRScreen } from "@/components/cashe/QRScreen";
import { SanchayScreen } from "@/components/cashe/SanchayScreen";
import { KhamarScreen } from "@/components/cashe/KhamarScreen";
import { AIAssistantScreen } from "@/components/cashe/AIAssistantScreen";
import { PostPayScreen } from "@/components/cashe/PostPayScreen";
import { MiniAppsScreen } from "@/components/cashe/MiniAppsScreen";

const screens = [
  ["splash", <SplashScreen />],
  ["home", <HomeScreen />],
  ["send", <SendMoneyScreen />],
  ["qr", <QRScreen />],
  ["sanchay", <SanchayScreen />],
  ["khamar", <KhamarScreen />],
  ["ai", <AIAssistantScreen />],
  ["postpay", <PostPayScreen />],
  ["mini", <MiniAppsScreen />],
] as const;

export const Route = createFileRoute("/capture-all")({
  component: () => (
    <div style={{ background: "#0a0e1a" }}>
      {screens.map(([name, el]) => (
        <div key={name} style={{ width: 360, height: 760, overflow: "hidden" }}>
          {el}
        </div>
      ))}
    </div>
  ),
});
