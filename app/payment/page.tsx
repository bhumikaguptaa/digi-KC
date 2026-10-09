"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import ScreenShell from "@/components/ScreenShell";
import PayerTag from "@/components/PayerTag";
import CountUp from "@/components/CountUp";
import { useAppState } from "@/lib/context/app-state";
import { generatePlanItems, matchResourcesForItem, buildCostLine } from "@/lib/plan-engine";
import { PaymentMethod } from "@/lib/data/types";

type Stage = "review" | "method" | "assistance-form" | "card" | "confirmed";

export default function PaymentPage() {
  const router = useRouter();
  const { state, setState } = useAppState();
  const [stage, setStage] = useState<Stage>("review");
  const [card, setCard] = useState({ number: "", expiry: "", cvc: "" });
  const [assistanceStep, setAssistanceStep] = useState({ employment: "", dependents: "", notes: "" });

  const costLines = useMemo(() => {
    const items = generatePlanItems(state.needs);
    return items.map((item) => {
      const matches = matchResourcesForItem(item, state.needs);
      const top = matches[0];
      return buildCostLine(item, top, state.needs.insurance);
    });
  }, [state.needs]);

  const totalSticker = costLines.reduce((s, l) => s + l.stickerPrice, 0);
  const totalReduced = costLines.reduce((s, l) => s + l.coveredAmount + l.subsidyAmount, 0);
  const totalFamily = costLines.reduce((s, l) => s + l.familyPays, 0);
  const installment = totalFamily / 4;

  const choosePayment = (method: PaymentMethod) => {
    setState((prev) => ({ ...prev, paymentMethod: method }));
    if (method === "assistance") setStage("assistance-form");
    else setStage("card");
  };

  useEffect(() => {
    if (stage === "confirmed") {
      const t = setTimeout(() => router.push("/delivered"), 900);
      return () => clearTimeout(t);
    }
  }, [stage, router]);

  const cardValid =
    /^[\d\s]{12,19}$/.test(card.number) && /^\d{2}\/\d{2}$/.test(card.expiry) && /^\d{3,4}$/.test(card.cvc);

  return (
    <ScreenShell>
      <h1 className="text-h1 text-ink">Cost and payment</h1>
      <p className="text-small text-ink-2">
        This is a demo — no real payment is processed. Every number below is
        shown so you can see exactly who pays and why.
      </p>

      <AnimatePresence mode="wait">
        {stage === "review" && (
          <motion.div
            key="review"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22 }}
            className="flex flex-col gap-6"
          >
            <div className="overflow-hidden rounded-card border border-line">
              <table className="w-full text-small">
                <thead>
                  <tr className="border-b border-line bg-surface text-left text-micro uppercase text-ink-3">
                    <th className="px-4 py-3 font-medium">Item</th>
                    <th className="px-4 py-3 text-right font-medium">Sticker</th>
                    <th className="px-4 py-3 text-right font-medium">Covered</th>
                    <th className="px-4 py-3 text-right font-medium">Subsidy</th>
                    <th className="px-4 py-3 text-right font-medium">Family pays</th>
                  </tr>
                </thead>
                <tbody>
                  {costLines.map((line) => (
                    <tr key={line.planItemId} className="border-b border-line last:border-b-0">
                      <td className="px-4 py-3">
                        <div className="flex flex-col gap-1">
                          <span className="text-ink">{line.label}</span>
                          <PayerTag tag={line.payerTag} />
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right tabular-nums text-ink">
                        {line.stickerPrice === 0 ? "Free" : `$${line.stickerPrice.toFixed(0)}`}
                      </td>
                      <td className="px-4 py-3 text-right tabular-nums text-primary-700">
                        {line.coveredAmount > 0 ? `-$${line.coveredAmount.toFixed(0)}` : "—"}
                      </td>
                      <td className="px-4 py-3 text-right tabular-nums text-violet">
                        {line.subsidyAmount > 0 ? `-$${line.subsidyAmount.toFixed(0)}` : "—"}
                      </td>
                      <td className="px-4 py-3 text-right tabular-nums font-medium text-ink">
                        ${line.familyPays.toFixed(0)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="rounded-card bg-primary-50 p-6">
              <div className="flex justify-between text-small text-ink-2">
                <span>Original total</span>
                <span className="tabular-nums">${totalSticker.toFixed(0)}</span>
              </div>
              <div className="mt-1 flex justify-between text-small text-ink-2">
                <span>We knocked this off</span>
                <span className="tabular-nums">-${totalReduced.toFixed(0)}</span>
              </div>
              <div className="my-3 border-t border-primary/20" />
              <div className="flex items-baseline justify-between">
                <span className="text-h2 text-ink">Family owes</span>
                <span className="text-display text-primary-700">
                  <CountUp value={totalFamily} />
                </span>
              </div>
            </div>

            <button
              onClick={() => setStage("method")}
              className="rounded-control bg-primary px-6 py-3.5 font-medium text-white transition-colors duration-150 hover:bg-primary-700"
            >
              Choose how to pay
            </button>
          </motion.div>
        )}

        {stage === "method" && (
          <motion.div
            key="method"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22 }}
            className="flex flex-col gap-3"
          >
            <button
              onClick={() => choosePayment("full")}
              className="rounded-card border border-line bg-white p-5 text-left transition-colors hover:border-primary/40 hover:bg-primary-50"
            >
              <p className="text-h2 text-ink">Pay in full today</p>
              <p className="mt-1 text-display text-ink tabular-nums">${totalFamily.toFixed(0)}</p>
              <p className="mt-1 text-small text-ink-2">One charge now. Nothing else to think about.</p>
            </button>

            <button
              onClick={() => choosePayment("installments")}
              className="relative rounded-card border border-primary/40 bg-primary-50 p-5 text-left"
            >
              <span className="absolute right-5 top-5 rounded-pill bg-primary px-2.5 py-0.5 text-small font-medium text-white">
                Recommended
              </span>
              <p className="text-h2 text-ink">Split into 4 payments</p>
              <p className="mt-1 text-display text-ink tabular-nums">
                ${installment.toFixed(2)} <span className="text-h2 text-ink-2">today</span>
              </p>
              <p className="mt-1 text-small text-ink-2">
                Then ${installment.toFixed(2)} every 2 weeks. No interest, no credit check.
              </p>
            </button>

            <button
              onClick={() => choosePayment("assistance")}
              className="rounded-card border border-line bg-white p-5 text-left transition-colors hover:border-primary/40 hover:bg-primary-50"
            >
              <p className="text-h2 text-ink">Apply for financial assistance</p>
              <p className="mt-1 text-display text-ink tabular-nums">$0 today</p>
              <p className="mt-1 text-small text-ink-2">
                Hospital community benefit fund · ~2 min form. Services start now
                and are not delayed.
              </p>
            </button>
          </motion.div>
        )}

        {stage === "assistance-form" && (
          <motion.div
            key="assistance-form"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22 }}
            className="flex flex-col gap-4"
          >
            <p className="text-h2 text-ink">Financial assistance application</p>
            <p className="text-small text-ink-2">
              This is a mocked, simplified form for the demo.
            </p>
            <label className="flex flex-col gap-1">
              <span className="text-small font-medium text-ink-2">Employment status</span>
              <input
                value={assistanceStep.employment}
                onChange={(e) => setAssistanceStep((p) => ({ ...p, employment: e.target.value }))}
                placeholder="e.g. Retired, part-time, unemployed"
                className="rounded-control border border-line bg-white px-3 py-2.5 focus:border-primary"
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-small font-medium text-ink-2">Household dependents</span>
              <input
                value={assistanceStep.dependents}
                onChange={(e) => setAssistanceStep((p) => ({ ...p, dependents: e.target.value }))}
                className="rounded-control border border-line bg-white px-3 py-2.5 focus:border-primary"
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-small font-medium text-ink-2">Anything else to share? (optional)</span>
              <textarea
                value={assistanceStep.notes}
                onChange={(e) => setAssistanceStep((p) => ({ ...p, notes: e.target.value }))}
                rows={3}
                className="rounded-control border border-line bg-white px-3 py-2.5 focus:border-primary"
              />
            </label>
            <button
              onClick={() => {
                setState((prev) => ({ ...prev, assistanceApproved: true }));
                setStage("confirmed");
              }}
              className="rounded-control bg-primary px-6 py-3.5 font-medium text-white transition-colors duration-150 hover:bg-primary-700"
            >
              Submit application
            </button>
          </motion.div>
        )}

        {stage === "card" && (
          <motion.div
            key="card"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22 }}
            className="flex flex-col gap-4"
          >
            <p className="text-h2 text-ink">
              {state.paymentMethod === "installments"
                ? `Charge $${installment.toFixed(2)} today`
                : `Charge $${totalFamily.toFixed(0)} today`}
            </p>
            <p className="text-small text-ink-2">Demo only — accepts any input, validates format only. Nothing is charged.</p>
            <label className="flex flex-col gap-1">
              <span className="text-small font-medium text-ink-2">Card number</span>
              <input
                value={card.number}
                onChange={(e) => setCard((p) => ({ ...p, number: e.target.value }))}
                placeholder="4242 4242 4242 4242"
                className="rounded-control border border-line bg-white px-3 py-2.5 tabular-nums focus:border-primary"
              />
            </label>
            <div className="flex gap-3">
              <label className="flex flex-1 flex-col gap-1">
                <span className="text-small font-medium text-ink-2">Expiry</span>
                <input
                  value={card.expiry}
                  onChange={(e) => setCard((p) => ({ ...p, expiry: e.target.value }))}
                  placeholder="MM/YY"
                  className="rounded-control border border-line bg-white px-3 py-2.5 tabular-nums focus:border-primary"
                />
              </label>
              <label className="flex flex-1 flex-col gap-1">
                <span className="text-small font-medium text-ink-2">CVC</span>
                <input
                  value={card.cvc}
                  onChange={(e) => setCard((p) => ({ ...p, cvc: e.target.value }))}
                  placeholder="123"
                  className="rounded-control border border-line bg-white px-3 py-2.5 tabular-nums focus:border-primary"
                />
              </label>
            </div>
            <button
              disabled={!cardValid}
              onClick={() => setStage("confirmed")}
              className="rounded-control bg-primary px-6 py-3.5 font-medium text-white transition-colors duration-150 hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Confirm &amp; book (mocked)
            </button>
          </motion.div>
        )}

        {stage === "confirmed" && (
          <motion.div
            key="confirmed"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.25 }}
            className="flex flex-col items-center gap-3 rounded-card bg-primary-50 p-10 text-center"
          >
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
              <motion.path
                d="M5 13l4 4L19 7"
                stroke="currentColor"
                className="text-primary-700"
                strokeWidth={2.5}
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              />
            </svg>
            <p className="text-h2 text-ink">
              {state.paymentMethod === "assistance" ? "Conditionally approved — services proceeding" : "Booked"}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </ScreenShell>
  );
}
