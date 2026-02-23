import { cookies } from "next/headers";
import { getSession } from "@/server/mock/session_store";
import type { LoyaltySummary } from "@/types/loyalty";

const SESSION_COOKIE = "hertz_session";

const MOCK_SUMMARY: LoyaltySummary = {
  available_points: 12500,
  expiring_points: 1200,
  expiring_date: "2025-12-31",
  tier: "GOLD",
  next_tier: "PLATINUM",
  next_tier_threshold: 20000,
};

/** No expiring points variant for testing: set expiring_points to 0 and expiring_date to null */
export async function GET() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get(SESSION_COOKIE)?.value;

  if (!sessionId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const session = getSession(sessionId);
  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  return Response.json(MOCK_SUMMARY);
}
