import { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { getLocaleFromRequest } from "@/lib/request-locale";
import { getSession } from "@/server/mock/session_store";
import type { LoyaltyProfile } from "@/types/account";

const SESSION_COOKIE = "hertz_session";

const MOCK_LOYALTY: LoyaltyProfile = {
  tier: "GOLD",
  annual_spending: 125000,
  next_tier: "PLATINUM",
  next_tier_spending_threshold: 200000,
  qualification_start: "2026-01-01",
  qualification_end: "2026-12-31",
};

export async function GET(request: NextRequest) {
  getLocaleFromRequest(request);
  const cookieStore = await cookies();
  const sessionId = cookieStore.get(SESSION_COOKIE)?.value;

  if (!sessionId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const session = getSession(sessionId);
  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  return Response.json(MOCK_LOYALTY);
}
