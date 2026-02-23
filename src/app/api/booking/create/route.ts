import { NextRequest } from "next/server";
import { mockHandlers } from "@/lib/mock/handlers";
import { bookingRefToReservationNo } from "@/lib/mock/data";

function generateBookingRef(): string {
  const seq = Math.floor(100000 + Math.random() * 900000);
  return `HZT${seq}`;
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const {
    vehicleGroupCode,
    pickupLocation,
    pickupAt,
    dropoffLocation,
    dropoffAt,
    renterName,
    driverName,
    contactEmail,
    contactPhone,
    voucherCode,
    total,
  } = body;

  if (
    !vehicleGroupCode ||
    !pickupLocation ||
    !pickupAt ||
    !dropoffLocation ||
    !dropoffAt ||
    !renterName ||
    !contactEmail ||
    !contactPhone
  ) {
    return Response.json(
      {
        error:
          "Missing required fields: vehicleGroupCode, pickupLocation, pickupAt, dropoffLocation, dropoffAt, renterName, contactEmail, contactPhone",
      },
      { status: 400 }
    );
  }

  const { reservationNo } = await mockHandlers.reservation.create({
    vehicleGroupCode,
    pickupLocation,
    pickupAt,
    dropoffLocation,
    dropoffAt,
    bookingType: "PAY_LATER",
    renterName,
    driverName,
    contactEmail,
    contactPhone,
    voucherCode,
  });

  const reservation = await mockHandlers.booking.getByReservationNo(reservationNo);
  const totalAmount = typeof total === "number" ? total : reservation?.pricing?.total ?? 0;
  const bookingRef = generateBookingRef();
  bookingRefToReservationNo[bookingRef] = reservationNo;

  return Response.json({
    booking_ref: bookingRef,
    total: totalAmount,
  });
}
