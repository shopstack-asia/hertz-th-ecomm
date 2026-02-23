"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { FormField } from "@/components/ui/FormField";
import { OtpInput } from "@/components/auth/OtpInput";

const STORAGE_KEY = "hertz_fp";
const RESEND_COOLDOWN_SEC = 30;

type Step = "request" | "verify" | "reset";

function loadStored(): { email: string; otp_ref: string; step?: Step } | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    if (data?.email && data?.otp_ref) return data;
  } catch {
    // ignore
  }
  return null;
}

function saveStored(email: string, otpRef: string, step?: Step) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ email, otp_ref: otpRef, step }));
  } catch {
    // ignore
  }
}

function clearStored() {
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}

function ForgotPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [step, setStep] = useState<Step>("request");
  const [email, setEmail] = useState("");
  const [otpRef, setOtpRef] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const q = searchParams.get("step");
    const stored = loadStored();
    if (stored?.email && stored?.otp_ref) {
      setEmail(stored.email);
      setOtpRef(stored.otp_ref);
      if (q === "verify" || q === "reset") {
        setStep(q === "reset" ? "reset" : "verify");
      } else if (stored.step === "reset" || stored.step === "verify") {
        setStep(stored.step);
      }
    }
  }, [searchParams]);

  useEffect(() => {
    if (successToast) {
      const t = setTimeout(() => setSuccessToast(null), 4000);
      return () => clearTimeout(t);
    }
  }, [successToast]);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const t = setInterval(() => setResendCooldown((c) => c - 1), 1000);
    return () => clearInterval(t);
  }, [resendCooldown]);

  const handleRequestOtp = useCallback(async () => {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/auth/forgot-password/request-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error === "Email not found" ? "Email not found" : data.error ?? "Failed to send OTP");
        setLoading(false);
        return;
      }
      setOtpRef(data.otp_ref ?? "");
      saveStored(email.trim(), data.otp_ref ?? "", "verify");
      setSuccessToast("OTP sent to your email");
      setResendCooldown(RESEND_COOLDOWN_SEC);
      setStep("verify");
      setOtp("");
    } catch {
      setError("Failed to send OTP");
    } finally {
      setLoading(false);
    }
  }, [email]);

  const handleVerifyOtp = useCallback(async () => {
    if (otp.replace(/\D/g, "").length !== 6) {
      setError("Enter 6-digit code");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/auth/forgot-password/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          otp: otp.replace(/\D/g, ""),
          otp_ref: otpRef,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(
          data.error === "OTP_EXPIRED"
            ? "Code expired. Please request a new one."
            : data.error === "INVALID_OTP"
              ? "Invalid or expired code. Try again or resend."
              : data.error ?? "Verification failed"
        );
        setLoading(false);
        return;
      }
      setStep("reset");
      saveStored(email.trim(), otpRef, "reset");
      setNewPassword("");
      setConfirmPassword("");
      setError(null);
    } catch {
      setError("Verification failed");
    } finally {
      setLoading(false);
    }
  }, [email, otp, otpRef]);

  const handleReset = useCallback(async () => {
    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
    if (!/.*[a-zA-Z].*/.test(newPassword) || !/.*[0-9].*/.test(newPassword)) {
      setError("Password must contain letters and numbers");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/auth/forgot-password/reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          otp_ref: otpRef,
          new_password: newPassword,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error === "OTP_NOT_VERIFIED" ? "Session expired. Please start again." : data.error ?? "Update failed");
        setLoading(false);
        return;
      }
      clearStored();
      router.push("/account/login?reset=success");
    } catch {
      setError("Update failed");
    } finally {
      setLoading(false);
    }
  }, [email, otpRef, newPassword, confirmPassword, router]);

  const handleResendOtp = useCallback(async () => {
    if (resendCooldown > 0) return;
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/auth/forgot-password/request-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Resend failed");
      } else {
        setOtpRef(data.otp_ref ?? otpRef);
        if (data.otp_ref) saveStored(email.trim(), data.otp_ref, "verify");
        setSuccessToast("OTP sent to your email");
        setResendCooldown(RESEND_COOLDOWN_SEC);
        setOtp("");
      }
    } catch {
      setError("Resend failed");
    } finally {
      setLoading(false);
    }
  }, [email, otpRef, resendCooldown]);

  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  return (
    <div className="mx-auto max-w-md px-4 py-8">
      {successToast && (
        <div
          className="mb-4 rounded-xl border border-hertz-yellow/60 bg-hertz-yellow/10 px-4 py-3 text-sm font-medium text-hertz-black-90"
          role="status"
        >
          {successToast}
        </div>
      )}

      {step === "request" && (
        <div className="animate-fade-in">
          <h1 className="mb-1 text-2xl font-bold text-hertz-black-90">
            Forgot password
          </h1>
          <p className="mb-6 text-sm text-hertz-black-60">
            Enter your email to receive a one-time code.
          </p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleRequestOtp();
            }}
            className="rounded-2xl border border-gray-200 bg-white p-6 shadow-card"
          >
            <FormField
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
            {error && (
              <p className="mt-2 text-sm text-red-600" role="alert">
                {error}
              </p>
            )}
            <button
              type="submit"
              disabled={loading || !isValidEmail}
              className="mt-6 flex h-12 w-full items-center justify-center rounded-xl bg-hertz-yellow font-semibold text-hertz-black-90 transition-opacity disabled:opacity-50"
            >
              {loading ? "Sending…" : "Send OTP"}
            </button>
            <Link
              href="/account/login"
              className="mt-4 block text-center text-sm text-hertz-black-60 hover:underline"
            >
              Back to log in
            </Link>
          </form>
        </div>
      )}

      {step === "verify" && (
        <div className="animate-fade-in">
          <h1 className="mb-1 text-2xl font-bold text-hertz-black-90">
            Enter OTP
          </h1>
          <p className="mb-6 text-sm text-hertz-black-60">
            We sent a 6-digit code to {email}
          </p>
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-card">
            <OtpInput
              value={otp}
              onChange={setOtp}
              length={6}
              disabled={loading}
              error={!!error}
              aria-label="One-time password"
            />
            {error && (
              <p className="mt-3 text-sm text-red-600" role="alert">
                {error}
              </p>
            )}
            <button
              type="button"
              onClick={handleVerifyOtp}
              disabled={loading || otp.replace(/\D/g, "").length !== 6}
              className="mt-6 flex h-12 w-full items-center justify-center rounded-xl bg-hertz-yellow font-semibold text-hertz-black-90 transition-opacity disabled:opacity-50"
            >
              {loading ? "Verifying…" : "Verify"}
            </button>
            <div className="mt-4 flex flex-col items-center gap-2 sm:flex-row sm:justify-between">
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={loading || resendCooldown > 0}
                className="text-sm font-medium text-hertz-black-80 disabled:opacity-50 hover:underline"
              >
                {resendCooldown > 0
                  ? `Resend OTP (${resendCooldown}s)`
                  : "Resend OTP"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setStep("request");
                  setError(null);
                  setOtp("");
                  clearStored();
                }}
                className="text-sm text-hertz-black-60 hover:underline"
              >
                Change email
              </button>
            </div>
            <p className="mt-4 text-center text-xs text-hertz-black-60">
              Mock: ใช้รหัส OTP <strong>123456</strong>
            </p>
          </div>
        </div>
      )}

      {step === "reset" && (
        <div className="animate-fade-in">
          <h1 className="mb-1 text-2xl font-bold text-hertz-black-90">
            Create new password
          </h1>
          <p className="mb-6 text-sm text-hertz-black-60">
            Choose a strong password for your account.
          </p>
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-card">
            <div className="space-y-4">
              <FormField
                label="New password"
                type={showPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                autoComplete="new-password"
              />
              <FormField
                label="Confirm new password"
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="inline-flex items-center gap-2 text-sm text-hertz-black-60 hover:text-hertz-black-80 hover:underline"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <>
                    <svg className="h-5 w-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                    Hide password
                  </>
                ) : (
                  <>
                    <svg className="h-5 w-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    Show password
                  </>
                )}
              </button>
            </div>
            <p className="mt-2 text-xs text-hertz-black-60">
              At least 8 characters, with letters and numbers.
            </p>
            {error && (
              <p className="mt-2 text-sm text-red-600" role="alert">
                {error}
              </p>
            )}
            <button
              type="button"
              onClick={handleReset}
              disabled={loading}
              className="mt-6 flex h-12 w-full items-center justify-center rounded-xl bg-hertz-yellow font-semibold text-hertz-black-90 transition-opacity disabled:opacity-50"
            >
              {loading ? "Updating…" : "Update password"}
            </button>
            <button
              type="button"
              onClick={() => setStep("verify")}
              className="mt-4 block w-full text-center text-sm text-hertz-black-60 hover:underline"
            >
              Back
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ForgotPasswordPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-md px-4 py-8">Loading…</div>}>
      <ForgotPasswordContent />
    </Suspense>
  );
}
