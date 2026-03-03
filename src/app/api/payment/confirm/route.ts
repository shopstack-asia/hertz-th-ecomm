import { NextRequest } from "next/server";
import { getLocaleFromRequest } from "@/lib/request-locale";
import { mockHandlers } from "@/lib/mock/handlers";
import { bookingRefToReservationNo } from "@/lib/mock/data";

export async function POST(request: NextRequest) {
  getLocaleFromRequest(request);
  const body = await request.json().catch(() => ({}));
  const bookingRef = body.booking_ref?.trim();

  if (!bookingRef) {
    return Response.json({ error: "booking_ref required" }, { status: 400 });
  }

  const reservationNo = bookingRefToReservationNo[bookingRef];
  if (!reservationNo) {
    return Response.json({ error: "Booking not found" }, { status: 404 });
  }

  await mockHandlers.payment.callback({
    reservationNo,
    status: "success",
  });

  return Response.json({ status: "paid" });
}
