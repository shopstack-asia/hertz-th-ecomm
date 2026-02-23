"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { FormField } from "@/components/ui/FormField";
import { OtpInput } from "@/components/auth/OtpInput";
import { useAuth } from "@/contexts/auth_context";

type LoginView = "otp-request" | "otp-verify" | "password";

function getSafeReturnUrl(returnUrl: string | null): string {
  if (!returnUrl) return "/";
  const decoded = decodeURIComponent(returnUrl);
  if (!decoded.startsWith("/") || decoded.startsWith("//")) return "/";
  return decoded;
}

const RESEND_COOLDOWN_SEC = 30;

function SocialLoginButtons({ returnUrl }: { returnUrl: string }) {
  const next = encodeURIComponent(returnUrl);
  return (
    <>
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-white px-3 text-sm text-hertz-black-60">or</span>
        </div>
      </div>
      <div className="flex flex-col gap-3">
        <a
          href={`/api/auth/oauth/google/start?next=${next}`}
          className="flex h-12 w-full items-center justify-center gap-3 rounded-xl border border-gray-300 bg-white font-medium text-hertz-black-90 transition-colors hover:bg-gray-50"
        >
          <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24" aria-hidden>
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          Continue with Google
        </a>
        <a
          href={`/api/auth/oauth/apple/start?next=${next}`}
          className="flex h-12 w-full items-center justify-center gap-3 rounded-xl border border-gray-300 bg-black font-medium text-white transition-colors hover:bg-gray-900"
        >
          <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91 1.09.07 2.18.93 2.77 1.07-.73 2.31-2.15 4.61-2.15 4.61s-1.28 2.28-2.92 4.59zM15 4.5c.68-.82 1.14-1.97.99-3.12-.14-1.12-.76-2.14-1.62-2.88-.86-.74-1.94-1.24-3.06-1.27-.12-.01-.24-.01-.36 0-1.18.08-2.27.57-3.13 1.31-.86.74-1.5 1.76-1.66 2.88-.15 1.11.24 2.25.92 3.07.68.82 1.62 1.36 2.66 1.5.12.01.24.02.36.02 1.12 0 2.2-.49 2.99-1.3z" />
          </svg>
          Continue with Apple
        </a>
      </div>
    </>
  );
}

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { loading: authLoading, authenticated, refreshAuth } = useAuth();
  const returnUrl = getSafeReturnUrl(
    searchParams.get("next") ?? searchParams.get("returnUrl")
  );

  useEffect(() => {
    if (!authLoading && authenticated) {
      router.replace(returnUrl);
    }
  }, [authLoading, authenticated, returnUrl, router]);

  const [view, setView] = useState<LoginView>("otp-request");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [resetSuccessShown, setResetSuccessShown] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (searchParams.get("reset") === "success" && !resetSuccessShown) {
      setSuccessToast("Password updated. Please log in.");
      setResetSuccessShown(true);
      router.replace("/account/login", { scroll: false });
    }
  }, [searchParams, resetSuccessShown, router]);

  const oauthError = searchParams.get("error");
  useEffect(() => {
    if (oauthError === "invalid_state") setError("Session expired. Please try again.");
    if (oauthError === "invalid_code") setError("Sign-in failed. Please try again.");
  }, [oauthError]);

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
      const res = await fetch("/api/auth/request-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Failed to send OTP");
        setLoading(false);
        return;
      }
      setSuccessToast("OTP sent to your email");
      setResendCooldown(RESEND_COOLDOWN_SEC);
      setView("otp-verify");
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
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email: email.trim(), otp: otp.replace(/\D/g, "") }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(
          data.error === "INVALID_OTP"
            ? "Invalid or expired code. Try again or resend."
            : data.error ?? "Verification failed"
        );
        setLoading(false);
        return;
      }
      await refreshAuth();
      router.push(returnUrl);
    } catch {
      setError("Verification failed");
    } finally {
      setLoading(false);
    }
  }, [email, otp, refreshAuth, returnUrl, router]);

  const handlePasswordLogin = useCallback(async () => {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email: email.trim(), password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Log in failed");
        setLoading(false);
        return;
      }
      await refreshAuth();
      router.push(returnUrl);
    } catch {
      setError("Log in failed");
    } finally {
      setLoading(false);
    }
  }, [email, password, refreshAuth, returnUrl, router]);

  const handleResendOtp = useCallback(async () => {
    if (resendCooldown > 0) return;
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/auth/request-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Resend failed");
      } else {
        setSuccessToast("OTP sent to your email");
        setResendCooldown(RESEND_COOLDOWN_SEC);
        setOtp("");
      }
    } catch {
      setError("Resend failed");
    } finally {
      setLoading(false);
    }
  }, [email, resendCooldown]);

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

      {view === "otp-request" && (
        <div className="animate-fade-in">
          <h1 className="mb-6 text-2xl font-bold text-hertz-black-90">
            Log in
          </h1>
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
              {loading ? "Sending…" : "Request OTP"}
            </button>
            <SocialLoginButtons returnUrl={returnUrl} />
            <div className="mt-4 flex items-center justify-between text-sm">
              <Link
                href="/account/forgot-password"
                className="text-hertz-black-60 hover:underline"
              >
                Forgot password?
              </Link>
              <button
                type="button"
                onClick={() => {
                  setView("password");
                  setError(null);
                }}
                className="font-medium text-hertz-black-80 hover:underline"
              >
                Log in by password
              </button>
            </div>
          </form>
        </div>
      )}

      {view === "otp-verify" && (
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
              {loading ? "Verifying…" : "Verify & Log in"}
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
                  setView("otp-request");
                  setError(null);
                  setOtp("");
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

      {view === "password" && (
        <div className="animate-fade-in">
          <h1 className="mb-6 text-2xl font-bold text-hertz-black-90">
            Log in
          </h1>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handlePasswordLogin();
            }}
            className="rounded-2xl border border-gray-200 bg-white p-6 shadow-card"
          >
            <div className="space-y-4">
              <FormField
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
              <FormField
                label="Password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
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
            {error && (
              <p className="mt-2 text-sm text-red-600" role="alert">
                {error}
              </p>
            )}
            <button
              type="submit"
              disabled={loading}
              className="mt-6 flex h-12 w-full items-center justify-center rounded-xl bg-hertz-yellow font-semibold text-hertz-black-90 transition-opacity disabled:opacity-50"
            >
              {loading ? "Logging in…" : "Log in"}
            </button>
            <SocialLoginButtons returnUrl={returnUrl} />
            <div className="mt-4 flex items-center justify-between text-sm">
              <Link
                href="/account/forgot-password"
                className="text-hertz-black-60 hover:underline"
              >
                Forgot password?
              </Link>
              <button
                type="button"
                onClick={() => {
                  setView("otp-request");
                  setError(null);
                }}
                className="font-medium text-hertz-black-80 hover:underline"
              >
                Log in by OTP
              </button>
            </div>
          </form>
        </div>
      )}

      <p className="mt-6 text-center text-hertz-black-80">
        Don&apos;t have an account?{" "}
        <Link
          href={
            returnUrl !== "/"
              ? `/account/register?returnUrl=${encodeURIComponent(returnUrl)}`
              : "/account/register"
          }
          className="font-medium text-hertz-yellow underline"
        >
          Sign up
        </Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-md px-4 py-8">Loading…</div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
