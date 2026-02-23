import { cookies } from "next/headers";
import { getSession } from "@/server/mock/session_store";

const SESSION_COOKIE = "hertz_session";

/** Mock: returns 1200 points for logged-in users, 0 otherwise */
export async function GET() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get(SESSION_COOKIE)?.value;

  if (!sessionId) {
    return Response.json({ available_points: 0 });
  }

  const session = getSession(sessionId);
  if (!session) {
    return Response.json({ available_points: 0 });
  }

  return Response.json({ available_points: 1200 });
}
