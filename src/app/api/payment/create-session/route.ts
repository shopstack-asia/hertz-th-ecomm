import { NextRequest } from "next/server";
import { mockHandlers } from "@/lib/mock/handlers";
import { bookingRefToReservationNo } from "@/lib/mock/data";
import { paymentSessions } from "@/lib/mock/paymentSessions";

function generateSessionId(): string {
  return `SESSION${Math.floor(100000 + Math.random() * 900000)}`;
}

function generateBookingRef(): string {
  return `HZT${Math.floor(100000 + Math.random() * 900000)}`;
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
    bookingType: "PAY_NOW",
    renterName,
    driverName,
    contactEmail,
    contactPhone,
    voucherCode,
  });

  const reservation = await mockHandlers.booking.getByReservationNo(reservationNo);
  const totalAmount = typeof total === "number" ? total : reservation?.pricing?.total ?? 0;
  const bookingRef = generateBookingRef();
  const sessionId = generateSessionId();

  bookingRefToReservationNo[bookingRef] = reservationNo;
  paymentSessions[sessionId] = { booking_ref: bookingRef, amount: totalAmount };

  const paymentUrl = `/mock-kbank-gateway?session_id=${sessionId}&booking_ref=${bookingRef}`;

  return Response.json({
    session_id: sessionId,
    booking_ref: bookingRef,
    payment_url: paymentUrl,
  });
}
