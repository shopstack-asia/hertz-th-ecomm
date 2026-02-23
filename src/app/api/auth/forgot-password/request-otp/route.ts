import { NextRequest } from "next/server";
import { createOtp } from "@/server/mock/forgot_password_otp_store";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isValidEmail(email: string): boolean {
  return EMAIL_REGEX.test(email?.trim() ?? "");
}

/** Mock: fixed OTP for testing. */
const MOCK_OTP = "123456";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  const email = body.email?.trim();

  if (!email) {
    return Response.json({ error: "Email required" }, { status: 400 });
  }

  if (!isValidEmail(email)) {
    return Response.json({ error: "Invalid email format" }, { status: 400 });
  }

  const otpRef = createOtp(email.toLowerCase(), MOCK_OTP);

  return Response.json({
    success: true,
    otp_ref: otpRef,
  });
}
