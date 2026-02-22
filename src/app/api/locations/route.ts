import { NextRequest } from "next/server";
import { mockHandlers } from "@/lib/mock/handlers";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") ?? undefined;
  const locations = await mockHandlers.locations.list(q);
  return Response.json(locations);
}
