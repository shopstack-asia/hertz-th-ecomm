import { cookies } from "next/headers";
import { deleteSession } from "@/server/mock/session_store";

const SESSION_COOKIE = "hertz_session";

export async function POST() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get(SESSION_COOKIE)?.value;
  if (sessionId) {
    deleteSession(sessionId);
  }
  cookieStore.set(SESSION_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  });
  return Response.json({ ok: true });
}
