import { NextRequest } from "next/server";
import { getLocaleFromRequest } from "@/lib/request-locale";
import { mockHandlers } from "@/lib/mock/handlers";

export async function POST(request: NextRequest) {
  getLocaleFromRequest(request);
  const body = await request.json();
  const { reservationNo } = body;
  if (!reservationNo) {
    return Response.json(
      { error: "Missing reservationNo" },
      { status: 400 }
    );
  }
  const result = await mockHandlers.payment.initiate(reservationNo);
  return Response.json(result);
}
