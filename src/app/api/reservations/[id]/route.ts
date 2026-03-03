import { NextRequest } from "next/server";
import { getLocaleFromRequest } from "@/lib/request-locale";
import { mockHandlers } from "@/lib/mock/handlers";
import { bookingRefToReservationNo } from "@/lib/mock/data";
import type { Reservation } from "@/types/booking";

/** Resolve id to reservationNo (id can be booking_ref e.g. HZT797430 or reservationNo) */
function resolveReservationNo(id: string): string | null {
  const trimmed = (id ?? "").trim();
  if (!trimmed) return null;
  if (/^HZT\d{6}$/i.test(trimmed)) {
    return bookingRefToReservationNo[trimmed.toUpperCase()] ?? null;
  }
  return trimmed;
}

/** Build thank-you / confirmation payload from reservation */
function toConfirmationPayload(
  reservation: Reservation,
  bookingRef: string
): Record<string, unknown> {
  const p = reservation.pricing;
  const isPayNow = reservation.bookingType === "PAY_NOW";
  const paid = reservation.paymentStatus === "PAID";
  const paymentMethod = isPayNow ? "Pay now (Card)" : "Pay later (Counter)";
  const paymentStatus = paid
    ? "PAID"
    : isPayNow
      ? (reservation.paymentStatus ?? "PENDING")
      : "PAY_AT_COUNTER";

  const rentalLine = p.lineItems?.find((l) =>
    l.description.toLowerCase().includes("rental")
  );
  const discountLines = p.lineItems?.filter(
    (l) => l.amount < 0 || l.description.toLowerCase().includes("voucher") || l.description.toLowerCase().includes("discount")
  ) ?? [];

  return {
    reference: bookingRef,
    booking_ref: bookingRef,
    reservationNo: reservation.reservationNo,
    vehicleName: reservation.vehicleName,
    vehicleClass: reservation.vehicleGroupCode || "—",
    pickupLocation: reservation.pickupLocation,
    pickupAt: reservation.pickupAt,
    dropoffLocation: reservation.dropoffLocation,
    dropoffAt: reservation.dropoffAt,
    paymentMethod,
    paymentStatus,
    addOns: reservation.addOns ?? [],
    pricing: {
      currency: p.currency ?? "THB",
      rental: rentalLine?.amount ?? p.subtotal,
      addonsTotal: (reservation.addOns ?? []).reduce((s, a) => s + a.amount, 0),
      discount: p.discount ?? 0,
      discountLines,
      subtotal: p.subtotal,
      vatRate: p.vatRate ?? 0.07,
      vatAmount: p.vatAmount ?? 0,
      total: p.total,
      lineItems: p.lineItems ?? [],
    },
    status: reservation.status,
  };
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  getLocaleFromRequest(request);
  const { id } = await params;
  const reservationNo = resolveReservationNo(id);
  if (!reservationNo) {
    return Response.json({ error: "Reservation not found" }, { status: 404 });
  }

  const reservation = await mockHandlers.booking.getByReservationNo(reservationNo);
  if (!reservation) {
    return Response.json({ error: "Reservation not found" }, { status: 404 });
  }

  const bookingRef =
    id.trim().toUpperCase().startsWith("HZT") && bookingRefToReservationNo[id.trim().toUpperCase()]
      ? id.trim().toUpperCase()
      : Object.entries(bookingRefToReservationNo).find(
          ([_, no]) => no === reservationNo
        )?.[0] ?? reservationNo;

  return Response.json(toConfirmationPayload(reservation, bookingRef));
}
