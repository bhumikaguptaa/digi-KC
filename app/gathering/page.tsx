"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import { useAppState } from "@/lib/context/app-state";
import { demoRecord } from "@/lib/data/defaults";

const STEPS = [
  "Locating patient record",
  "Discharge summary",
  "Primary diagnosis",
  "Medications (4)",
  "Scheduled follow-ups (2)",
  "Insurance on file",
  "Home address",
];

const RESULTS = ["found", "retrieved", "retrieved", "retrieved", "retrieved", "verified", "confirmed"];

function CheckIcon({ show }: { show: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <motion.path
        d="M5 13l4 4L19 7"
        stroke="currentColor"
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: show ? 1 : 0 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      />
    </svg>
  );
}

export default function GatheringPage() {
  const router = useRouter();
  const { state, setState } = useAppState();
  const reduce = useReducedMotion();
  const [resolved, setResolved] = useState(0);

  useEffect(() => {
    if (resolved >= STEPS.length) {
      setState((prev) => ({ ...prev, record: prev.record ?? demoRecord }));
      const t = setTimeout(() => router.push("/record"), 500);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setResolved((r) => r + 1), reduce ? 80 : 420);
    return () => clearTimeout(t);
  }, [resolved, router, setState, reduce]);

  const progress = Math.min(resolved / STEPS.length, 1);

  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center bg-canvas px-6">
      <div className="flex w-full max-w-md flex-col gap-8">
        <div className="flex flex-col items-center gap-3 text-center">
          <h1 className="text-h1 text-ink">Retrieving the hospital record</h1>
          <p className="text-small text-ink-2">
            Pulling discharge details so you don't have to re-enter them.
          </p>
        </div>

        <div className="h-1 w-full overflow-hidden rounded-pill bg-surface-2">
          <motion.div
            className="h-full rounded-pill bg-primary"
            animate={{ width: `${progress * 100}%` }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          />
        </div>

        <ul className="flex flex-col gap-1">
          {STEPS.map((label, i) => {
            const isResolved = i < resolved;
            const isActive = i === resolved;
            return (
              <motion.li
                key={label}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: isResolved || isActive ? 1 : 0.35, y: 0 }}
                transition={{ duration: 0.2 }}
                className="flex items-center justify-between border-b border-line py-2.5 text-small"
              >
                <span className={isResolved ? "text-ink" : "text-ink-2"}>{label}</span>
                <span className="flex items-center gap-2">
                  {isResolved ? (
                    <>
                      <span className="text-primary">{RESULTS[i]}</span>
                      <span className="text-primary">
                        <CheckIcon show={isResolved} />
                      </span>
                    </>
                  ) : isActive ? (
                    <span className="h-3 w-16 animate-pulse rounded bg-surface-2" />
                  ) : (
                    <span className="h-3 w-16 rounded bg-surface-2" />
                  )}
                </span>
              </motion.li>
            );
          })}
        </ul>
      </div>
    </main>
  );
}
