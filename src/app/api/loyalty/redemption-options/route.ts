import { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { getSession } from "@/server/mock/session_store";
import type { PointsRedemptionOption } from "@/types/loyalty";
import { basePrices } from "@/lib/mock/data";
import { getBasePrices } from "@/lib/mock/searchVehicles";

const SESSION_COOKIE = "hertz_session";

/** Add-on daily/flat prices for FREE_ADDON redemption */
const ADDON_PRICES: Record<string, { type: "daily" | "flat"; price: number; name: string }> = {
  child_seat: { type: "daily", price: 200, name: "Child Seat" },
  gps: { type: "daily", price: 150, name: "GPS" },
  premium_insurance: { type: "daily", price: 400, name: "Premium Insurance" },
};

function getAddonAmount(addonKey: string, rentalDays: number): number {
  const spec = ADDON_PRICES[addonKey];
  if (!spec) return 0;
  return spec.type === "daily" ? spec.price * rentalDays : spec.price;
}

function getBaseRental(vehicleId: string, rentalDays: number): number {
  const base = basePrices[vehicleId] ?? getBasePrices(vehicleId) ?? { payLater: 1500, payNow: 1350 };
  return base.payLater * rentalDays;
}

/** Mock redemption options - mirrors future CS contract */
function buildMockOptions(
  rentalDays: number,
  vehicleGroupCode?: string,
  addonIds: string[] = []
): PointsRedemptionOption[] {
  const baseRental = vehicleGroupCode
    ? getBaseRental(vehicleGroupCode, rentalDays)
    : 1500 * rentalDays;

  const options: PointsRedemptionOption[] = [
    {
      id: "P300",
      type: "FIXED_DISCOUNT",
      points_required: 300,
      discount_amount: 500,
      label: "300 points → ฿500 rental discount",
    },
    {
      id: "P500",
      type: "FIXED_DISCOUNT",
      points_required: 500,
      discount_amount: 700,
      label: "500 points → ฿700 rental discount",
    },
    {
      id: "P1000",
      type: "FREE_DAY",
      points_required: 1000,
      discount_amount: Math.round(baseRental / rentalDays),
      label: "1000 points → Free Medium Vehicle (1 day)",
    },
    {
      id: "P800",
      type: "FREE_DAY",
      points_required: 800,
      discount_amount: Math.round(baseRental / rentalDays),
      label: "800 points → Free 1 rental day",
    },
    {
      id: "P200",
      type: "FREE_ADDON",
      points_required: 200,
      addon_key: "child_seat",
      discount_amount: getAddonAmount("child_seat", rentalDays),
      label: `200 points → Free Child Seat (${rentalDays} day${rentalDays > 1 ? "s" : ""})`,
    },
    {
      id: "P150",
      type: "FREE_ADDON",
      points_required: 150,
      addon_key: "gps",
      discount_amount: getAddonAmount("gps", rentalDays),
      label: `150 points → Free GPS (${rentalDays} day${rentalDays > 1 ? "s" : ""})`,
    },    
    {
      id: "PUPGRADE",
      type: "FREE_UPGRADE",
      points_required: 600,
      upgrade_to_class: "SUV",
      discount_amount: 400,
      label: "600 points → Free vehicle class upgrade",
    },
  ];

  return options;
}

export async function GET(request: NextRequest) {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get(SESSION_COOKIE)?.value;

  if (!sessionId) {
    return Response.json([]);
  }

  const session = getSession(sessionId);
  if (!session) {
    return Response.json([]);
  }

  const { searchParams } = request.nextUrl;
  const bookingId = searchParams.get("bookingId");
  const vehicleGroupCode = searchParams.get("vehicleGroupCode") ?? undefined;
  const rentalDays = Math.max(
    1,
    Math.min(365, parseInt(searchParams.get("rentalDays") ?? "1", 10) || 1)
  );
  const addonIdsParam = searchParams.get("addonIds");
  const addonIds = addonIdsParam ? addonIdsParam.split(",").filter(Boolean) : [];

  const options = buildMockOptions(rentalDays, vehicleGroupCode, addonIds);
  return Response.json(options);
}
