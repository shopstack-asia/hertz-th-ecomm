import { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { getSession, updateSessionUser } from "@/server/mock/session_store";
import { getProfile, updateProfile } from "@/server/mock/profile_store";

const SESSION_COOKIE = "hertz_session";

export async function POST(request: NextRequest) {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get(SESSION_COOKIE)?.value;

  if (!sessionId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const session = getSession(sessionId);
  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const otp = typeof body.otp === "string" ? body.otp.trim() : "";
  const type = body.type === "phone" ? "phone" : body.type === "email" ? "email" : null;
  const new_value = typeof body.new_value === "string" ? body.new_value.trim() : "";

  if (!/^\d{6}$/.test(otp) || !type || !new_value) {
    return Response.json({ success: false, error: "Invalid request" }, { status: 400 });
  }

  const { verifyOtp } = await import("@/server/mock/otp_store");
  const result = verifyOtp(type, new_value, otp);

  if (!result.success) {
    return Response.json({ success: false, error: result.error }, { status: 400 });
  }

  const userId = session.user.id;
  const existing = getProfile(userId) ?? {
    id: userId,
    email: session.user.email,
    firstName: session.user.first_name,
    lastName: session.user.last_name,
    phone: session.user.phone,
  };

  if (type === "email") {
    updateProfile(userId, { ...existing, email: new_value }, existing);
    updateSessionUser(sessionId, { email: new_value });
  } else {
    updateProfile(userId, { ...existing, phone: new_value }, existing);
    updateSessionUser(sessionId, { phone: new_value });
  }

  return Response.json({ success: true });
}
