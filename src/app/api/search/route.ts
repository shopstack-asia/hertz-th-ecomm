import { NextRequest } from "next/server";
import { mockHandlers } from "@/lib/mock/handlers";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const pickup = searchParams.get("pickup") ?? "";
  const dropoff = searchParams.get("dropoff") ?? pickup;
  const pickupAt = searchParams.get("pickupAt") ?? "";
  const dropoffAt = searchParams.get("dropoffAt") ?? "";

  if (!pickup || !pickupAt || !dropoffAt) {
    return Response.json(
      { error: "Missing required params: pickup, pickupAt, dropoffAt" },
      { status: 400 }
    );
  }

  const results = await mockHandlers.search(pickup, dropoff, pickupAt, dropoffAt);
  return Response.json(results);
}
