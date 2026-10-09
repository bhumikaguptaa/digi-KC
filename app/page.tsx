"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useAppState } from "@/lib/context/app-state";
import { demoProfiles, getDemoProfile } from "@/lib/data/defaults";
import { DemoProfileId } from "@/lib/data/types";
import { useLanguage } from "@/lib/i18n";
import PlanPreview from "@/components/PlanPreview";

const PROFILE_META: Record<DemoProfileId, { badge: string; badgeClass: string }> = {
  maria: { badge: "Has caregiver", badgeClass: "bg-primary-50 text-primary-700" },
  shelter: { badge: "No caregiver · unhoused", badgeClass: "bg-violet-50 text-violet" },
  uninsured: { badge: "Uninsured", badgeClass: "bg-pink-50 text-pink" },
};

export default function Landing() {
  const router = useRouter();
  const { setState, resetDemo } = useAppState();
  const { t } = useLanguage();

  const start = () => {
    setState((prev) => ({ ...prev, startedAt: new Date().toISOString() }));
    router.push("/start");
  };

  const pickProfile = (id: DemoProfileId) => {
    setState(() => ({ ...getDemoProfile(id), startedAt: new Date().toISOString() }));
    router.push("/gathering");
  };

  return (
    <main className="flex min-h-screen w-full flex-col justify-between bg-canvas px-6 pb-10 pt-20 sm:px-12">
      <div className="flex items-center justify-between text-micro uppercase text-ink-3">
        <span>Scanned from discharge packet</span>
        <span>University Health · KC</span>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="grid flex-1 grid-cols-1 items-center gap-10 py-12 lg:grid-cols-[1.05fr_0.95fr]"
      >
        <div className="flex flex-col gap-7">
          <div>
            <p className="mb-3 text-micro uppercase text-primary">{t("landing.eyebrow")}</p>
            <h1 className="max-w-xl text-display text-ink">{t("landing.headline")}</h1>
          </div>

          <p className="max-w-md text-body text-ink-2">{t("landing.subhead")}</p>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <button
              onClick={start}
              className="inline-flex items-center justify-center rounded-control bg-primary px-8 py-3.5 text-center font-medium text-white transition-colors duration-150 hover:bg-primary-700"
            >
              {t("landing.start")}
            </button>
            <span className="text-small text-ink-3">{t("landing.takesTime")}</span>
          </div>

          <div className="flex flex-col gap-3 border-t border-line pt-6">
            <p className="text-micro uppercase text-ink-3">{t("landing.demoPick")}</p>
            <div className="flex flex-col gap-2">
              {demoProfiles.map((p) => (
                <button
                  key={p.id}
                  onClick={() => pickProfile(p.id)}
                  className="flex items-center justify-between gap-4 rounded-card border border-line bg-white px-5 py-4 text-left transition-colors hover:border-primary/40 hover:bg-primary-50"
                >
                  <div className="flex flex-col">
                    <span className="font-medium text-ink">{p.name}</span>
                    <span className="text-small text-ink-2">{p.tagline}</span>
                  </div>
                  <span
                    className={`shrink-0 rounded-pill px-2.5 py-1 text-small font-medium ${PROFILE_META[p.id].badgeClass}`}
                  >
                    {PROFILE_META[p.id].badge}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="hidden justify-center lg:flex">
          <PlanPreview />
        </div>
      </motion.div>

      <div className="flex items-center justify-between text-small text-ink-3">
        <button onClick={resetDemo} className="underline decoration-line underline-offset-4">
          {t("landing.resetDemo")}
        </button>
        <span>{t("landing.noAccount")}</span>
      </div>
    </main>
  );
}
