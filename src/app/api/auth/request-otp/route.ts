import { NextRequest } from "next/server";
import { setOtp } from "@/server/mock/otp_store";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isValidEmail(email: string): boolean {
  return EMAIL_REGEX.test(email?.trim() ?? "");
}

/** Mock: fixed OTP for testing. Use 123456 to verify. */
const MOCK_OTP = "123456";

function getOtpForMock(): string {
  return MOCK_OTP;
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  const email = body.email?.trim();

  if (!email) {
    return Response.json({ error: "Email required" }, { status: 400 });
  }

  if (!isValidEmail(email)) {
    return Response.json({ error: "Invalid email format" }, { status: 400 });
  }

  const otp = getOtpForMock();
  setOtp(email.toLowerCase(), otp);

  return Response.json({
    success: true,
    otp_ref: "mock_ref_" + Date.now(),
  });
}
