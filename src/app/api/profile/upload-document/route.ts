import { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { getSession } from "@/server/mock/session_store";
import { getProfile, updateProfile } from "@/server/mock/profile_store";
import type { AccountProfile } from "@/types/account";

const SESSION_COOKIE = "hertz_session";
const MAX_SIZE = 10 * 1024 * 1024; // 10MB for documents
const ALLOWED_TYPES = ["image/jpeg", "image/png", "application/pdf"];
const ALLOWED_DOC_TYPES = ["identity", "driver_license"] as const;

export async function POST(request: NextRequest) {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get(SESSION_COOKIE)?.value;

  if (!sessionId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const session = getSession(sessionId);
  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file") as File | null;
  const docType = formData.get("type") as string | null;

  if (!ALLOWED_DOC_TYPES.includes(docType as (typeof ALLOWED_DOC_TYPES)[number])) {
    return Response.json({ error: "Invalid type: use identity or driver_license" }, { status: 400 });
  }

  if (!file || !(file instanceof File)) {
    return Response.json({ error: "No file" }, { status: 400 });
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return Response.json({ error: "JPG, PNG or PDF only" }, { status: 400 });
  }

  if (file.size > MAX_SIZE) {
    return Response.json({ error: "Max size 10MB" }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const base64 = buffer.toString("base64");
  const dataUrl = `data:${file.type};base64,${base64}`;

  const userId = session.user.id;
  const existing = getProfile(userId) ?? ({
    id: userId,
    email: session.user.email,
    firstName: session.user.first_name,
    lastName: session.user.last_name,
    phone: session.user.phone,
  } as AccountProfile);

  const urlField = docType === "identity" ? "identity_document_url" : "driver_license_url";
  const extracted_expiry =
    docType === "identity"
      ? mockExtractExpiryFromDocument()
      : docType === "driver_license"
        ? mockExtractExpiryFromDocument()
        : undefined;

  const updates: Partial<AccountProfile> =
    docType === "identity"
      ? {
          identity_document_url: dataUrl,
          ...(extracted_expiry && { identity_document_expiry: extracted_expiry }),
        }
      : {
          driver_license_url: dataUrl,
          ...(extracted_expiry && { driver_license_expiry: extracted_expiry }),
        };
  const updated = updateProfile(userId, updates, existing);

  return Response.json({
    url: updated[urlField],
    extracted_expiry: extracted_expiry ?? (docType === "identity" ? updated.identity_document_expiry : updated.driver_license_expiry),
  });
}

/** Mock: simulate reading expiry from document. Replace with real OCR/document API. */
function mockExtractExpiryFromDocument(): string {
  const d = new Date();
  d.setFullYear(d.getFullYear() + 5);
  return d.toISOString().slice(0, 10);
}
