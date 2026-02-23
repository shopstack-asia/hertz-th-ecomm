"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { FormField } from "@/components/ui/FormField";

function getSafeReturnUrl(returnUrl: string | null): string | null {
  if (!returnUrl) return null;
  const decoded = decodeURIComponent(returnUrl);
  if (!decoded.startsWith("/") || decoded.startsWith("//")) return null;
  return decoded;
}

export default function RegisterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnUrl = getSafeReturnUrl(searchParams.get("returnUrl"));

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 500));
    router.push(returnUrl ?? "/account/profile");
    setLoading(false);
  };

  const loginHref = returnUrl
    ? `/account/login?returnUrl=${encodeURIComponent(returnUrl)}`
    : "/account/login";

  return (
    <div className="mx-auto max-w-md px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold text-hertz-black-90">
        Create account
      </h1>
      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-gray-200 bg-white p-6 shadow-card"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <FormField
              label="First name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
            <FormField
              label="Last name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </div>
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
          <FormField
            label="Confirm password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="mt-6 flex h-12 w-full items-center justify-center rounded-xl bg-hertz-yellow font-semibold text-hertz-black-90 disabled:opacity-50"
        >
          {loading ? "Creating account..." : "Sign up"}
        </button>
      </form>
      <p className="mt-6 text-center text-hertz-black-80">
        Already have an account?{" "}
        <Link href={loginHref} className="font-medium text-hertz-yellow underline">
          Log in
        </Link>
      </p>
    </div>
  );
}
