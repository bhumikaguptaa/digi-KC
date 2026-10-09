"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import ScreenShell from "@/components/ScreenShell";
import { useAppState } from "@/lib/context/app-state";
import { AccessibilityPrefs } from "@/lib/data/types";
import { staggerContainer, staggerItem } from "@/lib/motion";

const TOGGLES: { key: keyof AccessibilityPrefs; label: string; desc: string }[] = [
  { key: "largerText", label: "Larger text", desc: "Scales up all text in the app" },
  { key: "highContrast", label: "High contrast mode", desc: "Black and white, maximum contrast" },
  { key: "colorBlindSafe", label: "Color-blind safe mode", desc: "Adds labels and icons wherever color means something" },
  { key: "readAloud", label: "Read questions aloud", desc: "Shows a speaker icon next to each question" },
  { key: "noSmartphone", label: "I don't have a smartphone", desc: "Deliver the final plan as text messages instead" },
];

export default function AccessibilityPage() {
  const router = useRouter();
  const { state, setState } = useAppState();
  const a = state.accessibility;

  const toggle = (key: keyof AccessibilityPrefs) =>
    setState((prev) => ({
      ...prev,
      accessibility: { ...prev.accessibility, [key]: !prev.accessibility[key] },
    }));

  return (
    <ScreenShell>
      <div>
        <h1 className="text-h1 text-ink">Make this easier to use</h1>
        <p className="mt-2 text-small text-ink-2">
          Turn on anything that helps. You can change these any time.
        </p>
      </div>

      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="flex flex-col gap-2"
      >
        {TOGGLES.map((t) => {
          const active = a[t.key];
          return (
            <motion.button
              key={t.key}
              variants={staggerItem}
              onClick={() => toggle(t.key)}
              className={`flex items-center justify-between gap-4 rounded-card border px-5 py-4 text-left transition-colors ${
                active ? "border-primary/40 bg-primary-50" : "border-line bg-white hover:bg-surface"
              }`}
            >
              <span className="flex flex-col">
                <span className="text-h2 text-ink">{t.label}</span>
                <span className="mt-0.5 text-small text-ink-2">{t.desc}</span>
              </span>
              <span className="flex shrink-0 items-center gap-2">
                <span className="text-small font-medium text-ink-2">{active ? "On" : "Off"}</span>
                <span
                  className={`relative flex h-6 w-10 items-center rounded-pill transition-colors ${
                    active ? "bg-primary" : "bg-surface-2"
                  }`}
                >
                  <motion.span
                    className="absolute h-4 w-4 rounded-pill bg-white"
                    animate={{ x: active ? 20 : 4 }}
                    transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                  />
                </span>
              </span>
            </motion.button>
          );
        })}
      </motion.div>

      <button
        onClick={() => router.push("/needs")}
        className="rounded-control bg-primary px-6 py-3.5 font-medium text-white transition-colors duration-150 hover:bg-primary-700"
      >
        Continue
      </button>
    </ScreenShell>
  );
}
