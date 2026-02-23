import { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { getSession } from "@/server/mock/session_store";
import { createOtp } from "@/server/mock/otp_store";

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
  const type = body.type === "phone" ? "phone" : body.type === "email" ? "email" : null;
  const new_value = typeof body.new_value === "string" ? body.new_value.trim() : "";

  if (!type || !new_value) {
    return Response.json({ error: "type and new_value required" }, { status: 400 });
  }

  const { otp, ok, error } = createOtp(type, new_value);
  if (!ok) {
    return Response.json({ error: error ?? "Cannot send OTP" }, { status: 429 });
  }

  if (process.env.NODE_ENV !== "production") {
    console.log(`[MOCK OTP] ${type} ${new_value} → ${otp}`);
  }

  return Response.json({ success: true });
}
