import { NextRequest } from "next/server";
import { getByRef, verifyOtp } from "@/server/mock/forgot_password_otp_store";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  const email = body.email?.trim();
  const otp = String(body.otp ?? "").trim();
  const otpRef = body.otp_ref?.trim();

  if (!email || !otp) {
    return Response.json(
      { error: "Email and OTP required" },
      { status: 400 }
    );
  }

  if (!otpRef) {
    return Response.json(
      { error: "OTP reference required" },
      { status: 400 }
    );
  }

  const entry = getByRef(otpRef);
  if (!entry) {
    return Response.json(
      { success: false, error: "OTP_EXPIRED" },
      { status: 400 }
    );
  }

  const valid = verifyOtp(otpRef, email, otp);
  if (!valid) {
    return Response.json(
      { success: false, error: "INVALID_OTP" },
      { status: 400 }
    );
  }

  return Response.json({ success: true });
}
