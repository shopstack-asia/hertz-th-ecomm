"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import { FormField } from "@/components/ui/FormField";
import { OtpInput } from "@/components/auth/OtpInput";
import { ConsentModal } from "@/components/auth/ConsentModal";
import { MOCK_TERMS_PARAGRAPHS, MOCK_PRIVACY_PARAGRAPHS } from "@/lib/mock/legal_content";

const STORAGE_KEY = "hertz_signup";
const RESEND_COOLDOWN_SEC = 30;
const CONSENT_VERSION = "2026.01";

type Step = 1 | 2 | 3;

interface SignupPersist {
  step: Step;
  otp_ref: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
}

function getSafeNext(next: string | null): string {
  if (!next) return "/";
  const decoded = decodeURIComponent(next);
  if (!decoded.startsWith("/") || decoded.startsWith("//")) return "/";
  return decoded;
}

const STEP_KEYS = ["signup.step_information", "signup.step_verification", "signup.step_password"] as const;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[\d\s\-+()]{8,20}$/;

function StepIndicator({ current, t }: { current: Step; t: (key: string) => string }) {
  const trackLeft = (1 / 6) * 100;
  const trackRight = (1 / 6) * 100;
  const progressPercent = current >= 3 ? 100 : current >= 2 ? 50 : 0;

  return (
    <nav aria-label={t("signup.progress_aria")} className="relative mb-8">
      {/* เส้นเทาเส้นเดียวทั้งแถบ – อยู่หลังวงกลม */}
      <div
        className="absolute top-4 h-px bg-gray-200"
        style={{
          left: `${trackLeft}%`,
          right: `${trackRight}%`,
        }}
        aria-hidden
      />
      {/* เส้นเหลืองความคืบหน้า – เส้นเดียว */}
      <div
        className="absolute top-4 h-px bg-hertz-yellow transition-all duration-300"
        style={{
          left: `${trackLeft}%`,
          width: `${progressPercent * (100 - trackLeft - trackRight) * 0.01}%`,
        }}
        aria-hidden
      />
      <ol className="relative flex items-start justify-between gap-2">
        {STEP_KEYS.map((key, i) => {
          const num = (i + 1) as Step;
          const isActive = current === num;
          const isPast = current > num;
          return (
            <li key={num} className="flex flex-1 flex-col items-center min-w-0">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center">
                <span
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold transition-colors ${
                    isActive
                      ? "bg-hertz-yellow text-hertz-black-90"
                      : isPast
                        ? "bg-hertz-yellow text-hertz-black-90"
                        : "bg-gray-200 text-hertz-black-60"
                  }`}
                >
                  {isPast ? "✓" : num}
                </span>
              </div>
              <span
                className={`mt-1.5 text-center text-xs font-medium sm:text-sm ${
                  isActive ? "text-hertz-black-90" : "text-hertz-black-60"
                }`}
              >
                {t(key)}
              </span>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

function SignupContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useLanguage();
  const nextUrl = getSafeNext(searchParams.get("next") ?? searchParams.get("returnUrl"));

  const [step, setStep] = useState<Step>(1);
  const [otpRef, setOtpRef] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [verifyStep, setVerifyStep] = useState<"email" | "phone">("email");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [acceptPrivacy, setAcceptPrivacy] = useState(false);
  const [acceptMarketing, setAcceptMarketing] = useState(false);
  const [consentModal, setConsentModal] = useState<"terms" | "privacy" | null>(null);

  // Restore from sessionStorage on mount
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const data = JSON.parse(raw) as SignupPersist;
      if (data.otp_ref && data.step) {
        setStep(data.step);
        setOtpRef(data.otp_ref);
        setFirstName(data.first_name ?? "");
        setLastName(data.last_name ?? "");
        setEmail(data.email ?? "");
        setPhone(data.phone ?? "");
      }
    } catch {
      // ignore
    }
  }, []);

  const persist = useCallback(
    (s: Step, ref: string) => {
      const payload: SignupPersist = {
        step: s,
        otp_ref: ref,
        first_name: firstName,
        last_name: lastName,
        email,
        phone,
      };
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    },
    [firstName, lastName, email, phone]
  );

  const clearPersist = useCallback(() => {
    sessionStorage.removeItem(STORAGE_KEY);
  }, []);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const t = setInterval(() => setResendCooldown((c) => c - 1), 1000);
    return () => clearInterval(t);
  }, [resendCooldown]);

  // Step 1: init
  const handleContinue = useCallback(async () => {
    setError(null);
    const fn = firstName.trim();
    const ln = lastName.trim();
    const em = email.trim().toLowerCase();
    const ph = phone.trim();

    if (!fn || !ln) {
      setError(t("signup.error_first_last_required"));
      return;
    }
    if (!em) {
      setError(t("signup.error_email_required"));
      return;
    }
    if (!EMAIL_REGEX.test(em)) {
      setError(t("signup.error_email_invalid"));
      return;
    }
    if (ph && !PHONE_REGEX.test(ph)) {
      setError(t("signup.error_phone_invalid"));
      return;
    }
    if (!acceptTerms || !acceptPrivacy) {
      setError(t("signup.error_accept_terms"));
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/signup/init", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          first_name: fn,
          last_name: ln,
          email: em,
          phone: ph || undefined,
          consent: {
            accept_terms: true,
            accept_privacy: true,
            accept_marketing: acceptMarketing,
            consent_version: CONSENT_VERSION,
            consent_timestamp: new Date().toISOString(),
          },
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? t("signup.error_generic"));
        return;
      }
      setOtpRef(data.otp_ref);
      setStep(2);
      setVerifyStep("email");
      persist(2, data.otp_ref);
      setOtp("");
      setResendCooldown(RESEND_COOLDOWN_SEC);
    } catch {
      setError(t("signup.error_generic"));
    } finally {
      setLoading(false);
    }
  }, [firstName, lastName, email, phone, acceptTerms, acceptPrivacy, acceptMarketing, persist, t]);

  // Step 2: verify OTP (email first, then phone if provided)
  const verifyTarget = verifyStep === "phone" ? phone : email;
  const handleVerifyOtp = useCallback(async () => {
    if (otp.replace(/\D/g, "").length !== 6) {
      setError(t("auth.enter_6_digit"));
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/auth/signup/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          otp_ref: otpRef,
          otp: otp.replace(/\D/g, ""),
          channel: verifyStep,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message ?? data.error ?? t("signup.error_invalid_otp"));
        return;
      }
      if (data.has_phone && !data.phone_verified) {
        setVerifyStep("phone");
        setOtp("");
        setResendCooldown(RESEND_COOLDOWN_SEC);
      } else {
        setStep(3);
        persist(3, otpRef);
        setPassword("");
        setConfirmPassword("");
      }
    } catch {
      setError(t("auth.verification_failed"));
    } finally {
      setLoading(false);
    }
  }, [otpRef, otp, verifyStep, persist, t]);

  const handleResendOtp = useCallback(async () => {
    if (resendCooldown > 0) return;
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/auth/signup/resend-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ otp_ref: otpRef, channel: verifyStep }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? t("signup.error_resend_failed"));
      } else {
        setResendCooldown(RESEND_COOLDOWN_SEC);
        setOtp("");
      }
    } catch {
      setError(t("signup.error_resend_failed"));
    } finally {
      setLoading(false);
    }
  }, [otpRef, verifyStep, resendCooldown, t]);

  const handleBackToInfo = useCallback(() => {
    setStep(1);
    setVerifyStep("email");
    setError(null);
    setOtp("");
    persist(1, otpRef);
  }, [otpRef, persist]);

  // Step 3: complete
  const passwordValid =
    password.length >= 8 &&
    /[a-zA-Z]/.test(password) &&
    /\d/.test(password) &&
    password === confirmPassword;

  const handleCreateAccount = useCallback(async () => {
    if (!passwordValid) return;
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/auth/signup/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ otp_ref: otpRef, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? t("signup.error_generic"));
        return;
      }
      clearPersist();
      const params = new URLSearchParams();
      if (nextUrl && nextUrl !== "/") params.set("next", nextUrl);
      if (data.user?.email) params.set("email", data.user.email);
      if (data.user?.first_name) params.set("firstName", data.user.first_name);
      const welcomeUrl = `/signup/welcome${params.toString() ? `?${params.toString()}` : ""}`;
      router.replace(welcomeUrl);
    } catch {
      setError(t("signup.error_generic"));
    } finally {
      setLoading(false);
    }
  }, [otpRef, password, passwordValid, clearPersist, nextUrl, router, t]);

  const loginHref = nextUrl !== "/" ? `/account/login?next=${encodeURIComponent(nextUrl)}` : "/account/login";

  return (
    <div className="mx-auto max-w-md px-4 py-8">
      <StepIndicator current={step} t={t} />

      {step === 1 && (
        <div className="animate-fade-in">
          <h1 className="mb-2 text-2xl font-bold text-hertz-black-90">
            {t("signup.create_account")}
          </h1>
          <p className="mb-6 text-sm text-hertz-black-60">
            {t("signup.enter_details")}
          </p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleContinue();
            }}
            className="rounded-2xl border border-gray-200 bg-white p-6 shadow-card"
          >
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  label={t("signup.first_name")}
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                  autoComplete="given-name"
                />
                <FormField
                  label={t("signup.last_name")}
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                  autoComplete="family-name"
                />
              </div>
              <FormField
                label={t("auth.email")}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
              <FormField
                label={t("signup.phone_optional")}
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder={t("signup.phone_placeholder")}
                autoComplete="tel"
              />
            </div>

            <div className="mt-6 border-t border-gray-200 pt-6">
              <h3 className="mb-3 text-sm font-semibold text-hertz-black-90">
                {t("signup.legal_consent")}
              </h3>
              <div className="space-y-3 text-sm text-hertz-black-80">
                <label className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={acceptTerms}
                    onChange={(e) => setAcceptTerms(e.target.checked)}
                    className="mt-1 h-4 w-4 rounded border-gray-300 text-hertz-yellow focus:ring-hertz-yellow"
                  />
                  <span>
                    {t("signup.agree_terms")}{" "}
                    <button
                      type="button"
                      onClick={() => setConsentModal("terms")}
                      className="underline decoration-hertz-black-60 underline-offset-2 hover:decoration-hertz-yellow hover:text-hertz-black-90"
                    >
                      {t("signup.terms_conditions")}
                    </button>
                    <span className="text-red-600"> *</span>
                  </span>
                </label>
                <label className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={acceptPrivacy}
                    onChange={(e) => setAcceptPrivacy(e.target.checked)}
                    className="mt-1 h-4 w-4 rounded border-gray-300 text-hertz-yellow focus:ring-hertz-yellow"
                  />
                  <span>
                    {t("signup.agree_privacy")}{" "}
                    <button
                      type="button"
                      onClick={() => setConsentModal("privacy")}
                      className="underline decoration-hertz-black-60 underline-offset-2 hover:decoration-hertz-yellow hover:text-hertz-black-90"
                    >
                      {t("signup.privacy_policy")}
                    </button>
                    <span className="text-red-600"> *</span>
                  </span>
                </label>
                <label className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={acceptMarketing}
                    onChange={(e) => setAcceptMarketing(e.target.checked)}
                    className="mt-1 h-4 w-4 rounded border-gray-300 text-hertz-yellow focus:ring-hertz-yellow"
                  />
                  <span>
                    {t("signup.agree_marketing")}
                  </span>
                </label>
              </div>
            </div>

            {error && (
              <p className="mt-3 text-sm text-red-600" role="alert">
                {error}
              </p>
            )}
            <button
              type="submit"
              disabled={loading || !acceptTerms || !acceptPrivacy}
              className="mt-6 flex h-12 w-full items-center justify-center rounded-xl bg-hertz-yellow font-semibold text-hertz-black-90 transition-opacity disabled:opacity-50"
            >
              {loading ? t("signup.continue_loading") : t("signup.continue")}
            </button>
          </form>

          <ConsentModal
            open={consentModal === "terms"}
            onClose={() => setConsentModal(null)}
            onAccept={() => setAcceptTerms(true)}
            title={t("signup.terms_conditions")}
          >
            {MOCK_TERMS_PARAGRAPHS.map((p, i) => (
              <p key={i} className="mb-3 last:mb-0">
                {p}
              </p>
            ))}
          </ConsentModal>
          <ConsentModal
            open={consentModal === "privacy"}
            onClose={() => setConsentModal(null)}
            onAccept={() => setAcceptPrivacy(true)}
            title={t("signup.privacy_policy")}
          >
            {MOCK_PRIVACY_PARAGRAPHS.map((p, i) => (
              <p key={i} className="mb-3 last:mb-0">
                {p}
              </p>
            ))}
          </ConsentModal>
        </div>
      )}

      {step === 2 && (
        <div className="animate-fade-in">
          <h1 className="mb-2 text-2xl font-bold text-hertz-black-90">
            {verifyStep === "email" ? t("signup.verify_email") : t("signup.verify_phone")}
          </h1>
          <p className="mb-6 text-sm text-hertz-black-60">
            {t("signup.otp_sent_to", { target: verifyTarget })}
          </p>
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-card">
            <OtpInput
              value={otp}
              onChange={setOtp}
              length={6}
              disabled={loading}
              error={!!error}
              aria-label={t("signup.verification_code_aria")}
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
            <div className="mt-4 flex flex-col items-center gap-3 sm:flex-row sm:justify-between">
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={loading || resendCooldown > 0}
                className="text-sm font-medium text-hertz-black-80 disabled:opacity-50 hover:underline"
              >
                {resendCooldown > 0 ? t("signup.resend_code_seconds", { seconds: resendCooldown }) : t("signup.resend_code")}
              </button>
              <button
                type="button"
                onClick={handleBackToInfo}
                disabled={loading}
                className="text-sm text-hertz-black-60 hover:underline"
              >
                {t("signup.edit_information")}
              </button>
            </div>
            <p className="mt-4 text-center text-xs text-hertz-black-60">
              {t("signup.mock_otp_code")} <strong>123456</strong>
            </p>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="animate-fade-in">
          <h1 className="mb-2 text-2xl font-bold text-hertz-black-90">
            {t("signup.create_password")}
          </h1>
          <p className="mb-6 text-sm text-hertz-black-60">
            {t("auth.password_hint")}
          </p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleCreateAccount();
            }}
            className="rounded-2xl border border-gray-200 bg-white p-6 shadow-card"
          >
            <div className="space-y-4">
              <FormField
                label={t("auth.password")}
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="new-password"
              />
              <FormField
                label={t("signup.confirm_password")}
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
            {password && password.length > 0 && (
              <ul className="mt-2 text-xs text-hertz-black-60">
                <li className={password.length >= 8 ? "text-green-600" : ""}>
                  {password.length >= 8 ? "✓" : "○"} {t("signup.password_requirement_8")}
                </li>
                <li className={/[a-zA-Z]/.test(password) && /\d/.test(password) ? "text-green-600" : ""}>
                  {/[a-zA-Z]/.test(password) && /\d/.test(password) ? "✓" : "○"} {t("signup.password_requirement_letters")}
                </li>
              </ul>
            )}
            {confirmPassword && password !== confirmPassword && (
              <p className="mt-1 text-sm text-red-600">{t("auth.passwords_no_match")}</p>
            )}
            {error && (
              <p className="mt-3 text-sm text-red-600" role="alert">
                {error}
              </p>
            )}
            <button
              type="submit"
              disabled={loading || !passwordValid}
              className="mt-6 flex h-12 w-full items-center justify-center rounded-xl bg-hertz-yellow font-semibold text-hertz-black-90 transition-opacity disabled:opacity-50"
            >
              {loading ? t("signup.creating_account") : t("signup.create_account")}
            </button>
          </form>
        </div>
      )}

      <p className="mt-6 text-center text-hertz-black-80">
        {t("signup.already_have_account")}{" "}
        <Link href={loginHref} className="font-medium text-hertz-yellow underline">
          {t("auth.log_in")}
        </Link>
      </p>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-md px-4 py-8">
          <div className="h-8 w-full animate-pulse rounded bg-gray-200" />
          <div className="mt-8 h-64 animate-pulse rounded-2xl bg-gray-100" />
        </div>
      }
    >
      <SignupContent />
    </Suspense>
  );
}
