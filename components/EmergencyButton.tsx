"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useAppState } from "@/lib/context/app-state";

const QUICK_OPTIONS = [
  "A fall",
  "Bleeding or reopened stitches",
  "A bad reaction to medication",
  "I can't manage and I need help now",
];

function AlertIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path d="M12 9v4M12 17h.01M10.3 3.6L2.5 17a2 2 0 001.7 3h15.6a2 2 0 001.7-3L13.7 3.6a2 2 0 00-3.4 0z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
    </svg>
  );
}

export default function EmergencyButton() {
  const [open, setOpen] = useState(false);
  const { state } = useAppState();
  const reduce = useReducedMotion();
  const contactName = state.needs.emergencyContactName || "Emergency contact";
  const contactPhone = state.needs.emergencyContactPhone || "Not set yet";

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label="Emergency help"
        className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-pill border border-alarm bg-white px-5 py-3 text-small font-medium text-alarm shadow-float transition-colors duration-150 hover:bg-alarm hover:text-white"
      >
        <AlertIcon />
        <span>Emergency</span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduce ? 0 : 0.18 }}
            className="fixed inset-0 z-50 flex items-end justify-center bg-ink/40 p-4 sm:items-center"
            onClick={() => setOpen(false)}
          >
            <motion.div
              initial={reduce ? {} : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? {} : { opacity: 0, y: 12 }}
              transition={{ duration: reduce ? 0 : 0.22, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md rounded-card bg-white p-6 shadow-float"
            >
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-h1 text-ink">Get help now</h2>
                <button
                  onClick={() => setOpen(false)}
                  aria-label="Close"
                  className="flex h-8 w-8 items-center justify-center rounded-control text-ink-2 transition-colors hover:bg-surface"
                >
                  <CloseIcon />
                </button>
              </div>

              <div className="flex flex-col gap-2">
                <a
                  href="tel:911"
                  className="flex items-center justify-between rounded-control bg-alarm px-4 py-3.5 font-medium text-white transition-colors hover:bg-alarm/90"
                >
                  Call 911
                  <span className="tabular-nums">911</span>
                </a>
                <a
                  href="tel:18005551212"
                  className="flex items-center justify-between rounded-control bg-primary-50 px-4 py-3.5 font-medium text-primary-700 transition-colors hover:bg-primary-50/70"
                >
                  Call the care coordinator
                  <span className="tabular-nums">(800) 555-1212</span>
                </a>
                <a
                  href={`tel:${contactPhone.replace(/[^0-9+]/g, "")}`}
                  className="flex items-center justify-between rounded-control bg-surface px-4 py-3.5 font-medium text-ink transition-colors hover:bg-surface-2"
                >
                  Call {contactName}
                  <span className="tabular-nums">{contactPhone}</span>
                </a>
              </div>

              <p className="mb-2 mt-5 text-small font-medium text-ink-2">
                What's happening? (optional)
              </p>
              <div className="flex flex-wrap gap-2">
                {QUICK_OPTIONS.map((opt) => (
                  <span
                    key={opt}
                    className="rounded-pill border border-line px-3 py-1.5 text-small text-ink-2"
                  >
                    {opt}
                  </span>
                ))}
              </div>
              <p className="mt-4 text-small text-ink-3">
                This is a demo. No real call will be placed except through your
                device's own phone dialer.
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
