import { AppState, DemoProfileId, PatientRecord } from "./types";

export const emptyState: AppState = {
  profile: {
    fillerRole: null,
    noCaregiverAvailable: false,
    relationship: "",
    patientName: "",
    patientAge: "",
    patientDob: "",
  },
  accessibility: {
    largerText: false,
    highContrast: false,
    colorBlindSafe: false,
    readAloud: false,
    noSmartphone: false,
  },
  needs: {
    caregiverBranch: null,
    noCaregiverChoice: null,
    caregiverName: "",
    caregiverPhone: "",
    caregiverRelationship: "",
    caregiverAvailability: null,
    caregiverCantHelpWith: [],
    nearbySupport: null,
    canMoveSafely: null,
    acceptsVolunteer: null,
    needsSelected: [],
    emergencyContactName: "",
    emergencyContactPhone: "",
    zipCode: "64108",
    insurance: null,
    householdSize: null,
    incomeBand: null,
    housingStatus: null,
  },
  checkIns: [],
  startedAt: null,
  record: null,
  recordConfirmed: false,
  paymentMethod: null,
  assistanceApproved: false,
  timeOverrides: {},
  demoProfileId: null,
};

interface DemoProfile {
  id: DemoProfileId;
  name: string;
  tagline: string;
  state: AppState;
}

const mariaRecord: PatientRecord = {
  name: "Robert Alvarez",
  age: 68,
  dischargedAt: "today, 9:15am",
  facility: "University Health, Kansas City MO",
  diagnosis: "Knee replacement, post-surgical recovery",
  mobility: "Non-weight-bearing on right leg, walker required for 4 weeks",
  medicationCount: 3,
  elevatedFallRisk: true,
  followUps: [
    { label: "Orthopedic clinic", when: "Wed 11:00am" },
    { label: "Physical therapy eval", when: "Fri 9:30am" },
  ],
  insurance: "Missouri Medicaid (MO HealthNet) — active",
  livingSituation: "Lives with daughter's family, single-story home",
};

const maria: DemoProfile = {
  id: "maria",
  name: "Maria Santos",
  tagline: "Single mom caring for her father after his surgery",
  state: {
    profile: {
      fillerRole: "caregiver",
      noCaregiverAvailable: false,
      relationship: "Daughter",
      patientName: "Robert Alvarez",
      patientAge: "68",
      patientDob: "",
    },
    accessibility: {
      largerText: false,
      highContrast: false,
      colorBlindSafe: false,
      readAloud: false,
      noSmartphone: false,
    },
    needs: {
      caregiverBranch: "has-caregiver",
      noCaregiverChoice: "yes-family",
      caregiverName: "Maria Santos",
      caregiverPhone: "(816) 555-0162",
      caregiverRelationship: "Daughter",
      caregiverAvailability: "living-with",
      caregiverCantHelpWith: ["driving"],
      nearbySupport: null,
      canMoveSafely: null,
      acceptsVolunteer: null,
      needsSelected: ["rides", "checkin"],
      emergencyContactName: "Maria Santos",
      emergencyContactPhone: "(816) 555-0162",
      zipCode: "64108",
      insurance: "medicaid",
      householdSize: "3",
      incomeBand: "1300-2200",
      housingStatus: "stable",
    },
    checkIns: [],
    startedAt: null,
    record: mariaRecord,
    recordConfirmed: false,
    paymentMethod: null,
    assistanceApproved: false,
    timeOverrides: {},
    demoProfileId: "maria",
  },
};

const shelterRecord: PatientRecord = {
  name: "James Carter",
  age: 54,
  dischargedAt: "today, 2:00pm",
  facility: "University Health, Kansas City MO",
  diagnosis: "Appendectomy, post-surgical recovery",
  mobility: "Ambulatory, activity restrictions for 2 weeks",
  medicationCount: 2,
  elevatedFallRisk: false,
  followUps: [{ label: "Wound check", when: "Thu 1:00pm" }],
  insurance: "Uninsured",
  livingSituation: "No fixed address",
};

