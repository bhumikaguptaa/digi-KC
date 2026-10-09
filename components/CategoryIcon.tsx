import { NeedCategory } from "@/lib/data/types";

export function CategoryIcon({
  category,
  className,
}: {
  category: NeedCategory;
  className?: string;
}) {
  const common = { className: className ?? "h-6 w-6", stroke: "currentColor", fill: "none", strokeWidth: 1.8 };

  switch (category) {
    case "transport":
      return (
        <svg {...common} viewBox="0 0 24 24">
          <path d="M3 13l2-6a2 2 0 012-1.5h10A2 2 0 0119 7l2 6" strokeLinecap="round" strokeLinejoin="round" />
          <rect x="3" y="13" width="18" height="6" strokeLinejoin="round" />
          <circle cx="7" cy="19.5" r="1.3" />
          <circle cx="17" cy="19.5" r="1.3" />
        </svg>
      );
    case "meals":
      return (
        <svg {...common} viewBox="0 0 24 24">
          <path d="M6 3v7a2 2 0 002 2v9" strokeLinecap="round" />
          <path d="M6 3v4M9 3v4" strokeLinecap="round" />
          <path d="M17 3c-2 0-3 2-3 5s1 3 1 3v10" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "household":
      return (
        <svg {...common} viewBox="0 0 24 24">
          <path d="M4 11l8-7 8 7" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M6 10v10h12V10" strokeLinejoin="round" />
          <path d="M10 20v-5h4v5" strokeLinejoin="round" />
        </svg>
      );
    case "equipment":
      return (
        <svg {...common} viewBox="0 0 24 24">
          <circle cx="7" cy="18" r="2.2" />
          <circle cx="17" cy="18" r="2.2" />
          <path d="M7 18h10M9 18l2-9h4l2 4M9 9h6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "checkin":
      return (
        <svg {...common} viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="8.5" />
          <path d="M12 7.5v5l3 2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "mobility":
      return (
        <svg {...common} viewBox="0 0 24 24">
          <circle cx="12" cy="4.5" r="1.8" />
          <path d="M12 7v6l-4 7M12 13l4 7M8 11l4-1 4 1" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "shelter":
      return (
        <svg {...common} viewBox="0 0 24 24">
          <path d="M4 11l8-7 8 7" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M6 10v10h12V10" strokeLinejoin="round" />
          <path d="M9 20v-6h2v2h2v-2h2v6" strokeLinejoin="round" />
        </svg>
      );
  }
}

export const categoryLabels: Record<NeedCategory, string> = {
  transport: "Transport",
  meals: "Meals",
  household: "Household help",
  equipment: "Equipment",
  checkin: "Check-in",
  mobility: "Mobility",
  shelter: "Shelter",
};
