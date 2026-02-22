"use client";

import { useState } from "react";
import Link from "next/link";
import { FormField } from "@/components/ui/FormField";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await new Promise((r) => setTimeout(r, 500));
    setSent(true);
  };

  return (
    <div className="mx-auto max-w-md px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold text-hertz-black-90">
        Forgot password
      </h1>
      {sent ? (
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-card">
          <p className="text-hertz-black-80">
            If an account exists with that email, we&apos;ve sent password
            reset instructions.
          </p>
          <Link
            href="/account/login"
            className="mt-4 inline-block text-hertz-yellow underline"
          >
            Back to log in
          </Link>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-gray-200 bg-white p-6 shadow-card"
        >
          <FormField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button
            type="submit"
            className="mt-6 flex h-12 w-full items-center justify-center rounded-xl bg-hertz-yellow font-semibold text-hertz-black-90"
          >
            Send reset link
          </button>
        </form>
      )}
    </div>
  );
}
