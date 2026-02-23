import { NextRequest } from "next/server";

export type AddOnPricingType = "daily" | "flat";

export interface AddOnItem {
  id: string;
  type: AddOnPricingType;
  price: number;
  name: string;
  description: string;
  disclaimer?: string;
  min_seats?: number;
  insurance_type?: "premium" | "zero_excess";
  seasonal?: boolean;
}

const ALL_ADDONS: AddOnItem[] = [
  { id: "child_seat", type: "daily", price: 200, name: "Child Seat", description: "Safety seat for children under 4 years old. Fits most vehicles.", min_seats: 4 },
  { id: "gps", type: "daily", price: 150, name: "GPS Navigation", description: "Portable GPS unit with Thailand maps and traffic updates." },
  { id: "easy_pass", type: "flat", price: 100, name: "Easy Pass (Toll Box)", description: "Electronic toll collection device for expressways.", disclaimer: "Toll fees not included." },
  { id: "additional_driver", type: "flat", price: 300, name: "Additional Driver", description: "Add one additional authorised driver to your rental at no extra daily charge." },
  { id: "premium_insurance", type: "daily", price: 400, name: "Premium Insurance Upgrade", description: "Enhanced coverage with reduced excess. Replaces standard insurance.", insurance_type: "premium" },
  { id: "zero_excess", type: "daily", price: 600, name: "Zero Excess Insurance", description: "No excess payable in case of damage. Cannot be combined with Premium Insurance.", insurance_type: "zero_excess" },
  { id: "wifi_router", type: "daily", price: 250, name: "WiFi Router", description: "Portable WiFi hotspot for internet on the go." },
  { id: "snow_chains", type: "daily", price: 350, name: "Snow Chains", description: "For winter conditions in eligible regions. Seasonal availability.", seasonal: true },
  { id: "drop_fee", type: "flat", price: 500, name: "One-way Drop Fee", description: "Return your vehicle to a different location. Only shown when one-way rental." },
];

export async function GET(request: NextRequest) {
  const vehicleId = request.nextUrl.searchParams.get("vehicleId") ?? "";
  const seatsParam = request.nextUrl.searchParams.get("seats");
  const seats = seatsParam ? Math.max(0, parseInt(seatsParam, 10) || 0) : undefined;
  const oneWay = request.nextUrl.searchParams.get("oneWay") === "true";

  let list = [...ALL_ADDONS];
  if (seats != null && seats > 0) {
    list = list.filter((a) => a.min_seats == null || seats >= a.min_seats);
  }
  if (!oneWay) {
    list = list.filter((a) => a.id !== "drop_fee");
  }
  return Response.json({ addons: list });
}
