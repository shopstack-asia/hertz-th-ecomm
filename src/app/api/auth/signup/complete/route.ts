import { NextRequest } from "next/server";
import { consumeAndGet } from "@/server/mock/signup_store";
import { createSession } from "@/server/mock/session_store";

const PASSWORD_MIN_LENGTH = 8;
const PASSWORD_HAS_LETTER = /[a-zA-Z]/;
const PASSWORD_HAS_NUMBER = /\d/;

function validatePassword(password: string): { ok: boolean; error?: string } {
  if (password.length < PASSWORD_MIN_LENGTH) {
    return { ok: false, error: "Password must be at least 8 characters" };
  }
  if (!PASSWORD_HAS_LETTER.test(password)) {
    return { ok: false, error: "Password must include letters and numbers" };
  }
  if (!PASSWORD_HAS_NUMBER.test(password)) {
    return { ok: false, error: "Password must include letters and numbers" };
  }
  return { ok: true };
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  const otp_ref = String(body.otp_ref ?? "").trim();
  const password = String(body.password ?? "");

  if (!otp_ref || !password) {
    return Response.json(
      { error: "otp_ref and password are required" },
      { status: 400 }
    );
  }

  const pw = validatePassword(password);
  if (!pw.ok) {
    return Response.json({ error: pw.error }, { status: 400 });
  }

  const entry = consumeAndGet(otp_ref);
  if (!entry) {
    return Response.json(
      { error: "Session expired or already used. Please sign up again." },
      { status: 400 }
    );
  }

  const c = entry.consent;
  const user = {
    id: "user_" + Date.now() + "_" + Math.random().toString(36).slice(2, 9),
    email: entry.email,
    first_name: entry.first_name,
    last_name: entry.last_name,
    phone: entry.phone || undefined,
    loyalty_tier: "SILVER",
    consent: {
      terms_version: c.consent_version,
      privacy_version: c.consent_version,
      marketing_opt_in: c.accept_marketing,
      consent_timestamp: c.consent_timestamp,
    },
  };

  createSession(user);

  return Response.json({
    success: true,
    user,
  });
}
