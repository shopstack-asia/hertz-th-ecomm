/**
 * In-memory OTP store (mock).
 * Rate limit: 5 attempts per key. OTP expires in 5 minutes. Resend after 60s.
 */

const OTP_TTL_MS = 5 * 60 * 1000;
const RESEND_COOLDOWN_MS = 60 * 1000;
const MAX_ATTEMPTS = 5;

interface OTPRecord {
  otp: string;
  type: "email" | "phone";
  new_value: string;
  created_at: number;
  attempts: number;
}

const globalForOtp = globalThis as unknown as { __hertzOtpStore?: Map<string, OTPRecord> };
const store = globalForOtp.__hertzOtpStore ?? new Map<string, OTPRecord>();
if (process.env.NODE_ENV !== "production") {
  globalForOtp.__hertzOtpStore = store;
}

function key(type: string, newValue: string): string {
  return `${type}:${newValue.trim().toLowerCase()}`;
}

function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export function createOtp(type: "email" | "phone", new_value: string): { otp: string; ok: boolean; error?: string } {
  const k = key(type, new_value);
  const existing = store.get(k);
  const now = Date.now();
  if (existing && now < existing.created_at + RESEND_COOLDOWN_MS) {
    const waitSec = Math.ceil((existing.created_at + RESEND_COOLDOWN_MS - now) / 1000);
    return { otp: "", ok: false, error: `Resend available in ${waitSec}s` };
  }
  const otp = generateOtp();
  store.set(k, {
    otp,
    type,
    new_value: new_value.trim(),
    created_at: now,
    attempts: 0,
  });
  return { otp, ok: true };
}

export function verifyOtp(
  type: "email" | "phone",
  new_value: string,
  otp: string
): { success: boolean; error?: string } {
  const k = key(type, new_value);
  const record = store.get(k);
  if (!record) {
    return { success: false, error: "OTP expired or not found" };
  }
  const now = Date.now();
  if (now > record.created_at + OTP_TTL_MS) {
    store.delete(k);
    return { success: false, error: "OTP expired" };
  }
  record.attempts += 1;
  if (record.attempts > MAX_ATTEMPTS) {
    store.delete(k);
    return { success: false, error: "Too many attempts" };
  }
  if (record.otp !== otp) {
    return { success: false, error: "Invalid code" };
  }
  store.delete(k);
  return { success: true };
}
