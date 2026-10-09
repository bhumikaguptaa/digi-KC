import { NeedCategory } from "./types";

export interface ResourceEntry {
  id: string;
  category: NeedCategory;
  name: string;
  type: string;
  distanceMiles: number;
  hourlyRate?: number;
  flatRate?: number;
  seatsHeld?: number;
  servesRural: boolean;
  whyMatch: string;
}

export const resources: ResourceEntry[] = [
  // transport
  {
    id: "t1",
    category: "transport",
    name: "KC RideWell NEMT",
    type: "Non-emergency medical transport",
    distanceMiles: 2.1,
    flatRate: 38,
    servesRural: false,
    whyMatch: "Covered under Medicaid NEMT benefit, same-day booking available",
  },
  {
    id: "t2",
    category: "transport",
    name: "University Health Shuttle",
    type: "Hospital-affiliated shuttle",
    distanceMiles: 0.8,
    flatRate: 0,
    servesRural: false,
    whyMatch: "Free for discharged patients returning for follow-up within 30 days",
  },
  {
    id: "t3",
    category: "transport",
    name: "Able Ride KC",
    type: "Volunteer driver network",
    distanceMiles: 4.5,
    flatRate: 12,
    servesRural: true,
    whyMatch: "Covers outlying Jackson County addresses, drivers background-checked",
  },
  // meals
  {
    id: "m1",
    category: "meals",
    name: "Meals on Wheels KC",
    type: "Home-delivered meals program",
    distanceMiles: 3.0,
    flatRate: 6,
    seatsHeld: 4,
    servesRural: false,
    whyMatch: "Daily delivery, dietary restrictions accommodated, Medicaid HCBS eligible",
  },
  {
    id: "m2",
    category: "meals",
    name: "Harvesters Community Kitchen",
    type: "Food pantry + prepared meals",
    distanceMiles: 1.6,
    flatRate: 0,
    seatsHeld: 12,
    servesRural: false,
    whyMatch: "Walk-in or caregiver pickup, no enrollment wait, sliding-scale",
  },
  {
    id: "m3",
    category: "meals",
    name: "Second Helpings KC",
    type: "Nonprofit meal delivery",
    distanceMiles: 5.2,
    flatRate: 4,
    seatsHeld: 2,
    servesRural: true,
    whyMatch: "Serves rural routes outside I-435 loop twice weekly",
  },
  // household
  {
    id: "h1",
    category: "household",
    name: "HomeCare Partners KC",
    type: "Home care agency",
    distanceMiles: 2.8,
    hourlyRate: 28,
    servesRural: false,
    whyMatch: "Licensed homemaker services, Medicaid HCBS provider network",
  },
  {
    id: "h2",
    category: "household",
    name: "Neighbors Helping Neighbors",
    type: "Volunteer network (faith-based)",
    distanceMiles: 1.2,
    hourlyRate: 0,
    servesRural: false,
    whyMatch: "Congregation-based volunteers, light housekeeping, no cost",
  },
  {
    id: "h3",
    category: "household",
    name: "KU Jayhawk Student Aid Corps",
    type: "Volunteer network (student)",
    distanceMiles: 6.4,
    hourlyRate: 0,
    servesRural: false,
    whyMatch: "Nursing students, supervised household help, weekday availability",
  },
  // equipment
  {
    id: "e1",
    category: "equipment",
    name: "KC Mobility Loan Closet",
    type: "Durable medical equipment loan",
    distanceMiles: 3.5,
    flatRate: 0,
    servesRural: false,
    whyMatch: "Free short-term loan of walkers, shower chairs, bed rails",
  },
  {
    id: "e2",
    category: "equipment",
    name: "MedSupply Direct",
    type: "DME retailer",
    distanceMiles: 2.0,
    flatRate: 65,
    servesRural: false,
    whyMatch: "Same-day delivery, Medicaid HCBS reimbursable purchase",
  },
  // checkin / respite
  {
    id: "c1",
    category: "checkin",
    name: "University Health Care Coordinator Line",
    type: "Care management check-in",
    distanceMiles: 0,
    flatRate: 0,
    servesRural: false,
    whyMatch: "Daily call for first 72 hours, included in discharge plan",
  },
  {
    id: "c2",
    category: "checkin",
    name: "Independence Respite Services",
    type: "Respite care agency",
    distanceMiles: 3.1,
    hourlyRate: 22,
    servesRural: false,
    whyMatch: "Short daily visits, Medicaid HCBS respite benefit eligible",
  },
  {
    id: "c3",
    category: "checkin",
    name: "Front Porch Neighbors",
    type: "Volunteer network (neighborhood)",
    distanceMiles: 0.5,
    hourlyRate: 0,
    servesRural: true,
    whyMatch: "Nearby volunteers for daily wellness checks, rural routes included",
  },
];

export function getResourcesForCategory(category: NeedCategory): ResourceEntry[] {
  return resources.filter((r) => r.category === category);
}
