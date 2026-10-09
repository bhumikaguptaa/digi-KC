"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import ScreenShell from "@/components/ScreenShell";
import { useAppState } from "@/lib/context/app-state";
import { generatePlanItems, applyTimeOverrides, matchResourcesForItem } from "@/lib/plan-engine";
import { CategoryIcon, categoryLabels } from "@/components/CategoryIcon";
import { categoryIconClass } from "@/lib/category-style";
import { staggerContainer, staggerItem } from "@/lib/motion";

export default function MatchPage() {
  const router = useRouter();
  const { state } = useAppState();
  const items = useMemo(
    () => applyTimeOverrides(generatePlanItems(state.needs), state.timeOverrides),
    [state.needs, state.timeOverrides]
  );

  const matchesByItem = useMemo(
    () => items.map((item) => ({ item, matches: matchResourcesForItem(item, state.needs) })),
    [items, state.needs]
  );

  const priorityScore = matchesByItem[0]?.matches[0]?.priorityScore ?? 50;
  const priorityReasons = matchesByItem[0]?.matches[0]?.priorityReasons ?? [];

  return (
    <ScreenShell wide>
      <h1 className="text-h1 text-ink">Matched to local resources</h1>

      <div className="flex items-center justify-between rounded-card border border-violet/30 bg-violet-50 px-5 py-4">
        <div>
          <p className="text-body font-medium text-ink">
            Priority score: <span className="tabular-nums">{priorityScore}/100</span>
          </p>
          {priorityReasons.length > 0 && (
            <p className="mt-0.5 text-small text-ink-2">{priorityReasons.join(" · ")}</p>
          )}
        </div>
        <span className="shrink-0 rounded-pill bg-violet px-3 py-1 text-small font-medium text-white">
          Queue bump
        </span>
      </div>

      <div className="flex flex-col gap-7">
        {matchesByItem.map(({ item, matches }) => (
          <div key={item.id} className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <CategoryIcon category={item.category} className={`h-5 w-5 ${categoryIconClass[item.category]}`} />
              <span className="text-h2 text-ink">{item.label}</span>
              <span className="text-micro uppercase text-ink-3">{categoryLabels[item.category]} · {item.time}</span>
            </div>
            <motion.div
              variants={staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, margin: "-40px" }}
              className="flex flex-col gap-2"
            >
              {matches.map((m) => (
                <motion.div
                  key={m.id}
                  variants={staggerItem}
                  className="flex flex-col gap-1.5 rounded-card border border-line bg-white p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-medium text-ink">
                        #{m.rank} {m.name}
                      </p>
                      <p className="text-small text-ink-2">
                        {m.type} · {m.distanceMiles} mi
                      </p>
                    </div>
                    <p className="shrink-0 tabular-nums text-small font-medium text-ink">
                      {m.flatRate !== undefined
                        ? m.flatRate === 0
                          ? "Free"
                          : `$${m.flatRate}`
                        : m.hourlyRate !== undefined
                        ? `$${m.hourlyRate}/hr`
                        : ""}
                    </p>
                  </div>
                  <p className="border-l-2 border-primary/40 pl-2.5 text-small text-ink-2">
                    Why this match: {m.whyMatch}
                  </p>
                  {m.seatsHeld !== undefined && (
                    <p className="text-small font-medium text-primary-700">{m.seatsHeld} seats held today</p>
                  )}
                </motion.div>
              ))}
            </motion.div>
          </div>
        ))}
      </div>

      <button
        onClick={() => router.push("/payment")}
        className="rounded-control bg-primary px-6 py-3.5 font-medium text-white transition-colors duration-150 hover:bg-primary-700"
      >
        See cost and payment
      </button>
    </ScreenShell>
  );
}
