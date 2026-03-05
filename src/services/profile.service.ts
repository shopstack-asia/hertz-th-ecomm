/**
 * Profile service – API calls and validation.
 * No UI logic; used by profile page and components.
 */

import type { AccountProfile } from "@/types/account";

const API = {
  profile: "/api/account/profile",
  uploadAvatar: "/api/profile/upload-avatar",
  uploadDocument: "/api/profile/upload-document",
  requestOtp: "/api/profile/request-otp",
  verifyOtp: "/api/profile/verify-otp",
  session: "/api/session",
};

export async function getProfile(): Promise<AccountProfile | null> {
  const res = await fetch(API.profile, { credentials: "include" });
  if (!res.ok) return null;
  return res.json();
}

export async function updateProfile(
  data: Partial<AccountProfile> & { avatar_url?: string | null }
): Promise<AccountProfile> {
  const res = await fetch(API.profile, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update profile");
  return res.json();
}

export type DocumentType = "identity" | "driver_license";

export async function uploadDocument(
  type: DocumentType,
  file: File
): Promise<{ url: string; extracted_expiry?: string }> {
  const form = new FormData();
  form.append("type", type);
  form.append("file", file);
  const res = await fetch(API.uploadDocument, {
    method: "POST",
    credentials: "include",
    body: form,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error ?? "Upload failed");
  return data;
}

export const DOCUMENT_RULES = {
  maxSizeBytes: 10 * 1024 * 1024,
  allowedTypes: ["image/jpeg", "image/png", "application/pdf"],
  allowedExtensions: [".jpg", ".jpeg", ".png", ".pdf"],
} as const;

export function validateDocumentFile(file: File): { ok: boolean; error?: string } {
  if (!DOCUMENT_RULES.allowedTypes.includes(file.type as "image/jpeg" | "image/png" | "application/pdf")) {
    return { ok: false, error: "JPG, PNG or PDF only" };
  }
  if (file.size > DOCUMENT_RULES.maxSizeBytes) {
    return { ok: false, error: "Max size 10MB" };
  }
  return { ok: true };
}

export async function uploadAvatar(file: File): Promise<{ avatar_url: string }> {
  const form = new FormData();
  form.append("file", file);
  const res = await fetch(API.uploadAvatar, {
    method: "POST",
    credentials: "include",
    body: form,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error ?? "Upload failed");
  }
  return res.json();
}

export async function requestOtp(type: "email" | "phone", new_value: string): Promise<void> {
  const res = await fetch(API.requestOtp, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ type, new_value }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error ?? "Failed to send OTP");
}

export async function verifyOtp(
  type: "email" | "phone",
  new_value: string,
  otp: string
): Promise<void> {
  const res = await fetch(API.verifyOtp, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ type, new_value, otp }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data.success) throw new Error(data.error ?? "Verification failed");
}

export async function refreshSession(): Promise<{
  user: { id: string; email: string; first_name: string; last_name: string; phone?: string; avatar_url?: string };
  profile?: AccountProfile | null;
}> {
  const res = await fetch(API.session, { credentials: "include" });
  if (!res.ok) throw new Error("Session refresh failed");
  return res.json();
}

export const AVATAR_RULES = {
  maxSizeBytes: 5 * 1024 * 1024,
  allowedTypes: ["image/jpeg", "image/png"],
  allowedExtensions: [".jpg", ".jpeg", ".png"],
} as const;

export function validateAvatarFile(file: File): { ok: boolean; error?: string } {
  if (!AVATAR_RULES.allowedTypes.includes(file.type as "image/jpeg" | "image/png")) {
    return { ok: false, error: "JPG or PNG only" };
  }
  if (file.size > AVATAR_RULES.maxSizeBytes) {
    return { ok: false, error: "Max size 5MB" };
  }
  return { ok: true };
}
