import { NextRequest } from "next/server";
import { mockHandlers } from "@/lib/mock/handlers";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const {
    vehicleGroupCode,
    pickupAt,
    dropoffAt,
    voucherCode,
    bookingType,
  } = body;

  if (!vehicleGroupCode || !pickupAt || !dropoffAt) {
    return Response.json(
      { error: "Missing required fields: vehicleGroupCode, pickupAt, dropoffAt" },
      { status: 400 }
    );
  }

  const result = await mockHandlers.pricing.validate({
    vehicleGroupCode,
    pickupAt,
    dropoffAt,
    voucherCode,
    bookingType: bookingType ?? "PAY_LATER",
  });
  return Response.json(result);
}
