import { NextRequest } from "next/server";
import { getLocaleFromRequest } from "@/lib/request-locale";
import { mockHandlers } from "@/lib/mock/handlers";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ reservationNo: string }> }
) {
  getLocaleFromRequest(request);
  const { reservationNo } = await params;
  const booking = await mockHandlers.booking.getByReservationNo(reservationNo);
  if (!booking) {
    return Response.json({ error: "Booking not found" }, { status: 404 });
  }
  return Response.json(booking);
}
