"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { FormField } from "@/components/ui/FormField";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/auth_context";

function getSafeReturnUrl(returnUrl: string | null): string | null {
  if (!returnUrl) return null;
  const decoded = decodeURIComponent(returnUrl);
  if (!decoded.startsWith("/") || decoded.startsWith("//")) return null;
  return decoded;
}

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useLanguage();
  const { refreshAuth } = useAuth();
  const returnUrl = getSafeReturnUrl(searchParams.get("returnUrl"));

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Login failed");
        setLoading(false);
        return;
      }
      await refreshAuth();
      router.push(returnUrl ?? "/account/profile");
    } catch {
      setError("Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold text-hertz-black-90">
        Log in
      </h1>
      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-gray-200 bg-white p-6 shadow-card"
      >
        <div className="space-y-4">
          <FormField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <FormField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && (
          <p className="mt-2 text-sm text-red-600" role="alert">
            {error}
          </p>
        )}
        <button
          type="submit"
          disabled={loading}
          className="mt-6 flex h-12 w-full items-center justify-center rounded-xl bg-hertz-yellow font-semibold text-hertz-black-90 disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Log in"}
        </button>
        <Link
          href="/account/forgot-password"
          className="mt-4 block text-center text-sm text-hertz-black-60 hover:underline"
        >
          Forgot password?
        </Link>
      </form>
      <p className="mt-6 text-center text-hertz-black-80">
        Don&apos;t have an account?{" "}
        <Link
          href={returnUrl ? `/account/register?returnUrl=${encodeURIComponent(returnUrl)}` : "/account/register"}
          className="font-medium text-hertz-yellow underline"
        >
          Sign up
        </Link>
      </p>
      <p className="mt-3 text-center text-xs text-hertz-black-60">
        {t("auth.mock_phase_credentials")}
      </p>
    </div>
  );
}
