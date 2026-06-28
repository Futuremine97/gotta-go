"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { S, LOCALES } from "./strings";

const LanguageContext = createContext(null);
const SUPPORTED = LOCALES.map((l) => l.code);

function detectLocale() {
  if (typeof navigator === "undefined") return "ko";
  const langs = navigator.languages || [navigator.language || "ko"];
  for (const raw of langs) {
    const code = raw.toLowerCase().split("-")[0];
    if (SUPPORTED.includes(code)) return code;
  }
  return "en"; // 외국인 기본값: 한국어 못 읽을 가능성 → 영어
}

export function LanguageProvider({ children }) {
  const [locale, setLocaleState] = useState("ko");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let initial = "ko";
    try {
      const saved = localStorage.getItem("jalr_locale");
      initial = saved && SUPPORTED.includes(saved) ? saved : detectLocale();
    } catch {
      initial = detectLocale();
    }
    setLocaleState(initial);
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready && typeof document !== "undefined") {
      document.documentElement.lang = locale;
    }
  }, [locale, ready]);

  function setLocale(code) {
    setLocaleState(code);
    try { localStorage.setItem("jalr_locale", code); } catch {}
  }

  function t(key, vars) {
    const entry = S[key];
    let str = entry ? (entry[locale] ?? entry.ko ?? key) : key;
    if (vars) {
      for (const k of Object.keys(vars)) {
        str = str.replaceAll(`{${k}}`, String(vars[k]));
      }
    }
    return str;
  }

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLang() {
  const ctx = useContext(LanguageContext);
  if (!ctx) return { locale: "ko", setLocale: () => {}, t: (k) => (S[k]?.ko ?? k) };
  return ctx;
}
