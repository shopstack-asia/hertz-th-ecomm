import { NextRequest } from "next/server";
import { resendOtp, getByRef } from "@/server/mock/signup_store";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  const otp_ref = String(body.otp_ref ?? "").trim();
  const channel = body.channel === "phone" ? "phone" : "email";

  if (!otp_ref) {
    return Response.json({ error: "otp_ref is required" }, { status: 400 });
  }

  const ok = resendOtp(otp_ref, channel);
  if (!ok) {
    const entry = getByRef(otp_ref);
    return Response.json(
      {
        error:
          channel === "phone" && entry && !entry.phone
            ? "No phone number to resend to."
            : "This link has expired or was already used. Please start again.",
      },
      { status: 400 }
    );
  }

  return Response.json({ success: true });
}
