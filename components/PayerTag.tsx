import { PayerTag as PayerTagType } from "@/lib/data/types";

const CONFIG: Record<PayerTagType, { label: string; className: string }> = {
  medicaid: { label: "Medicaid HCBS", className: "bg-primary-50 text-primary-700" },
  insurance: { label: "Insurance", className: "bg-primary-50 text-primary-700" },
  subsidized: { label: "Subsidized", className: "bg-violet-50 text-violet" },
  selfpay: { label: "Self-pay", className: "bg-surface-2 text-ink-2" },
};

export default function PayerTag({ tag }: { tag: PayerTagType }) {
  const cfg = CONFIG[tag];
  return (
    <span className={`inline-block rounded-pill px-2.5 py-0.5 text-small font-medium ${cfg.className}`}>
      {cfg.label}
    </span>
  );
}
