"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { FormField } from "@/components/ui/FormField";
import { OtpInput } from "@/components/auth/OtpInput";
import { useLanguage } from "@/contexts/LanguageContext";

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
  const { t } = useLanguage();
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
        setError(data.error === "Email not found" ? t("auth.email_not_found") : data.error ?? t("auth.failed_send_otp"));
        setLoading(false);
        return;
      }
      setOtpRef(data.otp_ref ?? "");
      saveStored(email.trim(), data.otp_ref ?? "", "verify");
      setSuccessToast(t("auth.otp_sent_toast"));
      setResendCooldown(RESEND_COOLDOWN_SEC);
      setStep("verify");
      setOtp("");
    } catch {
      setError(t("auth.failed_send_otp"));
    } finally {
      setLoading(false);
    }
  }, [email, t]);

  const handleVerifyOtp = useCallback(async () => {
    if (otp.replace(/\D/g, "").length !== 6) {
      setError(t("auth.enter_6_digit"));
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
            ? t("auth.code_expired")
            : data.error === "INVALID_OTP"
              ? t("auth.invalid_otp")
              : data.error ?? t("auth.verification_failed")
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
      setError(t("auth.verification_failed"));
    } finally {
      setLoading(false);
    }
  }, [email, otp, otpRef, t]);

  const handleReset = useCallback(async () => {
    if (newPassword.length < 8) {
      setError(t("auth.password_min_length"));
      return;
    }
    if (!/.*[a-zA-Z].*/.test(newPassword) || !/.*[0-9].*/.test(newPassword)) {
      setError(t("auth.password_letters_numbers"));
      return;
    }
    if (newPassword !== confirmPassword) {
      setError(t("auth.passwords_no_match"));
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
        setError(data.error === "OTP_NOT_VERIFIED" ? t("auth.session_expired_start") : data.error ?? t("auth.update_failed"));
        setLoading(false);
        return;
      }
      clearStored();
      router.push("/account/login?reset=success");
    } catch {
      setError(t("auth.update_failed"));
    } finally {
      setLoading(false);
    }
  }, [email, otpRef, newPassword, confirmPassword, router, t]);

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
        setError(data.error ?? t("auth.resend_failed"));
      } else {
        setOtpRef(data.otp_ref ?? otpRef);
        if (data.otp_ref) saveStored(email.trim(), data.otp_ref, "verify");
        setSuccessToast(t("auth.otp_sent_toast"));
        setResendCooldown(RESEND_COOLDOWN_SEC);
        setOtp("");
      }
    } catch {
      setError(t("auth.resend_failed"));
    } finally {
      setLoading(false);
    }
  }, [email, otpRef, resendCooldown, t]);

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
            {t("auth.forgot_title")}
          </h1>
          <p className="mb-6 text-sm text-hertz-black-60">
            {t("auth.forgot_intro")}
          </p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleRequestOtp();
            }}
            className="rounded-2xl border border-gray-200 bg-white p-6 shadow-card"
          >
            <FormField
              label={t("auth.email")}
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
              {loading ? t("auth.sending") : t("auth.send_otp")}
            </button>
            <Link
              href="/account/login"
              className="mt-4 block text-center text-sm text-hertz-black-60 hover:underline"
            >
              {t("auth.back_to_login")}
            </Link>
          </form>
        </div>
      )}

      {step === "verify" && (
        <div className="animate-fade-in">
          <h1 className="mb-1 text-2xl font-bold text-hertz-black-90">
            {t("auth.enter_otp")}
          </h1>
          <p className="mb-6 text-sm text-hertz-black-60">
            {t("auth.otp_sent_to", { email })}
          </p>
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-card">
            <OtpInput
              value={otp}
              onChange={setOtp}
              length={6}
              disabled={loading}
              error={!!error}
              aria-label={t("auth.otp_aria")}
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
              {loading ? t("auth.verifying") : t("auth.verify")}
            </button>
            <div className="mt-4 flex flex-col items-center gap-2 sm:flex-row sm:justify-between">
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={loading || resendCooldown > 0}
                className="text-sm font-medium text-hertz-black-80 disabled:opacity-50 hover:underline"
              >
                {resendCooldown > 0
                  ? t("auth.resend_otp_seconds", { seconds: resendCooldown })
                  : t("auth.resend_otp")}
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
                {t("auth.change_email")}
              </button>
            </div>
            <p className="mt-4 text-center text-xs text-hertz-black-60">
              {t("auth.mock_otp_hint")} <strong>123456</strong>
            </p>
          </div>
        </div>
      )}

      {step === "reset" && (
        <div className="animate-fade-in">
          <h1 className="mb-1 text-2xl font-bold text-hertz-black-90">
            {t("auth.create_new_password")}
          </h1>
          <p className="mb-6 text-sm text-hertz-black-60">
            {t("auth.choose_password")}
          </p>
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-card">
            <div className="space-y-4">
              <FormField
                label={t("auth.new_password")}
                type={showPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                autoComplete="new-password"
              />
              <FormField
                label={t("auth.confirm_new_password")}
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
                aria-label={showPassword ? t("auth.hide_password") : t("auth.show_password")}
              >
                {showPassword ? (
                  <>
                    <svg className="h-5 w-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                    {t("auth.hide_password")}
                  </>
                ) : (
                  <>
                    <svg className="h-5 w-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    {t("auth.show_password")}
                  </>
                )}
              </button>
            </div>
            <p className="mt-2 text-xs text-hertz-black-60">
              {t("auth.password_hint")}
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
              {loading ? t("auth.updating") : t("auth.update_password")}
            </button>
            <button
              type="button"
              onClick={() => setStep("verify")}
              className="mt-4 block w-full text-center text-sm text-hertz-black-60 hover:underline"
            >
              {t("auth.back")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function ForgotPasswordFallback() {
  const { t } = useLanguage();
  return <div className="mx-auto max-w-md px-4 py-8">{t("auth.loading")}</div>;
}

export default function ForgotPasswordPage() {
  return (
    <Suspense fallback={<ForgotPasswordFallback />}>
      <ForgotPasswordContent />
    </Suspense>
  );
}