const shelter: DemoProfile = {
  id: "shelter",
  name: "James Carter",
  tagline: "No caregiver, no fixed address — needs a safe place to recover",
  state: {
    profile: {
      fillerRole: "patient",
      noCaregiverAvailable: true,
      relationship: "",
      patientName: "James Carter",
      patientAge: "54",
      patientDob: "",
    },
    accessibility: {
      largerText: false,
      highContrast: false,
      colorBlindSafe: false,
      readAloud: false,
      noSmartphone: true,
    },
    needs: {
      caregiverBranch: "no-caregiver",
      noCaregiverChoice: "no-one",
      caregiverName: "",
      caregiverPhone: "",
      caregiverRelationship: "",
      caregiverAvailability: null,
      caregiverCantHelpWith: [],
      nearbySupport: "nobody",
      canMoveSafely: "freely",
      acceptsVolunteer: "yes",
      needsSelected: ["shelter", "meals"],
      emergencyContactName: "",
      emergencyContactPhone: "",
      zipCode: "64108",
      insurance: "uninsured",
      householdSize: "1",
      incomeBand: "under-1300",
      housingStatus: "unhoused",
    },
    checkIns: [],
    startedAt: null,
    record: shelterRecord,
    recordConfirmed: false,
    paymentMethod: null,
    assistanceApproved: false,
    timeOverrides: {},
    demoProfileId: "shelter",
  },
};

const uninsuredRecord: PatientRecord = {
  name: "David Okafor",
  age: 45,
  dischargedAt: "today, 10:30am",
  facility: "University Health, Kansas City MO",
  diagnosis: "Cardiac event, stent placement",
  mobility: "Ambulatory, no heavy lifting for 6 weeks",
  medicationCount: 5,
  elevatedFallRisk: false,
  followUps: [
    { label: "Cardiology follow-up", when: "Mon 9:00am" },
    { label: "Lab work", when: "Thu 8:00am" },
  ],
  insurance: "Uninsured",
  livingSituation: "Lives with spouse and two children, 2-story home",
};

const uninsured: DemoProfile = {
  id: "uninsured",
  name: "David Okafor",
  tagline: "Uninsured family, has caregivers at home",
  state: {
    profile: {
      fillerRole: "patient",
      noCaregiverAvailable: false,
      relationship: "Spouse",
      patientName: "David Okafor",
      patientAge: "45",
      patientDob: "",
    },
    accessibility: {
      largerText: false,
      highContrast: false,
      colorBlindSafe: false,
      readAloud: false,
      noSmartphone: false,
    },
    needs: {
      caregiverBranch: "has-caregiver",
      noCaregiverChoice: "yes-family",
      caregiverName: "Ngozi Okafor",
      caregiverPhone: "(816) 555-0193",
      caregiverRelationship: "Spouse",
      caregiverAvailability: "living-with",
      caregiverCantHelpWith: ["driving", "medical"],
      nearbySupport: null,
      canMoveSafely: null,
      acceptsVolunteer: null,
      needsSelected: ["rides", "meals", "household"],
      emergencyContactName: "Ngozi Okafor",
      emergencyContactPhone: "(816) 555-0193",
      zipCode: "64108",
      insurance: "uninsured",
      householdSize: "4+",
      incomeBand: "2200-3500",
      housingStatus: "stable",
    },
    checkIns: [],
    startedAt: null,
    record: uninsuredRecord,
    recordConfirmed: false,
    paymentMethod: null,
    assistanceApproved: false,
    timeOverrides: {},
    demoProfileId: "uninsured",
  },
};

export const demoProfiles: DemoProfile[] = [maria, shelter, uninsured];

export function getDemoProfile(id: DemoProfileId): AppState {
  const found = demoProfiles.find((p) => p.id === id);
  if (!found) throw new Error(`Unknown demo profile: ${id}`);
  return found.state;
}
