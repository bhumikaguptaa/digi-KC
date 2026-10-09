"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useAppState } from "@/lib/context/app-state";
import { goldenPathState } from "@/lib/data/defaults";

export default function Landing() {
  const { setState, resetDemo } = useAppState();

  const start = () => {
    setState((prev) => ({ ...prev, startedAt: new Date().toISOString() }));
  };

  const fillGoldenPath = () => {
    setState(() => ({ ...goldenPathState, startedAt: new Date().toISOString() }));
  };

  return (
    <main className="flex min-h-screen w-full flex-col justify-between bg-canvas px-6 py-10 sm:px-12">
      <div className="flex items-center justify-between text-micro uppercase text-ink-3">
        <span>Scanned from discharge packet</span>
        <span>University Health · KC</span>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="flex flex-1 flex-col justify-center gap-7 py-16"
      >
        <div>
          <p className="mb-3 text-micro uppercase text-primary">First 72</p>
          <h1 className="max-w-xl text-display text-ink">
            Care doesn't end at discharge.
          </h1>
        </div>

        <p className="max-w-md text-body text-ink-2">
          Let's line up rides, meals, and help at home for the next three
          days — before you even leave the parking lot.
        </p>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <Link
            href="/start"
            onClick={start}
            className="inline-flex items-center justify-center rounded-control bg-primary px-8 py-3.5 text-center font-medium text-white transition-colors duration-150 hover:bg-primary-700"
          >
            Start
          </Link>
          <span className="text-small text-ink-3">Takes about 8 minutes</span>
        </div>

        <button
          onClick={fillGoldenPath}
          className="w-fit text-small text-ink-3 underline decoration-line underline-offset-4 transition-colors hover:text-ink-2"
        >
          Demo: pre-fill example patient →
        </button>
      </motion.div>

      <div className="flex items-center justify-between text-small text-ink-3">
        <button onClick={resetDemo} className="underline decoration-line underline-offset-4">
          Reset demo
        </button>
        <span>No account needed</span>
      </div>
    </main>
  );
}
