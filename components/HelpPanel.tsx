"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

interface FaqEntry {
  question: string;
  answer: string;
}

const FAQS: FaqEntry[] = [
  {
    question: "What if a ride doesn't show up?",
    answer:
      "Go to the daily check-in screen and mark that item \"No.\" It immediately opens a re-match with backup transport options near you — it never just closes out silently.",
  },
  {
    question: "What does Medicaid HCBS actually cover?",
    answer:
      "Personal care, homemaker/household help, home-delivered meals, non-medical transportation, durable medical equipment, respite care, and adult day services. It does not reliably cover rent or food for a live-in caregiver, or a direct cash stipend — those vary by state waiver.",
  },
  {
    question: "Who is the care coordinator and how do I reach them?",
    answer:
      "If no caregiver is available, a hospital care coordinator is automatically assigned as the plan's owner. Their line is listed in the Emergency panel (the red button, bottom-right) on every screen.",
  },
  {
    question: "Is any of this a real charge or a real call?",
    answer:
      "No. This is a demo. Payment is mocked — no card is ever charged — and tapping a phone number only opens your own device's dialer. Nothing here sends a real message or bills anyone.",
  },
  {
    question: "Can I change a pickup or delivery time after it's scheduled?",
    answer:
      "Yes — on the 72-hour plan screen, tap the time next to any item to pick a different slot from the list.",
  },
  {
    question: "What if the patient doesn't have a smartphone?",
    answer:
      "Turn on \"I don't have a smartphone\" in the accessibility step. The plan delivery screen then shows a simulated text-message thread instead of app notifications.",
  },
];

export default function HelpPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const reduce = useReducedMotion();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduce ? 0 : 0.18 }}
          className="fixed inset-0 z-50 flex items-end justify-center bg-ink/40 p-4 sm:items-center"
          onClick={onClose}
        >
          <motion.div
            initial={reduce ? {} : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? {} : { opacity: 0, y: 12 }}
            transition={{ duration: reduce ? 0 : 0.22, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="flex max-h-[80vh] w-full max-w-lg flex-col rounded-card bg-white p-6 shadow-float"
          >
            <div className="mb-1 flex items-center justify-between">
              <h2 className="text-h1 text-ink">Caregiver questions</h2>
              <button
                onClick={onClose}
                aria-label="Close"
                className="flex h-8 w-8 items-center justify-center rounded-control text-ink-2 transition-colors hover:bg-surface"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
                </svg>
              </button>
            </div>
            <p className="mb-4 text-small text-ink-2">
              Answers pulled from the discharge plan's own documentation. Tap a
              question to expand it.
            </p>

            <div className="flex flex-col gap-2 overflow-y-auto">
              {FAQS.map((faq, i) => {
                const isOpen = openIndex === i;
                return (
                  <div key={faq.question} className="rounded-control border border-line">
                    <button
                      onClick={() => setOpenIndex(isOpen ? null : i)}
                      className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left"
                    >
                      <span className="text-small font-medium text-ink">{faq.question}</span>
                      <motion.span
                        animate={{ rotate: isOpen ? 180 : 0 }}
                        transition={{ duration: 0.15 }}
                        className="shrink-0 text-ink-3"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                          <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </motion.span>
                    </button>
                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.18 }}
                          className="overflow-hidden"
                        >
                          <p className="px-4 pb-3 text-small text-ink-2">{faq.answer}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>

            <p className="mt-4 text-small text-ink-3">
              This is a demo. Answers are pre-written, not a live AI response.
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
