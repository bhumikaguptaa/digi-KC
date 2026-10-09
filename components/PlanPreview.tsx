"use client";

import { motion } from "framer-motion";
import { CategoryIcon } from "./CategoryIcon";
import { categoryIconClass } from "@/lib/category-style";
import { NeedCategory } from "@/lib/data/types";

const PREVIEW_ITEMS: { day: string; time: string; label: string; category: NeedCategory }[] = [
  { day: "Day 1", time: "11:00 AM", label: "Equipment delivered", category: "equipment" },
  { day: "Day 1", time: "5:30 PM", label: "Dinner delivered", category: "meals" },
  { day: "Day 2", time: "10:00 AM", label: "Ride to follow-up", category: "transport" },
  { day: "Day 2", time: "1:00 PM", label: "Household help", category: "household" },
  { day: "Day 3", time: "6:00 PM", label: "Wellness check-in", category: "checkin" },
];

export default function PlanPreview() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-3 rounded-card border border-line bg-surface p-5">
      <div className="flex items-center justify-between">
        <span className="text-micro uppercase text-ink-3">72-hour plan</span>
        <span className="h-1.5 w-1.5 rounded-pill bg-success" aria-hidden />
      </div>
      {PREVIEW_ITEMS.map((item, i) => (
        <motion.div
          key={item.label}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.5,
            delay: i * 0.5,
            repeat: Infinity,
            repeatDelay: PREVIEW_ITEMS.length * 0.5 + 1.5,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="flex items-center gap-3 rounded-control bg-white px-3 py-2.5"
        >
          <CategoryIcon category={item.category} className={`h-4 w-4 shrink-0 ${categoryIconClass[item.category]}`} />
          <div className="flex min-w-0 flex-1 flex-col">
            <span className="truncate text-small font-medium text-ink">{item.label}</span>
            <span className="text-micro text-ink-3">
              {item.day} · {item.time}
            </span>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
