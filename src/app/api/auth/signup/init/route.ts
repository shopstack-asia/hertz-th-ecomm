import { NextRequest } from "next/server";
import { createSignup } from "@/server/mock/signup_store";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[\d\s\-+()]{8,20}$/;

function getClientIp(request: NextRequest): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "unknown"
  );
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  const first_name = String(body.first_name ?? "").trim();
  const last_name = String(body.last_name ?? "").trim();
  const email = String(body.email ?? "").trim().toLowerCase();
  const phone = String(body.phone ?? "").trim();
  const consentPayload = body.consent;

  if (!first_name || !last_name) {
    return Response.json(
      { error: "First name and last name are required" },
      { status: 400 }
    );
  }
  if (!email) {
    return Response.json({ error: "Email is required" }, { status: 400 });
  }
  if (!EMAIL_REGEX.test(email)) {
    return Response.json({ error: "Please enter a valid email address" }, { status: 400 });
  }
  if (phone && !PHONE_REGEX.test(phone)) {
    return Response.json(
      { error: "Please enter a valid phone number" },
      { status: 400 }
    );
  }

  if (!consentPayload || typeof consentPayload !== "object") {
    return Response.json(
      { error: "You must accept the Terms & Conditions and Privacy Policy to continue" },
      { status: 400 }
    );
  }
  if (consentPayload.accept_terms !== true) {
    return Response.json(
      { error: "You must accept the Terms & Conditions to continue" },
      { status: 400 }
    );
  }
  if (consentPayload.accept_privacy !== true) {
    return Response.json(
      { error: "You must accept the Privacy Policy to continue" },
      { status: 400 }
    );
  }

  const consent = {
    accept_terms: true,
    accept_privacy: true,
    accept_marketing: Boolean(consentPayload.accept_marketing),
    consent_version: String(consentPayload.consent_version ?? "2026.01"),
    consent_timestamp: String(consentPayload.consent_timestamp ?? new Date().toISOString()),
    ip_address: getClientIp(request),
    user_agent: request.headers.get("user-agent") ?? undefined,
  };

  const { otp_ref } = createSignup({
    first_name,
    last_name,
    email,
    phone,
    consent,
  });

  return Response.json({
    success: true,
    otp_ref,
  });
}
