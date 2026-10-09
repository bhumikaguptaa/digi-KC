import { NeedsAnswers, PlanItem, ResourceMatch, CostLine, PayerTag } from "./data/types";
import { getResourcesForCategory } from "./data/resources";

export const TIME_SLOTS = [
  "7:00 AM",
  "8:00 AM",
  "9:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "1:00 PM",
  "2:00 PM",
  "3:00 PM",
  "4:00 PM",
  "5:00 PM",
  "5:30 PM",
  "6:00 PM",
  "7:00 PM",
];

function generateUnhousedPlanItems(): PlanItem[] {
  return [
    {
      id: "shelter-bed-d1",
      day: 1,
      time: "2:00 PM",
      label: "Guaranteed shelter bed check-in",
      category: "shelter",
      status: "scheduled",
    },
    { id: "meal-d1", day: 1, time: "5:30 PM", label: "Meal provided", category: "meals", status: "scheduled" },
    {
      id: "shelter-bed-d2",
      day: 2,
      time: "9:00 AM",
      label: "Shelter bed held",
      category: "shelter",
      status: "scheduled",
    },
    { id: "meal-d2-am", day: 2, time: "12:00 PM", label: "Meal provided", category: "meals", status: "scheduled" },
    { id: "meal-d2-pm", day: 2, time: "5:30 PM", label: "Meal provided", category: "meals", status: "scheduled" },
    {
      id: "shelter-bed-d3",
      day: 3,
      time: "9:00 AM",
      label: "Shelter bed held",
      category: "shelter",
      status: "scheduled",
    },
    { id: "meal-d3", day: 3, time: "5:30 PM", label: "Meal provided", category: "meals", status: "scheduled" },
  ];
}

export function generatePlanItems(needs: NeedsAnswers): PlanItem[] {
  if (needs.housingStatus === "unhoused") {
    return generateUnhousedPlanItems();
  }

  const items: PlanItem[] = [];
  const selected = new Set(needs.needsSelected);

  if (selected.has("rides")) {
    items.push({
      id: "ride-woundcare",
      day: 2,
      time: "10:00 AM",
      label: "Ride to wound care follow-up",
      category: "transport",
      status: "scheduled",
    });
  }

  if (selected.has("meals")) {
    items.push(
      { id: "meal-d1", day: 1, time: "5:30 PM", label: "Dinner delivered", category: "meals", status: "scheduled" },
      { id: "meal-d2", day: 2, time: "5:30 PM", label: "Dinner delivered", category: "meals", status: "scheduled" },
      { id: "meal-d3", day: 3, time: "5:30 PM", label: "Dinner delivered", category: "meals", status: "scheduled" }
    );
  }

  if (selected.has("household")) {
    items.push({
      id: "household-help",
      day: 2,
      time: "1:00 PM",
      label: "Help with dishes and laundry",
      category: "household",
      status: "scheduled",
    });
  }

  if (selected.has("equipment")) {
    items.push({
      id: "equipment-delivery",
      day: 1,
      time: "11:00 AM",
      label: "Equipment delivered: walker, shower chair",
      category: "equipment",
      status: "scheduled",
    });
  }

  if (selected.has("checkin") || needs.caregiverBranch === "no-caregiver") {
    items.push(
      { id: "checkin-d1", day: 1, time: "6:00 PM", label: "Wellness check-in call", category: "checkin", status: "scheduled" },
      { id: "checkin-d2", day: 2, time: "6:00 PM", label: "Wellness check-in call", category: "checkin", status: "scheduled" },
      { id: "checkin-d3", day: 3, time: "6:00 PM", label: "Wellness check-in call", category: "checkin", status: "scheduled" }
    );
  }

  if (needs.canMoveSafely === "needs-help" || needs.caregiverCantHelpWith.includes("lifting")) {
    items.push({
      id: "bathing-assist",
      day: 1,
      time: "9:00 AM",
      label: "Assisted bathing visit",
      category: "household",
      status: "scheduled",
    });
  }

  return items.sort((a, b) => a.day - b.day || a.time.localeCompare(b.time));
}

