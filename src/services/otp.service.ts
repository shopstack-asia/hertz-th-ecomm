/**
 * OTP service – request/verify and client-side rules.
 * Used by OTP modal and profile form.
 */

export const OTP_CONFIG = {
  length: 6,
  expirySeconds: 5 * 60,
  resendCooldownSeconds: 60,
  maxAttempts: 5,
} as const;

export function isValidOtpCode(value: string): boolean {
  return /^\d{6}$/.test(value);
}
