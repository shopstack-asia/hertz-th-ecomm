/**
 * In-memory signup flow store (mock).
 * Keyed by otp_ref. OTP expires in 5 min, max 5 attempts.
 * Replace with Redis/DB in production.
 */

const OTP_TTL_MS = 5 * 60 * 1000; // 5 minutes
const MAX_OTP_ATTEMPTS = 5;

/** Consent as stored during signup (audit fields from request). */
export interface SignupConsent {
  accept_terms: boolean;
  accept_privacy: boolean;
  accept_marketing: boolean;
  consent_version: string;
  consent_timestamp: string;
  ip_address?: string;
  user_agent?: string;
}

export interface SignupEntry {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  consent: SignupConsent;
  otp: string;
  expires_at: number;
  verified: boolean;
  attempts: number;
}

const globalForSignup = globalThis as unknown as {
  __hertzSignupStore?: Map<string, SignupEntry>;
};
const store = globalForSignup.__hertzSignupStore ?? new Map<string, SignupEntry>();
if (process.env.NODE_ENV !== "production") {
  globalForSignup.__hertzSignupStore = store;
}

function isExpired(entry: SignupEntry): boolean {
  return Date.now() > entry.expires_at;
}

function cleanup(): void {
  for (const [k, v] of store.entries()) {
    if (isExpired(v)) store.delete(k);
  }
}

function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function generateOtpRef(): string {
  return "signup_" + Date.now() + "_" + Math.random().toString(36).slice(2, 10);
}

/**
 * Create signup flow: validate, store entry, return otp_ref.
 */
export function createSignup(data: {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  consent: SignupConsent;
}): { otp_ref: string; otp: string } {
  cleanup();
  const otp = generateOtp();
  const otp_ref = generateOtpRef();
  store.set(otp_ref, {
    first_name: data.first_name.trim(),
    last_name: data.last_name.trim(),
    email: data.email.trim().toLowerCase(),
    phone: (data.phone ?? "").trim(),
    consent: data.consent,
    otp,
    expires_at: Date.now() + OTP_TTL_MS,
    verified: false,
    attempts: 0,
  });
  return { otp_ref, otp };
}

/**
 * Get entry by otp_ref. Returns null if not found or expired.
 */
export function getByRef(otpRef: string): SignupEntry | null {
  cleanup();
  const entry = store.get(otpRef) ?? null;
  if (!entry || isExpired(entry)) {
    if (entry) store.delete(otpRef);
    return null;
  }
  return entry;
}

/**
 * Verify OTP. Increments attempts; returns false if wrong or max attempts exceeded.
 */
export function verifyOtp(otpRef: string, otp: string): boolean {
  const entry = getByRef(otpRef);
  if (!entry) return false;
  entry.attempts += 1;
  if (entry.attempts > MAX_OTP_ATTEMPTS) {
    store.delete(otpRef);
    return false;
  }
  if (entry.otp !== otp) return false;
  entry.verified = true;
  return true;
}

/**
 * Resend OTP for existing otp_ref (resets OTP and expiry). Returns true if sent.
 */
export function resendOtp(otpRef: string): boolean {
  const entry = getByRef(otpRef);
  if (!entry || entry.verified) return false;
  entry.otp = generateOtp();
  entry.expires_at = Date.now() + OTP_TTL_MS;
  entry.attempts = 0;
  return true;
}

/**
 * Consume verified otp_ref: return entry and delete. Returns null if not verified.
 */
export function consumeAndGet(otpRef: string): SignupEntry | null {
  const entry = store.get(otpRef) ?? null;
  if (!entry || !entry.verified) return null;
  store.delete(otpRef);
  return entry;
}
