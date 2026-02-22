"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FormField } from "@/components/ui/FormField";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Mock: simulate success
    await new Promise((r) => setTimeout(r, 500));
    router.push("/account/profile");
    setLoading(false);
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
        <Link href="/account/register" className="font-medium text-hertz-yellow underline">
          Sign up
        </Link>
      </p>
    </div>
  );
}
