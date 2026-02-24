/**
 * In-memory signup flow store (mock).
 * Keyed by otp_ref. OTP expires in 5 min, max 5 attempts per channel.
 * Verify email first, then phone if provided.
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

export type VerifyChannel = "email" | "phone";

export interface SignupEntry {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  consent: SignupConsent;
  email_otp: string;
  phone_otp: string;
  expires_at: number;
  email_verified: boolean;
  phone_verified: boolean;
  email_attempts: number;
  phone_attempts: number;
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
 * Generates OTP for email and (if phone provided) for phone.
 */
export function createSignup(data: {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  consent: SignupConsent;
}): { otp_ref: string } {
  cleanup();
  const otp_ref = generateOtpRef();
  const hasPhone = (data.phone ?? "").trim().length > 0;
  store.set(otp_ref, {
    first_name: data.first_name.trim(),
    last_name: data.last_name.trim(),
    email: data.email.trim().toLowerCase(),
    phone: (data.phone ?? "").trim(),
    consent: data.consent,
    email_otp: generateOtp(),
    phone_otp: hasPhone ? generateOtp() : "",
    expires_at: Date.now() + OTP_TTL_MS,
    email_verified: false,
    phone_verified: false,
    email_attempts: 0,
    phone_attempts: 0,
  });
  return { otp_ref };
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
 * Verify OTP for a channel (email or phone). Returns true if valid.
 */
export function verifyOtp(otpRef: string, otp: string, channel: VerifyChannel): boolean {
  const entry = getByRef(otpRef);
  if (!entry) return false;
  const isEmail = channel === "email";
  const attempts = isEmail ? entry.email_attempts : entry.phone_attempts;
  const otpValue = isEmail ? entry.email_otp : entry.phone_otp;
  if (isEmail) {
    entry.email_attempts += 1;
    if (entry.email_attempts > MAX_OTP_ATTEMPTS) {
      store.delete(otpRef);
      return false;
    }
    if (entry.email_otp !== otp) return false;
    entry.email_verified = true;
  } else {
    if (!entry.phone) return false;
    entry.phone_attempts += 1;
    if (entry.phone_attempts > MAX_OTP_ATTEMPTS) {
      store.delete(otpRef);
      return false;
    }
    if (entry.phone_otp !== otp) return false;
    entry.phone_verified = true;
  }
  return true;
}

/**
 * Resend OTP for a channel. Resets that channel's OTP and expiry. Returns true if sent.
 */
export function resendOtp(otpRef: string, channel: VerifyChannel): boolean {
  const entry = getByRef(otpRef);
  if (!entry) return false;
  if (channel === "phone" && !entry.phone) return false;
  if (channel === "email") {
    entry.email_otp = generateOtp();
    entry.email_attempts = 0;
  } else {
    entry.phone_otp = generateOtp();
    entry.phone_attempts = 0;
  }
  entry.expires_at = Date.now() + OTP_TTL_MS;
  return true;
}

/**
 * Consume signup: return entry only if email verified and (if phone) phone verified. Then delete.
 */
export function consumeAndGet(otpRef: string): SignupEntry | null {
  const entry = store.get(otpRef) ?? null;
  if (!entry) return null;
  const hasPhone = entry.phone.length > 0;
  const allVerified = entry.email_verified && (!hasPhone || entry.phone_verified);
  if (!allVerified) return null;
  store.delete(otpRef);
  return entry;
}
