"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import ScreenShell from "@/components/ScreenShell";
import ProgressBar from "@/components/ProgressBar";
import { useAppState } from "@/lib/context/app-state";
import {
  CaregiverAvailability,
  IncomeBand,
  InsuranceStatus,
  NeedsAnswers,
} from "@/lib/data/types";

type Choice = { value: string; label: string };

const CANT_HELP_OPTIONS: Choice[] = [
  { value: "driving", label: "Driving" },
  { value: "lifting", label: "Lifting or mobility help" },
  { value: "cooking", label: "Cooking" },
  { value: "overnight", label: "Overnight" },
  { value: "medical", label: "Medical tasks" },
  { value: "nothing", label: "Nothing — they can cover everything" },
];

const NEEDS_OPTIONS: Choice[] = [
  { value: "rides", label: "Rides to appointments" },
  { value: "meals", label: "Meals" },
  { value: "household", label: "Household help" },
  { value: "equipment", label: "Equipment" },
  { value: "checkin", label: "Someone to check in" },
];

const INSURANCE_OPTIONS: { value: InsuranceStatus; label: string }[] = [
  { value: "medicaid", label: "Medicaid" },
  { value: "private", label: "Private insurance" },
  { value: "medicare", label: "Medicare" },
  { value: "uninsured", label: "Uninsured" },
  { value: "unsure", label: "Not sure" },
];

const INCOME_OPTIONS: { value: IncomeBand; label: string }[] = [
  { value: "under-1300", label: "Under $1,300" },
  { value: "1300-2200", label: "$1,300 – $2,200" },
  { value: "2200-3500", label: "$2,200 – $3,500" },
  { value: "over-3500", label: "Over $3,500" },
  { value: "rather-not-say", label: "I'd rather not say" },
];

type StepId =
  | "branch"
  | "a-contact"
  | "a-availability"
  | "a-cant-help"
  | "a-needs"
  | "b-nearby"
  | "b-mobility"
  | "b-emergency"
  | "b-needs"
  | "b-volunteer"
  | "income-household"
  | "income-amount"
  | "insurance-zip";

function stepsForBranch(branch: NeedsAnswers["caregiverBranch"]): StepId[] {
  if (branch === "no-caregiver") {
    return [
      "branch",
      "b-nearby",
      "b-mobility",
      "b-emergency",
      "b-needs",
      "b-volunteer",
      "income-household",
      "income-amount",
      "insurance-zip",
    ];
  }
  return [
    "branch",
    "a-contact",
    "a-availability",
    "a-cant-help",
    "a-needs",
    "income-household",
    "income-amount",
    "insurance-zip",
  ];
}

