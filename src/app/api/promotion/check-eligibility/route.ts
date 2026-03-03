import { NextRequest } from "next/server";
import { getLocaleFromRequest } from "@/lib/request-locale";

/**
 * Mock eligibility for SAVE10: ECONOMY + COMPACT only, min 2 days.
 * Returns eligible + discount_amount for pricing display.
 */

const PROMO_ELIGIBILITY: Record<
  string,
  {
    discount_percent: number;
    min_rental_days: number;
    vehicle_classes: string[];
  }
> = {
  SAVE10: {
    discount_percent: 0.1,
    min_rental_days: 2,
    vehicle_classes: ["ECONOMY", "COMPACT"],
  },
};

function normalizeVehicleClass(category: string): string {
  return (category ?? "").trim().toUpperCase().replace(/\s+/g, "_");
}

export async function POST(request: NextRequest) {
  getLocaleFromRequest(request);
  let body: {
    promo_code?: string;
    vehicle_id?: string;
    rental_days?: number;
    vehicle_class?: string;
    base_price?: number;
  };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const promoCode = (body.promo_code ?? "").trim().toUpperCase();
  const vehicleId = body.vehicle_id ?? "";
  const rentalDays = Math.max(1, Math.floor(Number(body.rental_days) || 1));
  const vehicleClass = body.vehicle_class ?? "";
  const basePrice = typeof body.base_price === "number" ? body.base_price : 0;

  if (!promoCode) {
    return Response.json({
      eligible: false,
      reason_if_not_eligible: "No promotion code provided.",
    });
  }

  const rule = PROMO_ELIGIBILITY[promoCode];
  if (!rule) {
    return Response.json({
      eligible: false,
      reason_if_not_eligible: "This promotion code is not recognized.",
    });
  }

  if (rentalDays < rule.min_rental_days) {
    return Response.json({
      eligible: false,
      reason_if_not_eligible: `Minimum ${rule.min_rental_days} rental days required`,
    });
  }

  const normalizedClass = normalizeVehicleClass(vehicleClass);
  const allowedClasses = rule.vehicle_classes.map((c) => c.toUpperCase());
  const isAllowedClass = allowedClasses.some(
    (c) => normalizedClass === c || normalizedClass.includes(c)
  );
  // Also accept category names as returned by search (e.g. "Economy", "Compact")
  const categoryMatch =
    allowedClasses.includes(normalizedClass) ||
    ["ECONOMY", "COMPACT"].some(
      (c) => vehicleClass.toUpperCase().startsWith(c) || normalizedClass.startsWith(c)
    );

  if (!categoryMatch && !isAllowedClass) {
    return Response.json({
      eligible: false,
      reason_if_not_eligible: `This promotion applies only to ${rule.vehicle_classes.join(" and ")} vehicles.`,
    });
  }

  const discountAmount =
    basePrice > 0 ? Math.round(basePrice * rule.discount_percent) : 0;

  return Response.json({
    eligible: true,
    discount_amount: discountAmount,
  });
}
