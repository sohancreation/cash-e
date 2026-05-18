import { useEffect, useState } from "react";
import { Moon, Sun, Languages } from "lucide-react";
import { useThemeLang } from "@/lib/theme-lang";

export function FloatingControls() {
  const { theme, lang, toggleTheme, toggleLang } = useThemeLang();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <div className="fixed bottom-4 right-4 z-[60] flex items-center gap-2">
      <button
        onClick={toggleLang}
        title="Toggle language"
        className="glass-strong rounded-full px-3 py-1.5 text-xs font-bold tracking-wide flex items-center gap-1.5 hover:scale-105 active:scale-95 transition border border-white/15 shadow-card"
      >
        <Languages className="w-3.5 h-3.5" />
        {lang === "en" ? "EN" : "বাং"}
      </button>
      <button
        onClick={toggleTheme}
        title="Toggle theme"
        className="glass-strong rounded-full w-9 h-9 flex items-center justify-center hover:scale-105 active:scale-95 transition border border-white/15 shadow-card"
      >
        {theme === "dark" ? <Sun className="w-4 h-4 text-gold" /> : <Moon className="w-4 h-4" />}
      </button>
    </div>
  );
}
