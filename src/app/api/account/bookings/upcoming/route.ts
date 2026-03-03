import { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getLocaleFromRequest } from "@/lib/request-locale";
import { mockHandlers } from "@/lib/mock/handlers";

export async function GET(request: NextRequest) {
  getLocaleFromRequest(request);
  const bookings = await mockHandlers.account.bookings.upcoming();
  return NextResponse.json({ bookings });
}
