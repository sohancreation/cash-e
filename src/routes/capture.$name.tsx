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
import { BazaarScreen } from "@/components/cashe/BazaarScreen";
import { BundlesScreen } from "@/components/cashe/BundlesScreen";

const map: Record<string, React.ReactElement> = {
  splash: <SplashScreen />,
  home: <HomeScreen />,
  send: <SendMoneyScreen />,
  qr: <QRScreen />,
  sanchay: <SanchayScreen />,
  khamar: <KhamarScreen />,
  ai: <AIAssistantScreen />,
  postpay: <PostPayScreen />,
  mini: <MiniAppsScreen />,
  bazaar: <BazaarScreen />,
  bundles: <BundlesScreen />,
};

export const Route = createFileRoute("/capture/$name")({
  component: () => {
    const { name } = Route.useParams();
    return (
      <div style={{ width: 360, height: 760, overflow: "hidden", background: "#0a0e1a" }}>
        {map[name] ?? <div>not found</div>}
      </div>
    );
  },
});
