"use client";

import { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { TIME_SLOTS } from "@/lib/plan-engine";

export default function TimePicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (time: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setOpen((o) => !o);
        }}
        className="flex items-center gap-1 rounded-control px-1.5 py-0.5 text-small tabular-nums text-ink-3 transition-colors hover:bg-surface hover:text-ink"
      >
        {value}
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
          <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 top-full z-20 mt-1 max-h-52 w-32 overflow-y-auto rounded-control border border-line bg-white py-1 shadow-float"
          >
            {TIME_SLOTS.map((slot) => (
              <button
                key={slot}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onChange(slot);
                  setOpen(false);
                }}
                className={`block w-full px-3 py-1.5 text-left text-small tabular-nums transition-colors hover:bg-surface ${
                  slot === value ? "bg-primary-50 text-primary-700" : "text-ink"
                }`}
              >
                {slot}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
