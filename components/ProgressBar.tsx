"use client";

import { motion } from "framer-motion";

export default function ProgressBar({ step, total }: { step: number; total: number }) {
  const pct = Math.min((step / total) * 100, 100);
  return (
    <div className="h-1 w-full overflow-hidden rounded-pill bg-surface-2">
      <motion.div
        className="h-full rounded-pill bg-primary"
        initial={false}
        animate={{ width: `${pct}%` }}
        transition={{ type: "spring", stiffness: 260, damping: 32 }}
      />
    </div>
  );
}
