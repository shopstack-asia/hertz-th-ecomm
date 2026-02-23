/**
 * In-memory OTP store for login (mock).
 * Replace with Redis/DB in production.
 * Keyed by email (lowercase). OTP expires after OTP_TTL_MS.
 */

const OTP_TTL_MS = 10 * 60 * 1000; // 10 minutes

export interface StoredOtp {
  email: string;
  otp: string;
  expires_at: number;
}

const globalForOtp = globalThis as unknown as {
  __hertzOtpStore?: Map<string, StoredOtp>;
};
const store = globalForOtp.__hertzOtpStore ?? new Map<string, StoredOtp>();
if (process.env.NODE_ENV !== "production") {
  globalForOtp.__hertzOtpStore = store;
}

function key(email: string): string {
  return email.trim().toLowerCase();
}

function profileKey(type: "email" | "phone", value: string): string {
  const v = value.trim();
  return type === "email" ? v.toLowerCase() : `phone:${v}`;
}

function isExpired(entry: StoredOtp): boolean {
  return Date.now() > entry.expires_at;
}

function cleanup(): void {
  for (const [k, v] of store.entries()) {
    if (isExpired(v)) store.delete(k);
  }
}

export function setOtp(email: string, otp: string): void {
  cleanup();
  const k = key(email);
  store.set(k, {
    email: email.trim().toLowerCase(),
    otp,
    expires_at: Date.now() + OTP_TTL_MS,
  });
}

export function getOtp(email: string): StoredOtp | null {
  cleanup();
  const entry = store.get(key(email)) ?? null;
  if (!entry || isExpired(entry)) {
    if (entry) store.delete(key(email));
    return null;
  }
  return entry;
}

export function consumeOtp(email: string, otp: string): boolean {
  const entry = getOtp(email);
  if (!entry || entry.otp !== otp) return false;
  store.delete(key(email));
  return true;
}

/** Profile flow: create OTP for email or phone. Returns { otp, ok } or { ok: false, error }. */
export function createOtp(
  type: "email" | "phone",
  value: string
): { otp?: string; ok: boolean; error?: string } {
  const v = value.trim();
  if (!v) return { ok: false, error: "Value required" };
  cleanup();
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const k = profileKey(type, value);
  store.set(k, {
    email: type === "email" ? v.toLowerCase() : "",
    otp,
    expires_at: Date.now() + OTP_TTL_MS,
  });
  return { otp, ok: true };
}

/** Profile flow: verify OTP for email or phone. */
export function verifyOtp(
  type: "email" | "phone",
  value: string,
  otp: string
): { success: boolean; error?: string } {
  const k = profileKey(type, value);
  const entry = store.get(k) ?? null;
  if (!entry || isExpired(entry)) {
    if (entry) store.delete(k);
    return { success: false, error: "Invalid or expired code" };
  }
  if (entry.otp !== otp) return { success: false, error: "Invalid code" };
  store.delete(k);
  return { success: true };
}
