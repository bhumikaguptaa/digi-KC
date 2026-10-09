"use client";

import { createContext, useContext, useState, ReactNode } from "react";

export type LanguageCode = "en" | "es" | "zh" | "vi" | "hi";

export const LANGUAGES: { code: LanguageCode; label: string; nativeLabel: string; supported: boolean }[] = [
  { code: "en", label: "English", nativeLabel: "English", supported: true },
  { code: "es", label: "Spanish", nativeLabel: "Español", supported: true },
  { code: "zh", label: "Chinese", nativeLabel: "中文", supported: false },
  { code: "vi", label: "Vietnamese", nativeLabel: "Tiếng Việt", supported: false },
  { code: "hi", label: "Hindi", nativeLabel: "हिन्दी", supported: false },
];

const strings: Record<string, Record<LanguageCode, string>> = {
  "landing.eyebrow": { en: "First 72", es: "Primeras 72", zh: "First 72", vi: "First 72", hi: "First 72" },
  "landing.headline": {
    en: "Care doesn't end at discharge.",
    es: "El cuidado no termina al salir del hospital.",
    zh: "Care doesn't end at discharge.",
    vi: "Care doesn't end at discharge.",
    hi: "Care doesn't end at discharge.",
  },
  "landing.subhead": {
    en: "Let's line up rides, meals, and help at home for the next three days — before you even leave the parking lot.",
    es: "Organicemos transporte, comidas y ayuda en casa para los próximos tres días — antes de que salgas del estacionamiento.",
    zh: "Let's line up rides, meals, and help at home for the next three days.",
    vi: "Let's line up rides, meals, and help at home for the next three days.",
    hi: "Let's line up rides, meals, and help at home for the next three days.",
  },
  "landing.start": { en: "Start", es: "Comenzar", zh: "Start", vi: "Start", hi: "Start" },
  "landing.takesTime": {
    en: "Takes about 8 minutes",
    es: "Toma unos 8 minutos",
    zh: "Takes about 8 minutes",
    vi: "Takes about 8 minutes",
    hi: "Takes about 8 minutes",
  },
  "landing.demoPick": {
    en: "Demo: pick a patient",
    es: "Demo: elige un paciente",
    zh: "Demo: pick a patient",
    vi: "Demo: pick a patient",
    hi: "Demo: pick a patient",
  },
  "landing.resetDemo": {
    en: "Reset demo",
    es: "Reiniciar demo",
    zh: "Reset demo",
    vi: "Reset demo",
    hi: "Reset demo",
  },
  "landing.noAccount": {
    en: "No account needed",
    es: "No se necesita cuenta",
    zh: "No account needed",
    vi: "No account needed",
    hi: "No account needed",
  },
  "nav.language": { en: "Language", es: "Idioma", zh: "语言", vi: "Ngôn ngữ", hi: "भाषा" },
  "nav.help": { en: "Help", es: "Ayuda", zh: "Help", vi: "Help", hi: "Help" },
};

export type StringKey = keyof typeof strings;

interface LanguageContextValue {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: (key: StringKey) => string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<LanguageCode>("en");

  const t = (key: StringKey) => {
    const entry = strings[key];
    if (!entry) return key;
    return entry[language] ?? entry.en;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}
