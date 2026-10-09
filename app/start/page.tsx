"use client";

import { useRouter } from "next/navigation";
import ScreenShell from "@/components/ScreenShell";
import { useAppState } from "@/lib/context/app-state";

export default function StartPage() {
  const router = useRouter();
  const { state, setState } = useAppState();
  const p = state.profile;

  const update = (patch: Partial<typeof p>) =>
    setState((prev) => ({ ...prev, profile: { ...prev.profile, ...patch } }));

  const canContinue = p.patientName.trim().length > 0;

  const go = () => {
    if (!canContinue) return;
    router.push("/gathering");
  };

  return (
    <ScreenShell centered>
      <div className="mx-auto flex w-full max-w-sm flex-col items-center gap-6 text-center">
        <p className="text-micro uppercase text-primary">Let's get started</p>
        <h1 className="text-h1 text-ink">What's the patient's name?</h1>

        <div className="flex w-full flex-col gap-3">
          <input
            autoFocus
            value={p.patientName}
            onChange={(e) => update({ patientName: e.target.value })}
            onKeyDown={(e) => e.key === "Enter" && go()}
            placeholder="Full name"
            className="w-full rounded-control border border-line bg-white px-4 py-3.5 text-center text-h2 text-ink placeholder:text-ink-3 focus:border-primary"
          />
          <input
            value={p.patientDob}
            onChange={(e) => update({ patientDob: e.target.value })}
            placeholder="Date of birth (optional)"
            className="w-full rounded-control border border-line bg-white px-4 py-3 text-center text-body text-ink placeholder:text-ink-3 focus:border-primary"
          />
        </div>

        <button
          disabled={!canContinue}
          onClick={go}
          className="w-full rounded-control bg-primary px-6 py-3.5 font-medium text-white transition-colors duration-150 hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Continue
        </button>
      </div>
    </ScreenShell>
  );
}
