import { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { createSession } from "@/server/mock/session_store";
import { validateMockLogin } from "@/server/mock/mock_users";

const SESSION_COOKIE = "hertz_session";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  const email = body.email?.trim();
  const password = body.password;

  if (!email || password === undefined) {
    return Response.json({ error: "Email and password required" }, { status: 400 });
  }

  const user = validateMockLogin(email, String(password ?? ""));
  if (!user) {
    return Response.json({ error: "Invalid email or password" }, { status: 401 });
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

  return Response.json({
    ok: true,
    user: session.user,
    expires_at: session.expires_at,
  });
}
