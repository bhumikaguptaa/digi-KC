import { NeedCategory } from "./data/types";

export const categoryChipClass: Record<NeedCategory, string> = {
  transport: "bg-violet-50 text-violet",
  meals: "bg-primary-50 text-primary-700",
  household: "bg-pink-50 text-pink",
  equipment: "bg-violet-50 text-violet",
  checkin: "bg-pink-50 text-pink",
  mobility: "bg-primary-50 text-primary-700",
  shelter: "bg-violet-50 text-violet",
};

export const categoryIconClass: Record<NeedCategory, string> = {
  transport: "text-violet",
  meals: "text-primary-700",
  household: "text-pink",
  equipment: "text-violet",
  checkin: "text-pink",
  mobility: "text-primary-700",
  shelter: "text-violet",
};
