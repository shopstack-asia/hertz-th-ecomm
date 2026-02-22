import { NextRequest } from "next/server";
import { mockHandlers } from "@/lib/mock/handlers";

export async function GET() {
  const profile = await mockHandlers.account.profile.get();
  return Response.json(profile);
}

export async function PUT(request: NextRequest) {
  const body = await request.json();
  const profile = await mockHandlers.account.profile.update(body);
  return Response.json(profile);
}
