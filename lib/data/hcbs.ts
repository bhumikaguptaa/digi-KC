export interface HcbsService {
  name: string;
  covered: boolean;
  note?: string;
}

export const missouriHcbs: HcbsService[] = [
  { name: "Personal care (bathing, dressing, meal prep, medication reminders)", covered: true },
  { name: "Homemaker / household help", covered: true },
  { name: "Home-delivered meals", covered: true },
  { name: "Non-medical transportation", covered: true },
  { name: "Durable medical equipment + home modifications", covered: true },
  { name: "Respite care", covered: true },
  { name: "Adult day services", covered: true },
  {
    name: "Rent or food for a live-in caregiver",
    covered: false,
    note: "Least commonly covered HCBS service nationally",
  },
  {
    name: "Direct cash stipend to a family caregiver",
    covered: false,
    note: "Not covered under Missouri's current HCBS waiver",
  },
];

export const hcbsStateNote =
  "HCBS coverage is authorized state-by-state through Medicaid waivers, so what's covered varies outside Missouri.";
