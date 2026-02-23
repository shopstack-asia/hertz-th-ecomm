"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

const MOCK_USERS = [
  { code: "MOCK_GOOGLE_PRAKASIT", name: "Prakasit User", email: "prakasit.user@gmail.com" },
  { code: "MOCK_GOOGLE_JANE", name: "Jane Doe", email: "jane.doe@gmail.com" },
];

function GoogleMockContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const state = searchParams.get("state") ?? "";
  const next = searchParams.get("next") ?? "/";

  const handleSelect = (code: string) => {
    const params = new URLSearchParams({ code, state });
    if (next && next !== "/") params.set("next", next);
    window.location.href = `/api/auth/oauth/google/callback?${params.toString()}`;
  };

  return (
    <div className="mx-auto max-w-md px-4 py-12">
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-card">
        <h1 className="mb-2 text-xl font-bold text-hertz-black-90">
          Continue with Google
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
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-200 text-sm font-semibold text-gray-600">
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

export default function GoogleMockPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-md px-4 py-12">Loading…</div>}>
      <GoogleMockContent />
    </Suspense>
  );
}
