export type FillerRole = "caregiver" | "patient" | "staff";

export type InsuranceStatus =
  | "medicaid"
  | "private"
  | "medicare"
  | "uninsured"
  | "unsure";

export type NeedCategory =
  | "transport"
  | "meals"
  | "household"
  | "equipment"
  | "checkin"
  | "mobility";

export interface Profile {
  fillerRole: FillerRole | null;
  noCaregiverAvailable: boolean;
  relationship: string;
  patientName: string;
  patientAge: string;
  patientDob: string;
}

export interface PatientRecord {
  name: string;
  age: number;
  dischargedAt: string;
  facility: string;
  diagnosis: string;
  mobility: string;
  medicationCount: number;
  elevatedFallRisk: boolean;
  followUps: { label: string; when: string }[];
  insurance: string;
  livingSituation: string;
}

export type CaregiverBranch = "has-caregiver" | "no-caregiver" | null;

export type CaregiverAvailability =
  | "living-with"
  | "daily"
  | "few-times-week"
  | "occasionally"
  | "phone-only"
  | null;

export type IncomeBand =
  | "under-1300"
  | "1300-2200"
  | "2200-3500"
  | "over-3500"
  | "rather-not-say"
  | null;

export type PaymentMethod = "full" | "installments" | "assistance" | null;

export interface AccessibilityPrefs {
  largerText: boolean;
  highContrast: boolean;
  colorBlindSafe: boolean;
  readAloud: boolean;
  noSmartphone: boolean;
}

export interface NeedsAnswers {
  // Q1 — branch selector
  caregiverBranch: CaregiverBranch;
  noCaregiverChoice: "yes-family" | "yes-paid" | "no-one" | "not-sure" | null;

  // Branch A — has caregiver
  caregiverName: string;
  caregiverPhone: string;
  caregiverRelationship: string;
  caregiverAvailability: CaregiverAvailability;
  caregiverCantHelpWith: string[];

  // Branch B — no caregiver
  nearbySupport: "neighbor" | "church" | "nobody" | null;
  canMoveSafely: "freely" | "difficulty" | "needs-help" | null;
  acceptsVolunteer: "yes" | "prefer-not" | "deliveries-only" | null;

  // Shared
  needsSelected: string[];
  emergencyContactName: string;
  emergencyContactPhone: string;
  zipCode: string;
  insurance: InsuranceStatus | null;
  householdSize: "1" | "2" | "3" | "4+" | null;
  incomeBand: IncomeBand;
}

export interface PlanItem {
  id: string;
  day: 1 | 2 | 3;
  time: string;
  label: string;
  category: NeedCategory;
  status: "scheduled" | "confirmed" | "needs-attention";
}

export interface ResourceMatch {
  id: string;
  planItemId: string;
  name: string;
  type: string;
  distanceMiles: number;
  rank: number;
  whyMatch: string;
  hourlyRate?: number;
  flatRate?: number;
  seatsHeld?: number;
  priorityScore: number;
  priorityReasons: string[];
}

export type PayerTag = "medicaid" | "insurance" | "subsidized" | "selfpay";

export interface CostLine {
  planItemId: string;
  label: string;
  stickerPrice: number;
  coveredAmount: number;
  payerTag: PayerTag;
  subsidyAmount: number;
  subsidySource: string;
  familyPays: number;
}

export interface CheckInEntry {
  day: 1 | 2 | 3;
  planItemId: string;
  status: "pending" | "yes" | "no" | "partly";
}

export interface AppState {
  profile: Profile;
  accessibility: AccessibilityPrefs;
  needs: NeedsAnswers;
  checkIns: CheckInEntry[];
  startedAt: string | null;
  record: PatientRecord | null;
  recordConfirmed: boolean;
  paymentMethod: PaymentMethod;
  assistanceApproved: boolean;
}
