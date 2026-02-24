import { NextRequest } from "next/server";
import { getByRef, verifyOtp } from "@/server/mock/signup_store";

/** Mock: accept this OTP for any valid otp_ref (presentation phase). */
const MOCK_OTP_BYPASS = "123456";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  const otp_ref = String(body.otp_ref ?? "").trim();
  const otp = String(body.otp ?? "").replace(/\D/g, "");
  const channel = body.channel === "phone" ? "phone" : "email";

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

  if (channel === "phone" && !entry.phone) {
    return Response.json(
      { success: false, error: "No phone to verify" },
      { status: 400 }
    );
  }

  const mockBypass = otp === MOCK_OTP_BYPASS;
  let valid = mockBypass || verifyOtp(otp_ref, otp, channel);
  if (mockBypass && entry) {
    if (channel === "email") entry.email_verified = true;
    else entry.phone_verified = true;
    valid = true;
  }
  if (!valid) {
    const updated = getByRef(otp_ref);
    const attempts = updated
      ? channel === "email"
        ? updated.email_attempts
        : updated.phone_attempts
      : 0;
    const attemptsLeft = Math.max(0, 5 - attempts);
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

  const current = getByRef(otp_ref);
  return Response.json({
    success: true,
    email_verified: current?.email_verified ?? true,
    phone_verified: current?.phone_verified ?? false,
    has_phone: (current?.phone ?? "").length > 0,
  });
}
