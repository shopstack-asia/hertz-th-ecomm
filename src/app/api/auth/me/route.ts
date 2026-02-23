import { cookies } from "next/headers";
import { getSession } from "@/server/mock/session_store";

const SESSION_COOKIE = "hertz_session";

export async function GET() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get(SESSION_COOKIE)?.value;

  if (!sessionId) {
    return Response.json({ authenticated: false });
  }

  const session = getSession(sessionId);
  if (!session) {
    return Response.json({ authenticated: false });
  }

  return Response.json({
    authenticated: true,
    user: session.user,
    expires_at: session.expires_at,
  });
}
