import { NextRequest } from "next/server";
import { getLocaleFromRequest } from "@/lib/request-locale";
import { mockHandlers } from "@/lib/mock/handlers";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ groupCode: string }> }
) {
  const { groupCode } = await params;
  const locale = getLocaleFromRequest(request);
  const vehicle = await mockHandlers.vehicle.getByGroupCode(groupCode, locale);
  if (!vehicle) {
    return Response.json({ error: "Vehicle not found" }, { status: 404 });
  }
  return Response.json(vehicle);
}
