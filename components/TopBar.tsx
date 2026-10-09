"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { LANGUAGES, useLanguage } from "@/lib/i18n";
import HelpPanel from "./HelpPanel";

function GlobeIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3a14 14 0 010 18M12 3a14 14 0 000 18" strokeLinecap="round" />
    </svg>
  );
}

function HelpIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
      <circle cx="12" cy="12" r="9" />
      <path d="M9.5 9.5a2.5 2.5 0 014.8 1c0 1.7-2.3 2-2.3 3.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="12" cy="17.2" r="0.15" fill="currentColor" stroke="none" />
    </svg>
  );
}

export default function TopBar() {
  const { language, setLanguage } = useLanguage();
  const [langOpen, setLangOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const currentLang = LANGUAGES.find((l) => l.code === language)!;

  useEffect(() => {
    if (!langOpen) return;
    const onClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setLangOpen(false);
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [langOpen]);

  return (
    <>
      <div className="fixed left-5 top-5 z-40 flex items-center gap-2">
        <div ref={ref} className="relative">
          <button
            onClick={() => setLangOpen((o) => !o)}
            aria-label="Change language"
            className="flex items-center gap-1.5 rounded-pill border border-line bg-white px-3 py-2 text-small font-medium text-ink-2 shadow-float transition-colors hover:bg-surface"
          >
            <GlobeIcon />
            <span>{currentLang.nativeLabel}</span>
          </button>

          <AnimatePresence>
            {langOpen && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.15 }}
                className="absolute left-0 top-full z-20 mt-1 max-h-60 w-48 overflow-y-auto rounded-control border border-line bg-white py-1 shadow-float"
              >
                {LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      setLanguage(lang.code);
                      setLangOpen(false);
                    }}
                    className={`flex w-full items-center justify-between px-3 py-2 text-left text-small transition-colors hover:bg-surface ${
                      lang.code === language ? "bg-primary-50 text-primary-700" : "text-ink"
                    }`}
                  >
                    <span>
                      {lang.nativeLabel}
                      {lang.label !== lang.nativeLabel && (
                        <span className="ml-1 text-ink-3">· {lang.label}</span>
                      )}
                    </span>
                    {!lang.supported && (
                      <span className="shrink-0 text-micro text-ink-3">Soon</span>
                    )}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <button
          onClick={() => setHelpOpen(true)}
          aria-label="Help and questions"
          className="flex items-center gap-1.5 rounded-pill border border-line bg-white px-3 py-2 text-small font-medium text-ink-2 shadow-float transition-colors hover:bg-surface"
        >
          <HelpIcon />
          <span>Help</span>
        </button>
      </div>

      <HelpPanel open={helpOpen} onClose={() => setHelpOpen(false)} />
    </>
  );
}
