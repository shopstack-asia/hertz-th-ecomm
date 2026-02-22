import { NextRequest } from "next/server";
import { mockHandlers } from "@/lib/mock/handlers";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ groupCode: string }> }
) {
  const { groupCode } = await params;
  const vehicle = await mockHandlers.vehicle.getByGroupCode(groupCode);
  if (!vehicle) {
    return Response.json({ error: "Vehicle not found" }, { status: 404 });
  }
  return Response.json(vehicle);
}
