"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CONTENT, type Content, type Lang } from "@/lib/content";

gsap.registerPlugin(ScrollTrigger);

type LangCtx = {
  lang: Lang;
  dir: "rtl" | "ltr";
  t: Content;
  setLang: (l: Lang) => void;
  toggle: () => void;
};

const Ctx = createContext<LangCtx | null>(null);

/** Client-side language state. Hebrew (RTL) is the default; toggling to English
 *  flips <html dir/lang> in place (no route change) and refreshes ScrollTrigger
 *  because the mirrored layout moves every trigger position. A tiny inline script
 *  in layout.tsx applies the saved choice before paint to avoid a flash. */
export function LangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("he");

  // adopt whatever the no-flash script already put on <html> (avoids a mismatch)
  useEffect(() => {
    if (document.documentElement.lang === "en") setLangState("en");
  }, []);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    document.documentElement.lang = l;
    document.documentElement.dir = l === "he" ? "rtl" : "ltr";
    try {
      localStorage.setItem("lang", l);
    } catch {
      /* ignore */
    }
    // the layout mirrors on dir change → recompute all pinned/scroll positions
    requestAnimationFrame(() => ScrollTrigger.refresh());
  }, []);

  const toggle = useCallback(() => setLang(lang === "he" ? "en" : "he"), [lang, setLang]);

  return (
    <Ctx.Provider
      value={{ lang, dir: lang === "he" ? "rtl" : "ltr", t: CONTENT[lang], setLang, toggle }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function useLang(): LangCtx {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useLang must be used within <LangProvider>");
  return ctx;
}
