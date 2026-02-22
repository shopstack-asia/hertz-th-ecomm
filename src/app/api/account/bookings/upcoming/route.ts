import { NextResponse } from "next/server";
import { mockHandlers } from "@/lib/mock/handlers";

export async function GET() {
  const bookings = await mockHandlers.account.bookings.upcoming();
  return NextResponse.json({ bookings });
}
