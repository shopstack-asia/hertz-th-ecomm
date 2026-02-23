import { NextRequest } from "next/server";
import { getByRef, verifyOtp } from "@/server/mock/signup_store";

/** Mock: accept this OTP for any valid otp_ref (presentation phase). */
const MOCK_OTP_BYPASS = "123456";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  const otp_ref = String(body.otp_ref ?? "").trim();
  const otp = String(body.otp ?? "").replace(/\D/g, "");

  if (!otp_ref || !otp) {
    return Response.json(
      { error: "otp_ref and OTP are required" },
      { status: 400 }
    );
  }
  if (otp.length !== 6) {
    return Response.json(
      { success: false, error: "INVALID_OTP" },
      { status: 400 }
    );
  }

  const entry = getByRef(otp_ref);
  if (!entry) {
    return Response.json(
      { success: false, error: "EXPIRED", message: "This link has expired. Please start again." },
      { status: 400 }
    );
  }

  const mockBypass = otp === MOCK_OTP_BYPASS;
  let valid = mockBypass || verifyOtp(otp_ref, otp);
  if (mockBypass && entry) {
    entry.verified = true;
    valid = true;
  }
  if (!valid) {
    const updated = getByRef(otp_ref);
    const attemptsLeft = updated ? Math.max(0, 5 - updated.attempts) : 0;
    return Response.json(
      {
        success: false,
        error: "INVALID_OTP",
        message: attemptsLeft > 0
          ? "Invalid code. Try again."
          : "Too many attempts. Please request a new code.",
      },
      { status: 400 }
    );
  }

  return Response.json({ success: true });
}
