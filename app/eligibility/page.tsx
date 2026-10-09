"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import ScreenShell from "@/components/ScreenShell";
import { useAppState } from "@/lib/context/app-state";
import { missouriHcbs, hcbsStateNote } from "@/lib/data/hcbs";

export default function EligibilityPage() {
  const router = useRouter();
  const { state } = useAppState();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setChecking(false), 1200);
    return () => clearTimeout(t);
  }, []);

  const insuranceLabel: Record<string, string> = {
    medicaid: "Medicaid",
    private: "Private insurance",
    medicare: "Medicare",
    uninsured: "Uninsured",
    unsure: "Unsure",
  };

  const isNoCaregiver = state.needs.caregiverBranch === "no-caregiver";

  if (checking) {
    return (
      <main className="flex min-h-screen w-full flex-col items-center justify-center gap-4 bg-canvas">
        <motion.div
          className="h-8 w-8 rounded-pill border-2 border-surface-2 border-t-primary"
          animate={{ rotate: 360 }}
          transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
        />
        <p className="text-h2 text-ink-2">Checking what you qualify for…</p>
      </main>
    );
  }

  return (
    <ScreenShell>
      <h1 className="text-h1 text-ink">Here's what's covered</h1>

      {isNoCaregiver && (
        <div className="rounded-card border border-violet/30 bg-violet-50 px-5 py-4">
          <p className="text-small font-medium text-ink">
            A hospital care coordinator will be assigned as the owner of this plan
          </p>
          <p className="mt-1 text-small text-ink-2">
            Since no caregiver is regularly available, this plan is flagged for
            closer follow-up and a care coordinator will check in directly.
          </p>
        </div>
      )}

      <p className="rounded-card border border-line bg-surface px-5 py-4 text-small text-ink-2">
        Insurance on file: <span className="font-medium text-ink">{insuranceLabel[state.needs.insurance ?? "unsure"]}</span>.
        Coverage shown below is Missouri's Medicaid Home &amp; Community-Based
        Services (HCBS) waiver, since University Health is in Kansas City, MO.
      </p>

      <div className="rounded-card border border-line">
        {missouriHcbs.map((s, i) => (
          <div
            key={s.name}
            className={`flex items-center justify-between gap-4 px-5 py-4 ${
              i !== missouriHcbs.length - 1 ? "border-b border-line" : ""
            }`}
          >
            <span className="text-body text-ink">{s.name}</span>
            <span
              className={`shrink-0 rounded-pill px-3 py-1 text-small font-medium ${
                s.covered ? "bg-primary-50 text-primary-700" : "bg-surface-2 text-ink-2"
              }`}
            >
              {s.covered ? "Covered" : "Not reliably covered"}
            </span>
          </div>
        ))}
      </div>

      <p className="rounded-card bg-surface px-5 py-4 text-small text-ink-2">
        <span className="font-medium text-ink">Note:</span> {hcbsStateNote}
      </p>

      <button
        onClick={() => router.push("/plan")}
        className="rounded-control bg-primary px-6 py-3.5 font-medium text-white transition-colors duration-150 hover:bg-primary-700"
      >
        Build the 72-hour plan
      </button>
    </ScreenShell>
  );
}
