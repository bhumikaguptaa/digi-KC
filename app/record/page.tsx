"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ScreenShell from "@/components/ScreenShell";
import { useAppState } from "@/lib/context/app-state";
import { demoRecord } from "@/lib/data/defaults";

function Field({
  label,
  value,
  editing,
  onChange,
  highlight,
}: {
  label: string;
  value: string;
  editing: boolean;
  onChange: (v: string) => void;
  highlight?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1 border-b border-line py-3 last:border-b-0">
      <span className="text-micro uppercase text-ink-3">{label}</span>
      {editing ? (
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="rounded-control border border-line bg-white px-3 py-2 text-body text-ink focus:border-primary"
        />
      ) : (
        <span className={`text-body ${highlight ? "font-medium text-alarm" : "text-ink"}`}>
          {value}
        </span>
      )}
    </div>
  );
}

export default function RecordPage() {
  const router = useRouter();
  const { state, setState } = useAppState();
  const record = state.record ?? demoRecord;
  const [editing, setEditing] = useState(false);
  const [local, setLocal] = useState(record);

  const save = (patch: Partial<typeof local>) => setLocal((prev) => ({ ...prev, ...patch }));

  const confirm = () => {
    setState((prev) => ({ ...prev, record: local, recordConfirmed: true }));
    router.push("/accessibility");
  };

  return (
    <ScreenShell>
      <div>
        <p className="mb-2 text-micro uppercase text-primary">Confirm the record</p>
        <h1 className="text-h1 text-ink">Here's what we found</h1>
        <p className="mt-2 text-small text-ink-2">
          Check this over — it's what we'll use to build the plan.
        </p>
      </div>

      <div className="rounded-card border border-line bg-surface px-5">
        <Field label="Name" value={`${local.name}, ${local.age}`} editing={editing} onChange={() => {}} />
        <Field
          label="Discharged"
          value={`${local.dischargedAt} — ${local.facility}`}
          editing={false}
          onChange={() => {}}
        />
        <Field
          label="Primary diagnosis"
          value={local.diagnosis}
          editing={editing}
          onChange={(v) => save({ diagnosis: v })}
        />
        <Field label="Mobility" value={local.mobility} editing={editing} onChange={(v) => save({ mobility: v })} />
        <Field
          label="Medications"
          value={`${local.medicationCount} active${local.elevatedFallRisk ? " (incl. anticoagulant — fall risk elevated)" : ""}`}
          editing={false}
          onChange={() => {}}
          highlight={local.elevatedFallRisk}
        />
        <Field
          label="Follow-ups"
          value={local.followUps.map((f) => `${f.label} ${f.when}`).join(" · ")}
          editing={false}
          onChange={() => {}}
        />
        <Field label="Insurance" value={local.insurance} editing={editing} onChange={(v) => save({ insurance: v })} />
        <Field
          label="Living situation"
          value={local.livingSituation}
          editing={editing}
          onChange={(v) => save({ livingSituation: v })}
        />
      </div>

      <button
        onClick={() => setEditing((e) => !e)}
        className="w-fit text-small text-ink-2 underline decoration-line underline-offset-4 transition-colors hover:text-ink"
      >
        {editing ? "Done editing" : "Something look wrong?"}
      </button>

      <button
        onClick={confirm}
        className="rounded-control bg-primary px-6 py-3.5 font-medium text-white transition-colors duration-150 hover:bg-primary-700"
      >
        This is right — continue
      </button>
    </ScreenShell>
  );
}
