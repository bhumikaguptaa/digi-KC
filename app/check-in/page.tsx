"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import ScreenShell from "@/components/ScreenShell";
import { useAppState } from "@/lib/context/app-state";
import { generatePlanItems, matchResourcesForItem } from "@/lib/plan-engine";
import { CategoryIcon } from "@/components/CategoryIcon";
import { categoryIconClass } from "@/lib/category-style";

type Status = "pending" | "yes" | "no" | "partly";

export default function CheckInPage() {
  const { state } = useAppState();
  const items = useMemo(() => generatePlanItems(state.needs), [state.needs]);
  const [statuses, setStatuses] = useState<Record<string, Status>>({});
  const [rematchFor, setRematchFor] = useState<string | null>(null);

  const setStatus = (id: string, s: Status) => {
    setStatuses((prev) => ({ ...prev, [id]: s }));
    if (s === "no") setRematchFor(id);
    else if (rematchFor === id) setRematchFor(null);
  };

  const offered = items.length;
  const realized = items.filter((i) => statuses[i.id] === "yes").length;
  const gap = offered - realized;

  const rematchItem = items.find((i) => i.id === rematchFor);
  const alternatives = rematchItem ? matchResourcesForItem(rematchItem, state.needs).slice(1) : [];

  return (
    <ScreenShell>
      <div>
        <h1 className="text-h1 text-ink">Daily accountability</h1>
        <p className="mt-2 text-small text-ink-2">
          Access offered isn't the same as access realized. We track both.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-card border border-line bg-white p-5 text-center">
          <p className="text-display text-ink tabular-nums">{offered}</p>
          <p className="mt-1 text-micro uppercase text-ink-3">Access offered</p>
        </div>
        <div className="rounded-card border border-primary/30 bg-primary-50 p-5 text-center">
          <p className="text-display text-primary-700 tabular-nums">{realized}</p>
          <p className="mt-1 text-micro uppercase text-primary-700">Access realized</p>
        </div>
        <div className="rounded-card border border-pink/30 bg-pink-50 p-5 text-center">
          <p className="text-display text-pink tabular-nums">{gap}</p>
          <p className="mt-1 text-micro uppercase text-pink">The gap</p>
        </div>
      </div>

      {([1, 2, 3] as const).map((day) => {
        const dayItems = items.filter((i) => i.day === day);
        if (dayItems.length === 0) return null;
        return (
          <div key={day} className="flex flex-col gap-3">
            <p className="text-h2 text-ink">Day {day}</p>
            {dayItems.map((item) => {
              const s = statuses[item.id] ?? "pending";
              return (
                <div key={item.id} className="flex flex-col gap-2">
                  <div className="flex items-center justify-between gap-3 rounded-card border border-line bg-white p-4">
                    <div className="flex items-center gap-2">
                      <CategoryIcon category={item.category} className={`h-5 w-5 ${categoryIconClass[item.category]}`} />
                      <span className="font-medium text-ink">{item.label}</span>
                    </div>
                    <div className="flex gap-1.5">
                      {(["yes", "partly", "no"] as const).map((opt) => (
                        <button
                          key={opt}
                          onClick={() => setStatus(item.id, opt)}
                          className={`rounded-pill px-3 py-1.5 text-small font-medium transition-colors ${
                            s === opt
                              ? opt === "yes"
                                ? "bg-primary text-white"
                                : opt === "no"
                                ? "bg-pink text-white"
                                : "bg-violet text-white"
                              : "bg-surface text-ink-2 hover:bg-surface-2"
                          }`}
                        >
                          {opt === "yes" ? "Yes" : opt === "no" ? "No" : "Partly"}
                        </button>
                      ))}
                    </div>
                  </div>

                  <AnimatePresence>
                    {s === "no" && rematchFor === item.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden rounded-card border border-pink/30 bg-pink-50 p-4"
                      >
                        <p className="mb-3 text-small font-medium text-pink">
                          This didn't happen. Here are other options:
                        </p>
                        <div className="flex flex-col gap-2">
                          {alternatives.map((alt) => (
                            <div key={alt.id} className="flex items-center justify-between rounded-control border border-line bg-white p-3">
                              <div>
                                <p className="font-medium text-ink">{alt.name}</p>
                                <p className="text-small text-ink-2">{alt.type} · {alt.distanceMiles} mi</p>
                              </div>
                              <button
                                onClick={() => {
                                  setStatus(item.id, "partly");
                                  setRematchFor(null);
                                }}
                                className="rounded-control bg-primary px-3 py-2 text-small font-medium text-white transition-colors hover:bg-primary-700"
                              >
                                Rebook
                              </button>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        );
      })}
    </ScreenShell>
  );
}
