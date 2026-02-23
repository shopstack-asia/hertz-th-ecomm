import { NextRequest } from "next/server";
import { resendOtp } from "@/server/mock/signup_store";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  const otp_ref = String(body.otp_ref ?? "").trim();

  if (!otp_ref) {
    return Response.json({ error: "otp_ref is required" }, { status: 400 });
  }

  const ok = resendOtp(otp_ref);
  if (!ok) {
    return Response.json(
      { error: "This link has expired or was already used. Please start again." },
      { status: 400 }
    );
  }

  return Response.json({ success: true });
}
