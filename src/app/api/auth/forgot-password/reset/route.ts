import { NextRequest } from "next/server";
import { consumeAndInvalidate } from "@/server/mock/forgot_password_otp_store";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  const email = body.email?.trim();
  const otpRef = body.otp_ref?.trim();
  const newPassword = body.new_password;

  if (!email || !otpRef) {
    return Response.json(
      { error: "Email and OTP reference required" },
      { status: 400 }
    );
  }

  if (typeof newPassword !== "string" || newPassword.length < 8) {
    return Response.json(
      { error: "Password must be at least 8 characters" },
      { status: 400 }
    );
  }

  const consumed = consumeAndInvalidate(otpRef);
  if (!consumed) {
    return Response.json(
      { success: false, error: "OTP_NOT_VERIFIED" },
      { status: 400 }
    );
  }

  return Response.json({ success: true });
}