export default function NeedsPage() {
  const router = useRouter();
  const { state, setState } = useAppState();
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const n = state.needs;

  const steps = useMemo(() => stepsForBranch(n.caregiverBranch), [n.caregiverBranch]);
  const stepId = steps[index];

  const update = (patch: Partial<NeedsAnswers>) =>
    setState((prev) => ({ ...prev, needs: { ...prev.needs, ...patch } }));

  const goNext = () => {
    if (index < steps.length - 1) {
      setDirection(1);
      setIndex(index + 1);
    } else {
      router.push("/eligibility");
    }
  };
  const goBack = () => {
    if (index > 0) {
      setDirection(-1);
      setIndex(index - 1);
    } else {
      router.push("/accessibility");
    }
  };

  const toggleMulti = (key: "caregiverCantHelpWith" | "needsSelected", value: string) => {
    const current = n[key];
    if (value === "nothing") {
      update({ [key]: ["nothing"] } as any);
      return;
    }
    const withoutNothing = current.filter((v) => v !== "nothing");
    const has = withoutNothing.includes(value);
    update({
      [key]: has ? withoutNothing.filter((v) => v !== value) : [...withoutNothing, value],
    } as any);
  };

  const OptionButton = ({
    selected,
    onClick,
    children,
  }: {
    selected: boolean;
    onClick: () => void;
    children: React.ReactNode;
  }) => (
    <button
      onClick={onClick}
      className={`rounded-control border px-5 py-3.5 text-left transition-colors ${
        selected
          ? "border-primary/50 bg-primary-50 text-ink"
          : "border-line bg-white text-ink hover:bg-surface"
      }`}
    >
      {children}
    </button>
  );

  let canNext = true;
  let title = "";
  let body: React.ReactNode = null;

  switch (stepId) {
    case "branch":
      canNext = !!n.caregiverBranch;
      title = "Is there someone who can help you at home?";
      body = (
        <div className="flex flex-col gap-3">
          <OptionButton
            selected={n.caregiverBranch === "has-caregiver" && n.noCaregiverChoice === "yes-family"}
            onClick={() => update({ caregiverBranch: "has-caregiver", noCaregiverChoice: "yes-family" })}
          >
            Yes, a family member or friend
          </OptionButton>
          <OptionButton
            selected={n.caregiverBranch === "has-caregiver" && n.noCaregiverChoice === "yes-paid"}
            onClick={() => update({ caregiverBranch: "has-caregiver", noCaregiverChoice: "yes-paid" })}
          >
            Yes, a paid caregiver
          </OptionButton>
          <OptionButton
            selected={n.caregiverBranch === "no-caregiver" && n.noCaregiverChoice === "no-one"}
            onClick={() => update({ caregiverBranch: "no-caregiver", noCaregiverChoice: "no-one" })}
          >
            No one right now
          </OptionButton>
          <OptionButton
            selected={n.caregiverBranch === "no-caregiver" && n.noCaregiverChoice === "not-sure"}
            onClick={() => update({ caregiverBranch: "no-caregiver", noCaregiverChoice: "not-sure" })}
          >
            I'm not sure yet
          </OptionButton>
        </div>
      );
      break;

    case "a-contact":
      canNext = n.caregiverName.trim().length > 0 && n.caregiverPhone.trim().length > 0;
      title = "Who is it, and how do we reach them?";
      body = (
        <div className="flex flex-col gap-3 rounded-card border border-line bg-surface p-5">
          <label className="flex flex-col gap-1">
            <span className="text-small font-medium text-ink-2">Name</span>
            <input
              value={n.caregiverName}
              onChange={(e) => update({ caregiverName: e.target.value })}
              className="rounded-control border border-line bg-white px-3 py-2.5 focus:border-primary"
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-small font-medium text-ink-2">Phone number</span>
            <input
              value={n.caregiverPhone}
              onChange={(e) => update({ caregiverPhone: e.target.value })}
              className="rounded-control border border-line bg-white px-3 py-2.5 focus:border-primary"
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-small font-medium text-ink-2">Relationship</span>
            <input
              value={n.caregiverRelationship}
              onChange={(e) => update({ caregiverRelationship: e.target.value })}
              placeholder="e.g. Daughter, Neighbor"
              className="rounded-control border border-line bg-white px-3 py-2.5 focus:border-primary"
            />
          </label>
        </div>
      );
      break;

    case "a-availability": {
      canNext = !!n.caregiverAvailability;
      title = "How often can they be there?";
      const opts: { value: CaregiverAvailability; label: string }[] = [
        { value: "living-with", label: "Living with me" },
        { value: "daily", label: "Daily" },
        { value: "few-times-week", label: "A few times a week" },
        { value: "occasionally", label: "Occasionally" },
        { value: "phone-only", label: "Only by phone" },
      ];
      body = (
        <div className="flex flex-col gap-3">
          {opts.map((o) => (
            <OptionButton
              key={o.value}
              selected={n.caregiverAvailability === o.value}
              onClick={() => update({ caregiverAvailability: o.value })}
            >
              {o.label}
            </OptionButton>
          ))}
        </div>
      );
      break;
    }

    case "a-cant-help":
      canNext = n.caregiverCantHelpWith.length > 0;
      title = "What can't they help with?";
      body = (
        <div className="flex flex-col gap-3">
          {CANT_HELP_OPTIONS.map((o) => (
            <OptionButton
              key={o.value}
              selected={n.caregiverCantHelpWith.includes(o.value)}
              onClick={() => toggleMulti("caregiverCantHelpWith", o.value)}
            >
              {o.label}
            </OptionButton>
          ))}
        </div>
      );
      break;

    case "a-needs":
    case "b-needs":
      canNext = n.needsSelected.length > 0;
      title = "What do you need in the next 3 days?";
      body = (
        <div className="flex flex-col gap-3">
          {NEEDS_OPTIONS.map((o) => (
            <OptionButton
              key={o.value}
              selected={n.needsSelected.includes(o.value)}
              onClick={() => toggleMulti("needsSelected", o.value)}
            >
              {o.label}
            </OptionButton>
          ))}
        </div>
      );
      break;

    case "b-nearby":
      canNext = !!n.nearbySupport;
      title = "Is there anyone nearby at all, even occasionally?";
      body = (
        <div className="flex flex-col gap-3">
          {[
            { value: "neighbor", label: "A neighbor" },
            { value: "church", label: "Someone from church or community" },
            { value: "nobody", label: "Nobody" },
          ].map((o) => (
            <OptionButton
              key={o.value}
              selected={n.nearbySupport === o.value}
              onClick={() => update({ nearbySupport: o.value as any })}
            >
              {o.label}
            </OptionButton>
          ))}
        </div>
      );
      break;

    case "b-mobility":
      canNext = !!n.canMoveSafely;
      title = "Can you get around your home safely on your own?";
      body = (
        <div className="flex flex-col gap-3">
          {[
            { value: "freely", label: "Yes, freely" },
            { value: "difficulty", label: "With difficulty" },
            { value: "needs-help", label: "I need help standing or walking" },
          ].map((o) => (
            <OptionButton
              key={o.value}
              selected={n.canMoveSafely === o.value}
              onClick={() => update({ canMoveSafely: o.value as any })}
            >
              {o.label}
            </OptionButton>
          ))}
        </div>
      );
      break;

    case "b-emergency":
      canNext = n.emergencyContactName.trim().length > 0 && n.emergencyContactPhone.trim().length > 0;
      title = "Who should we call in an emergency?";
      body = (
        <div className="flex flex-col gap-3 rounded-card border border-line bg-surface p-5">
          <label className="flex flex-col gap-1">
            <span className="text-small font-medium text-ink-2">Name</span>
            <input
              value={n.emergencyContactName}
              onChange={(e) => update({ emergencyContactName: e.target.value })}
              className="rounded-control border border-line bg-white px-3 py-2.5 focus:border-primary"
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-small font-medium text-ink-2">Phone number</span>
            <input
              value={n.emergencyContactPhone}
              onChange={(e) => update({ emergencyContactPhone: e.target.value })}
              className="rounded-control border border-line bg-white px-3 py-2.5 focus:border-primary"
            />
          </label>
        </div>
      );
      break;

    case "b-volunteer":
      canNext = !!n.acceptsVolunteer;
      title = "Would you accept a volunteer coming to your home?";
      body = (
        <div className="flex flex-col gap-3">
          {[
            { value: "yes", label: "Yes" },
            { value: "prefer-not", label: "I'd prefer not to" },
            { value: "deliveries-only", label: "Only for deliveries" },
          ].map((o) => (
            <OptionButton
              key={o.value}
              selected={n.acceptsVolunteer === o.value}
              onClick={() => update({ acceptsVolunteer: o.value as any })}
            >
              {o.label}
            </OptionButton>
          ))}
        </div>
      );
      break;

    case "income-household":
      canNext = !!n.householdSize;
      title = "How many people live in your household?";
      body = (
        <div className="grid grid-cols-4 gap-3">
          {(["1", "2", "3", "4+"] as const).map((v) => (
            <button
              key={v}
              onClick={() => update({ householdSize: v })}
              className={`rounded-control border py-4 text-center font-medium transition-colors ${
                n.householdSize === v
                  ? "border-primary/50 bg-primary-50 text-ink"
                  : "border-line bg-white text-ink hover:bg-surface"
              }`}
            >
              {v}
            </button>
          ))}
        </div>
      );
      break;

    case "income-amount":
      canNext = !!n.incomeBand;
      title = "Roughly what is your monthly household income?";
      body = (
        <div className="flex flex-col gap-4">
          <p className="rounded-control bg-surface px-4 py-3 text-small text-ink-2">
            To find you free and reduced-cost options, it helps to know your
            household situation. This is only used to check what you qualify
            for.
          </p>
          <div className="flex flex-col gap-3">
            {INCOME_OPTIONS.map((o) => (
              <OptionButton
                key={o.value}
                selected={n.incomeBand === o.value}
                onClick={() => update({ incomeBand: o.value })}
              >
                {o.label}
              </OptionButton>
            ))}
          </div>
          <div className="flex items-center gap-2 text-small text-ink-3">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <rect x="5" y="11" width="14" height="9" rx="1.5" />
              <path d="M8 11V7a4 4 0 118 0v4" strokeLinecap="round" />
            </svg>
            Not shared with your hospital or insurer.
          </div>
        </div>
      );
      break;

    case "insurance-zip":
      canNext = !!n.insurance && n.zipCode.trim().length === 5;
      title = "Insurance and location";
      body = (
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-3">
            {INSURANCE_OPTIONS.map((o) => (
              <OptionButton
                key={o.value}
                selected={n.insurance === o.value}
                onClick={() => update({ insurance: o.value })}
              >
                {o.label}
              </OptionButton>
            ))}
          </div>
          <label className="flex flex-col gap-1">
            <span className="text-small font-medium text-ink-2">Zip code</span>
            <input
              value={n.zipCode}
              onChange={(e) => update({ zipCode: e.target.value.replace(/[^0-9]/g, "").slice(0, 5) })}
              inputMode="numeric"
              className="rounded-control border border-line bg-white px-3 py-2.5 focus:border-primary"
            />
          </label>
          <p className="rounded-control bg-surface px-4 py-3 text-small text-ink-2">
            We only ask what's needed to find you help. Zip code is used only
            to match nearby services — never to judge income.
          </p>
        </div>
      );
      break;
  }

  return (
    <ScreenShell>
      <div className="flex items-center gap-3">
        <button
          onClick={goBack}
          aria-label="Back"
          className="flex h-9 w-9 items-center justify-center rounded-control text-ink-2 transition-colors hover:bg-surface"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <ProgressBar step={index + 1} total={steps.length} />
      </div>
      <span className="text-micro uppercase text-ink-3">
        Question {index + 1} of {steps.length}
      </span>

      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={stepId}
          custom={direction}
          initial={{ opacity: 0, x: direction > 0 ? 24 : -24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: direction > 0 ? -24 : 24 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col gap-5"
        >
          <h1 className="text-h1 text-ink">{title}</h1>
          {body}
        </motion.div>
      </AnimatePresence>

      <button
        disabled={!canNext}
        onClick={goNext}
        className="rounded-control bg-primary px-6 py-3.5 font-medium text-white transition-colors duration-150 hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-40"
      >
        {index === steps.length - 1 ? "See what you qualify for" : "Next"}
      </button>
    </ScreenShell>
  );
}
