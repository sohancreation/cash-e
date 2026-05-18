import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Theme = "dark" | "light";
export type Lang = "en" | "bn";

type Ctx = {
  theme: Theme;
  lang: Lang;
  toggleTheme: () => void;
  toggleLang: () => void;
  t: (en: string, bn: string) => string;
};

const ThemeLangCtx = createContext<Ctx | null>(null);

export function ThemeLangProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>("dark");
  const [lang, setLang] = useState<Lang>("en");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const t = (localStorage.getItem("cashe.theme") as Theme) || "dark";
    const l = (localStorage.getItem("cashe.lang") as Lang) || "en";
    setTheme(t);
    setLang(l);
  }, []);

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.classList.toggle("light", theme === "light");
    document.documentElement.classList.toggle("dark", theme === "dark");
    try { localStorage.setItem("cashe.theme", theme); } catch {}
  }, [theme]);

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.lang = lang === "bn" ? "bn" : "en";
    document.documentElement.classList.toggle("lang-bn", lang === "bn");
    try { localStorage.setItem("cashe.lang", lang); } catch {}
  }, [lang]);

  const value: Ctx = {
    theme,
    lang,
    toggleTheme: () => setTheme((t) => (t === "dark" ? "light" : "dark")),
    toggleLang: () => setLang((l) => (l === "en" ? "bn" : "en")),
    t: (en, bn) => (lang === "bn" ? bn : en),
  };

  return <ThemeLangCtx.Provider value={value}>{children}</ThemeLangCtx.Provider>;
}

export function useThemeLang() {
  const ctx = useContext(ThemeLangCtx);
  if (!ctx) {
    return {
      theme: "dark" as Theme,
      lang: "en" as Lang,
      toggleTheme: () => {},
      toggleLang: () => {},
      t: (en: string) => en,
    };
  }
  return ctx;
}
