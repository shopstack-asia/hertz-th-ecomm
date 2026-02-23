import { NextRequest } from "next/server";
import { mockHandlers } from "@/lib/mock/handlers";
import { bookingRefToReservationNo } from "@/lib/mock/data";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ bookingRef: string }> }
) {
  const { bookingRef } = await params;
  const reservationNo = bookingRefToReservationNo[bookingRef];
  if (!reservationNo) {
    return Response.json({ error: "Booking not found" }, { status: 404 });
  }
  const booking = await mockHandlers.booking.getByReservationNo(reservationNo);
  if (!booking) {
    return Response.json({ error: "Booking not found" }, { status: 404 });
  }
  return Response.json({ ...booking, booking_ref: bookingRef });
}
