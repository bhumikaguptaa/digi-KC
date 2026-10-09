# First 72

A caregiver support app for the first 72 hours after a hospital discharge. Built for the Digital Health KC hackathon.

## The pitch

"Care doesn't end at discharge" — but the non-clinical support a patient needs the moment they get home (rides, meals, household help, a check-in) is scattered across a dozen phone numbers nobody has. First 72 pulls the hospital record automatically, asks the patient a few branching questions about their actual situation, and turns it into a scheduled, priced, matched 3-day plan in under 10 minutes — then tracks whether the help that was promised actually showed up.

## The flow

1. **Landing** — scanned from the discharge packet via QR code.
2. **Patient identification** — just a name (and optional DOB). One field, one button.
3. **Record gathering** — a simulated pull of the hospital record, resolving item by item.
4. **Record confirmation** — the patient confirms what was found instead of retyping it from memory.
5. **Accessibility** — larger text, high-contrast mode, color-blind-safe labeling, and a no-smartphone path all actually change the UI.
6. **Needs questionnaire** — branches at question one ("Is there someone who can help you at home?") into a has-caregiver path or a no-caregiver path, the latter raising priority and assigning a care coordinator as plan owner. Ends with a household-income band (never an exact figure, never used as a proxy for anything else) used only to check what someone qualifies for.
7. **Eligibility** — Missouri Medicaid HCBS coverage shown honestly, including what's *not* reliably covered (live-in caregiver rent/food, cash stipends) and a note that coverage is state-by-state.
8. **72-hour planner** — the centerpiece: a Day 1/2/3 grid auto-built from the questionnaire.
9. **Resource matching** — each need matched to 2–3 real-looking Kansas City resources, ranked, with a visible "why this match" and a priority score for patients with higher need.
10. **Cost & payment** — every line item shows sticker price, what's covered, what's subsidized (and by whom), and what's actually owed. Then a real choice of how to pay: in full, split into 4 interest-free installments, or apply for financial assistance (which never delays the services themselves). Mocked card entry; nothing is charged.
11. **Plan delivery** — attached to the discharge paperwork, or simulated as a text-message thread for patients without a smartphone.
12. **Daily check-in** — the key differentiator: tracks *access offered* vs. *access realized*, and a "No" on any item triggers a re-match instead of silently closing out.

A persistent emergency button (911 / care coordinator / emergency contact) is available on every screen.

## Payment model

Every cost line shows what's covered by Medicaid HCBS or insurance, what's subsidized (named by source — hospital community benefit fund, nonprofit grant, or donated volunteer hours), and what's owed. Three payment paths make clear that ability to pay never gates the services themselves. All payment is mocked; no real transaction is ever processed.

## Design system

"Clinical calm" — white canvas, one saturated teal accent, violet and pink reserved for decisions and accountability respectively, alarm red used only for the emergency button. No gradients, no offset shadows, 1px hairlines only. Inter for all UI text; monospace nowhere except tabular numerals in the cost table. Motion (Framer Motion) is purposeful and subtle — ease-out-quint, 180–400ms, respecting `prefers-reduced-motion` throughout.

## Stack

Next.js (App Router) + TypeScript + Tailwind CSS + Framer Motion. No backend, no database, no auth — all state lives in React state and `localStorage`. No external API calls, so nothing can fail live at the demo table.

## Running it

```bash
npm install
npm run dev
```

Deploys to Vercel with zero configuration.

## Demo

Use "Demo: pre-fill example patient" on the landing page for the golden path (Linda Marsh, 72, discharged after a hip fracture, on Missouri Medicaid, daughter as caregiver). A "Reset demo" link clears all state for the next walkthrough.
