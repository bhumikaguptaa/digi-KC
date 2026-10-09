"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import ScreenShell from "@/components/ScreenShell";
import { useAppState } from "@/lib/context/app-state";
import { generatePlanItems, applyTimeOverrides } from "@/lib/plan-engine";
import { CategoryIcon, categoryLabels } from "@/components/CategoryIcon";
import { categoryChipClass, categoryIconClass } from "@/lib/category-style";
import TimePicker from "@/components/TimePicker";
import { PlanItem } from "@/lib/data/types";
import { staggerContainer, staggerItem } from "@/lib/motion";

const DAY_LABELS: Record<1 | 2 | 3, string> = {
  1: "Day 1",
  2: "Day 2",
  3: "Day 3",
};

export default function PlanPage() {
  const router = useRouter();
  const { state, setState } = useAppState();
  const items = useMemo(
    () => applyTimeOverrides(generatePlanItems(state.needs), state.timeOverrides),
    [state.needs, state.timeOverrides]
  );

  const setItemTime = (id: string, time: string) =>
    setState((prev) => ({ ...prev, timeOverrides: { ...prev.timeOverrides, [id]: time } }));

  const byDay: Record<1 | 2 | 3, PlanItem[]> = { 1: [], 2: [], 3: [] };
  items.forEach((i) => byDay[i.day].push(i));

  return (
    <ScreenShell wide>
      <div>
        <h1 className="text-h1 text-ink">
          {state.profile.patientName || "Patient"}'s first 72 hours
        </h1>
        <p className="mt-2 text-small text-ink-2">
          Built automatically from what you told us. Everything here can
          still be matched to a real local resource on the next screen.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        {([1, 2, 3] as const).map((day) => (
          <div key={day} className="flex flex-col gap-3">
            <div className="flex items-center justify-between px-1">
              <span className="text-h2 text-ink">{DAY_LABELS[day]}</span>
              <span className="text-small text-ink-3">{byDay[day].length} items</span>
            </div>
            <motion.div
              variants={staggerContainer}
              initial="initial"
              animate="animate"
              className="flex flex-col gap-3"
            >
              {byDay[day].length === 0 && (
                <div className="rounded-card border border-dashed border-line px-3 py-6 text-center text-small text-ink-3">
                  Nothing scheduled
                </div>
              )}
              {byDay[day].map((item) => (
                <motion.div
                  key={item.id}
                  variants={staggerItem}
                  className="flex flex-col gap-2.5 rounded-card border border-line bg-white p-4 transition-colors hover:bg-surface"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <CategoryIcon category={item.category} className={`h-5 w-5 shrink-0 ${categoryIconClass[item.category]}`} />
                      <TimePicker value={item.time} onChange={(time) => setItemTime(item.id, time)} />
                    </div>
                    <span className="h-1.5 w-1.5 rounded-pill bg-success" aria-hidden />
                  </div>
                  <span className="text-body font-medium leading-snug text-ink">{item.label}</span>
                  <span className={`w-fit rounded-pill px-2.5 py-0.5 text-small ${categoryChipClass[item.category]}`}>
                    {categoryLabels[item.category]}
                  </span>
                </motion.div>
              ))}
            </motion.div>
          </div>
        ))}
      </div>

      <button
        onClick={() => router.push("/match")}
        className="rounded-control bg-primary px-6 py-3.5 font-medium text-white transition-colors duration-150 hover:bg-primary-700"
      >
        Find local resources for each need
      </button>
    </ScreenShell>
  );
}
