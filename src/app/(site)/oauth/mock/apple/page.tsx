"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

const MOCK_USERS = [
  { code: "MOCK_APPLE_DEMO", name: "Demo Partner", email: "demo.partner@icloud.com" },
  { code: "MOCK_APPLE_JOHN", name: "John Apple", email: "john.apple@icloud.com" },
];

function AppleMockContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const state = searchParams.get("state") ?? "";
  const next = searchParams.get("next") ?? "/";

  const handleSelect = (code: string) => {
    const params = new URLSearchParams({ code, state });
    if (next && next !== "/") params.set("next", next);
    window.location.href = `/api/auth/oauth/apple/callback?${params.toString()}`;
  };

  return (
    <div className="mx-auto max-w-md px-4 py-12">
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-card">
        <h1 className="mb-2 text-xl font-bold text-hertz-black-90">
          Sign in with Apple
        </h1>
        <p className="mb-6 text-sm text-hertz-black-60">
          Choose an account to continue (mock)
        </p>
        <div className="space-y-3">
          {MOCK_USERS.map((u) => (
            <button
              key={u.code}
              type="button"
              onClick={() => handleSelect(u.code)}
              className="flex w-full items-center gap-3 rounded-xl border border-gray-200 px-4 py-3 text-left transition-colors hover:bg-gray-50"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-900 text-sm font-semibold text-white">
                {u.name.split(" ").map((n) => n[0]).join("")}
              </div>
              <div>
                <p className="font-medium text-hertz-black-90">{u.name}</p>
                <p className="text-sm text-hertz-black-60">{u.email}</p>
              </div>
            </button>
          ))}
        </div>
        <p className="mt-4 text-center">
          <button
            type="button"
            onClick={() => router.push("/account/login")}
            className="text-sm text-hertz-black-60 hover:underline"
          >
            Cancel
          </button>
        </p>
      </div>
    </div>
  );
}

export default function AppleMockPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-md px-4 py-12">Loading…</div>}>
      <AppleMockContent />
    </Suspense>
  );
}
