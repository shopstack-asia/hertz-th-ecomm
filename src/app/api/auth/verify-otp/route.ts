import { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { consumeOtp } from "@/server/mock/otp_store";
import { createSession } from "@/server/mock/session_store";

const SESSION_COOKIE = "hertz_session";

/** Mock: accept this OTP for any valid email (avoids in-memory store not shared across workers). */
const MOCK_OTP_BYPASS = "123456";

function userFromEmail(email: string): {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
} {
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
  const rawEmail = body.email ?? "";
  const email = String(rawEmail).trim().toLowerCase();
  const otp = String(body.otp ?? "").trim();

  if (!email || !otp) {
    return Response.json(
      { error: "Email and OTP required" },
      { status: 400 }
    );
  }

  // Mock: accept fixed OTP regardless of store (store may be in another process in dev)
  const mockBypass = otp === MOCK_OTP_BYPASS;
  const valid = mockBypass || consumeOtp(email, otp);
  if (!valid) {
    return Response.json(
      { success: false, error: "INVALID_OTP" },
      { status: 400 }
    );
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
    success: true,
    user: session.user,
  });
}
