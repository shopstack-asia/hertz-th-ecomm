import { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { consumeState } from "@/server/mock/oauth_state_store";
import { createSession } from "@/server/mock/session_store";
import { getGoogleUserByCode } from "@/server/mock/oauth_mock_users";

const SESSION_COOKIE = "hertz_session";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");

  const entry = state ? consumeState(state) : null;
  if (!entry) {
    return Response.redirect(new URL("/account/login?error=invalid_state", request.url), 302);
  }

  const user = code ? getGoogleUserByCode(code) : null;
  if (!user) {
    return Response.redirect(new URL("/account/login?error=invalid_code", request.url), 302);
  }

  const session = createSession(user);
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, session.session_id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: Math.floor((session.expires_at - Date.now()) / 1000),
    path: "/",
  });

  const origin = new URL(request.url).origin;
  const path = entry.next.startsWith("/") ? entry.next : `/${entry.next}`;
  return Response.redirect(`${origin}${path}`, 302);
}
