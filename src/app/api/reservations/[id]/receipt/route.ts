import { NextRequest } from "next/server";
import { mockHandlers } from "@/lib/mock/handlers";
import { bookingRefToReservationNo } from "@/lib/mock/data";

function resolveReservationNo(id: string): string | null {
  const trimmed = (id ?? "").trim();
  if (!trimmed) return null;
  if (/^HZT\d{6}$/i.test(trimmed)) {
    return bookingRefToReservationNo[trimmed.toUpperCase()] ?? null;
  }
  return trimmed;
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

  const p = reservation.pricing;
  const pickupDate = new Date(reservation.pickupAt).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  const dropoffDate = new Date(reservation.dropoffAt).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Receipt ${bookingRef}</title>
  <style>
    body { font-family: system-ui, sans-serif; max-width: 480px; margin: 24px auto; padding: 0 16px; color: #222; }
    h1 { font-size: 18px; margin-bottom: 8px; }
    .ref { font-size: 20px; font-weight: 700; letter-spacing: 0.05em; margin: 8px 0 24px; }
    table { width: 100%; border-collapse: collapse; }
    th, td { padding: 6px 0; text-align: left; border-bottom: 1px solid #eee; }
    th { font-size: 11px; text-transform: uppercase; color: #666; }
    .total { font-size: 18px; font-weight: 700; margin-top: 16px; }
    .muted { color: #666; font-size: 12px; margin-top: 24px; }
  </style>
</head>
<body>
  <h1>Hertz Thailand</h1>
  <p class="muted">Booking receipt</p>
  <p class="ref">${bookingRef}</p>
  <table>
    <tr><th>Vehicle</th><td>${reservation.vehicleName}</td></tr>
    <tr><th>Rental period</th><td>${pickupDate} – ${dropoffDate}</td></tr>
    <tr><th>Pick-up</th><td>${reservation.pickupLocation}</td></tr>
    <tr><th>Drop-off</th><td>${reservation.dropoffLocation}</td></tr>
  </table>
  <table style="margin-top: 16px;">
    ${(p.lineItems ?? []).map((l) => `<tr><th>${l.description}</th><td>฿${l.amount.toLocaleString()}</td></tr>`).join("")}
    <tr><th>VAT (7%)</th><td>฿${(p.vatAmount ?? 0).toLocaleString()}</td></tr>
    <tr><th>Total</th><td class="total">฿${(p.total ?? 0).toLocaleString()} ${p.currency ?? "THB"}</td></tr>
  </table>
  <p class="muted">Thank you for choosing Hertz. This is a computer-generated receipt.</p>
</body>
</html>`;

  return new Response(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Content-Disposition": `attachment; filename="Hertz-receipt-${bookingRef}.html"`,
    },
  });
}
