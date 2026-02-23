/**
 * In-memory OTP store for forgot-password flow (mock).
 * Keyed by otp_ref. Replace with Redis/DB in production.
 */

const OTP_TTL_MS = 10 * 60 * 1000; // 10 minutes

export interface ForgotPasswordOtpEntry {
  email: string;
  otp: string;
  expires_at: number;
  verified?: boolean;
}

const globalForFpOtp = globalThis as unknown as {
  __hertzFpOtpStore?: Map<string, ForgotPasswordOtpEntry>;
};
const store = globalForFpOtp.__hertzFpOtpStore ?? new Map<string, ForgotPasswordOtpEntry>();
if (process.env.NODE_ENV !== "production") {
  globalForFpOtp.__hertzFpOtpStore = store;
}

function isExpired(entry: ForgotPasswordOtpEntry): boolean {
  return Date.now() > entry.expires_at;
}

function cleanup(): void {
  for (const [k, v] of store.entries()) {
    if (isExpired(v)) store.delete(k);
  }
}

export function createOtp(email: string, otp: string): string {
  cleanup();
  const otpRef = "fp_" + Date.now() + "_" + Math.random().toString(36).slice(2, 10);
  store.set(otpRef, {
    email: email.trim().toLowerCase(),
    otp,
    expires_at: Date.now() + OTP_TTL_MS,
  });
  return otpRef;
}

export function getByRef(otpRef: string): ForgotPasswordOtpEntry | null {
  cleanup();
  const entry = store.get(otpRef) ?? null;
  if (!entry || isExpired(entry)) {
    if (entry) store.delete(otpRef);
    return null;
  }
  return entry;
}

export function verifyOtp(otpRef: string, email: string, otp: string): boolean {
  const entry = getByRef(otpRef);
  if (!entry) return false;
  if (entry.email !== email.trim().toLowerCase() || entry.otp !== otp) return false;
  entry.verified = true;
  return true;
}

export function consumeAndInvalidate(otpRef: string): boolean {
  const entry = store.get(otpRef);
  if (!entry || !entry.verified) return false;
  store.delete(otpRef);
  return true;
}
