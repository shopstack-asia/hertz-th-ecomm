import { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { createSession } from "@/server/mock/session_store";

const SESSION_COOKIE = "hertz_session";

/** Mock: any email with any non-empty password is valid */
function validateCredentials(email: string, password: string): boolean {
  return !!email?.trim() && password != null && String(password).trim() !== "";
}

/** Derive mock user from email */
function userFromEmail(email: string): { id: string; email: string; first_name: string; last_name: string } {
  const local = email.split("@")[0] || "user";
  const name = local.replace(/[._-]/g, " ").trim() || "User";
  const [first = name, ...rest] = name.split(" ");
  const last = rest.length ? rest.join(" ") : "User";
  return {
    id: `user_${Date.now()}`,
    email: email.trim().toLowerCase(),
    first_name: first,
    last_name: last,
  };
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  const email = body.email?.trim();
  const password = body.password;

  if (!email || password === undefined) {
    return Response.json({ error: "Email and password required" }, { status: 400 });
  }

  if (!validateCredentials(email, password)) {
    return Response.json({ error: "Invalid email or password" }, { status: 401 });
  }

  const user = userFromEmail(email);
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
