import { cookies } from "next/headers";
import { getSession } from "@/server/mock/session_store";
import { getProfile } from "@/server/mock/profile_store";

const SESSION_COOKIE = "hertz_session";

export async function GET() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get(SESSION_COOKIE)?.value;

  if (!sessionId) {
    return Response.json({ authenticated: false, user: null });
  }

  const session = getSession(sessionId);
  if (!session) {
    return Response.json({ authenticated: false, user: null });
  }

  const profile = getProfile(session.user.id);
  const user = {
    ...session.user,
    ...(profile?.avatar_url && { avatar_url: profile.avatar_url }),
  };

  return Response.json({
    authenticated: true,
    user,
    expires_at: session.expires_at,
  });
}
