"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import ScreenShell from "@/components/ScreenShell";
import { useAppState } from "@/lib/context/app-state";
import { generatePlanItems, applyTimeOverrides } from "@/lib/plan-engine";
import { staggerContainer, staggerItem } from "@/lib/motion";

type Reminder = "app" | "text" | "call";

export default function DeliveredPage() {
  const router = useRouter();
  const { state } = useAppState();
  const [reminder, setReminder] = useState<Reminder>(
    state.accessibility.noSmartphone ? "text" : "app"
  );
  const items = useMemo(
    () => applyTimeOverrides(generatePlanItems(state.needs), state.timeOverrides),
    [state.needs, state.timeOverrides]
  );

  if (state.accessibility.noSmartphone || reminder === "text") {
    return (
      <ScreenShell>
        <h1 className="text-h1 text-ink">Sent as text messages</h1>
        <p className="text-small text-ink-2">
          Simulated preview — this is what would arrive on a basic phone.
        </p>

        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="flex flex-col gap-3 rounded-card border border-line bg-surface p-5"
        >
          <motion.div
            variants={staggerItem}
            className="max-w-[85%] self-start rounded-card bg-white px-4 py-3 text-small text-ink"
          >
            Hi {state.profile.relationship.toLowerCase() || "there"}, this is
            University Health. {state.profile.patientName || "Your patient"}'s
            first-72-hours plan is ready. Reply YES to confirm reminders by text.
            <div className="mt-1 text-micro text-ink-3">9:02 AM</div>
          </motion.div>
          <motion.div
            variants={staggerItem}
            className="max-w-[85%] self-end rounded-card bg-primary px-4 py-3 text-small text-white"
          >
            YES
            <div className="mt-1 text-micro text-white/70">9:03 AM</div>
          </motion.div>
          {items.slice(0, 3).map((item) => (
            <motion.div
              key={item.id}
              variants={staggerItem}
              className="max-w-[85%] self-start rounded-card bg-white px-4 py-3 text-small text-ink"
            >
              Reminder: Day {item.day}, {item.time} — {item.label}
              <div className="mt-1 text-micro text-ink-3">Day {item.day}</div>
            </motion.div>
          ))}
        </motion.div>

        <button
          onClick={() => router.push("/check-in")}
          className="rounded-control bg-primary px-6 py-3.5 font-medium text-white transition-colors duration-150 hover:bg-primary-700"
        >
          Continue to daily check-ins
        </button>
      </ScreenShell>
    );
  }

  return (
    <ScreenShell>
      <h1 className="text-h1 text-ink">Your plan is booked</h1>
      <p className="rounded-card border border-line bg-surface px-5 py-4 text-small text-ink-2">
        Attached to {state.profile.patientName || "the patient"}'s discharge
        paperwork. {items.length} items scheduled across the next 3 days.
      </p>

      <div className="flex flex-col gap-3">
        <p className="text-h2 text-ink">Send reminders by:</p>
        <div className="flex gap-2">
          {(["app", "text", "call"] as Reminder[]).map((r) => (
            <button
              key={r}
              onClick={() => setReminder(r)}
              className={`flex-1 rounded-control border px-4 py-3 text-small font-medium transition-colors ${
                reminder === r
                  ? "border-primary/50 bg-primary-50 text-ink"
                  : "border-line bg-white text-ink-2 hover:bg-surface"
              }`}
            >
              {r === "app" ? "App notification" : r === "text" ? "Text message" : "Phone call"}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={() => router.push("/check-in")}
        className="rounded-control bg-primary px-6 py-3.5 font-medium text-white transition-colors duration-150 hover:bg-primary-700"
      >
        Continue to daily check-ins
      </button>
    </ScreenShell>
  );
}