export function applyTimeOverrides(items: PlanItem[], overrides: Record<string, string>): PlanItem[] {
  return items.map((item) => (overrides[item.id] ? { ...item, time: overrides[item.id] } : item));
}

export function matchResourcesForItem(item: PlanItem, needs: NeedsAnswers): ResourceMatch[] {
  const candidates = getResourcesForCategory(item.category);
  const zipIsRural = needs.zipCode.startsWith("640") === false;

  const priorityReasons: string[] = [];
  let priorityScore = 50;

  if (needs.caregiverBranch === "no-caregiver") {
    priorityScore += 20;
    priorityReasons.push("No regular caregiver");
  }
  if (needs.housingStatus === "unhoused") {
    priorityScore += 20;
    priorityReasons.push("No fixed address");
  }
  if (needs.canMoveSafely === "needs-help") {
    priorityScore += 15;
    priorityReasons.push("Needs help standing or walking");
  }
  if (needs.insurance === "uninsured") {
    priorityScore += 15;
    priorityReasons.push("Uninsured");
  }
  if (needs.incomeBand === "under-1300") {
    priorityScore += 10;
    priorityReasons.push("Lower household income band");
  }
  if (needs.caregiverAvailability === "phone-only" || needs.caregiverAvailability === "occasionally") {
    priorityScore += 10;
    priorityReasons.push("Caregiver rarely available in person");
  }

  priorityScore = Math.min(priorityScore, 100);

  const ranked = candidates
    .filter((r) => !zipIsRural || r.servesRural || true)
    .slice(0, 3)
    .map((r, idx) => ({
      id: `${item.id}-${r.id}`,
      planItemId: item.id,
      name: r.name,
      type: r.type,
      distanceMiles: r.distanceMiles,
      rank: idx + 1,
      whyMatch: r.whyMatch,
      hourlyRate: r.hourlyRate,
      flatRate: r.flatRate,
      seatsHeld: r.seatsHeld,
      priorityScore,
      priorityReasons,
    }));

  return ranked;
}

function resourceBaseCost(r: ResourceMatch): number {
  if (r.flatRate !== undefined) return r.flatRate;
  if (r.hourlyRate !== undefined) return r.hourlyRate * 2;
  return 0;
}

const HCBS_CATEGORY_COVERAGE: Record<string, number> = {
  transport: 0.8,
  meals: 0.7,
  household: 0.75,
  equipment: 0.9,
  checkin: 0.6,
  mobility: 0.75,
  shelter: 0.5,
};

export function buildCostLine(
  item: PlanItem,
  topMatch: ResourceMatch,
  insurance: NeedsAnswers["insurance"]
): CostLine {
  const sticker = resourceBaseCost(topMatch);
  let payerTag: PayerTag = "selfpay";
  let covered = 0;
  let subsidy = 0;
  let subsidySource = "";

  if (insurance === "medicaid") {
    payerTag = "medicaid";
    covered = Math.round(sticker * (HCBS_CATEGORY_COVERAGE[item.category] ?? 0.7));
  } else if (insurance === "private" || insurance === "medicare") {
    payerTag = "insurance";
    covered = Math.round(sticker * 0.5);
  }

  const remainderAfterCoverage = sticker - covered;

  if (remainderAfterCoverage > 0) {
    if (topMatch.flatRate === 0 || topMatch.hourlyRate === 0) {
      subsidy = remainderAfterCoverage;
      subsidySource = "Donated volunteer hours";
      payerTag = insurance === "medicaid" ? "medicaid" : "subsidized";
    } else if (insurance === "uninsured" || insurance === "unsure") {
      subsidy = Math.round(remainderAfterCoverage * 0.6);
      subsidySource = "Hospital community benefit fund";
      payerTag = "subsidized";
    } else if (remainderAfterCoverage > 15) {
      subsidy = Math.round(remainderAfterCoverage * 0.3);
      subsidySource = "Nonprofit grant (Harvesters / United Way KC)";
    }
  }

  const familyPays = Math.max(0, sticker - covered - subsidy);

  return {
    planItemId: item.id,
    label: item.label,
    stickerPrice: sticker,
    coveredAmount: covered,
    payerTag,
    subsidyAmount: subsidy,
    subsidySource,
    familyPays,
  };
}
