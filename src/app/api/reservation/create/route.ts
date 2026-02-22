import { NextRequest } from "next/server";
import { mockHandlers } from "@/lib/mock/handlers";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const {
    vehicleGroupCode,
    pickupLocation,
    pickupAt,
    dropoffLocation,
    dropoffAt,
    bookingType,
    renterName,
    driverName,
    contactEmail,
    contactPhone,
    voucherCode,
  } = body;

  if (
    !vehicleGroupCode ||
    !pickupLocation ||
    !pickupAt ||
    !dropoffLocation ||
    !dropoffAt ||
    !bookingType ||
    !renterName ||
    !contactEmail ||
    !contactPhone
  ) {
    return Response.json(
      {
        error:
          "Missing required fields: vehicleGroupCode, pickupLocation, pickupAt, dropoffLocation, dropoffAt, bookingType, renterName, contactEmail, contactPhone",
      },
      { status: 400 }
    );
  }

  const result = await mockHandlers.reservation.create({
    vehicleGroupCode,
    pickupLocation,
    pickupAt,
    dropoffLocation,
    dropoffAt,
    bookingType,
    renterName,
    driverName,
    contactEmail,
    contactPhone,
    voucherCode,
  });
  return Response.json(result);
}
