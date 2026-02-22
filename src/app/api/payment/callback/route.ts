import { NextRequest } from "next/server";
import { mockHandlers } from "@/lib/mock/handlers";

/**
 * Placeholder for server-to-server payment gateway callback.
 * For mock, we call it from the client-side payment status page.
 */
export async function POST(request: NextRequest) {
  const body = await request.json();
  const { reservationNo, status } = body;
  if (!reservationNo || !status) {
    return Response.json(
      { error: "Missing reservationNo or status" },
      { status: 400 }
    );
  }
  const result = await mockHandlers.payment.callback({
    reservationNo,
    status,
  });
  return Response.json(result);
}
