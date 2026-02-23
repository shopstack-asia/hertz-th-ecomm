"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

/**
 * Redirect to the 3-step signup flow at /signup.
 * Preserves returnUrl or next for post-signup redirect.
 */
function RegisterContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get("returnUrl") ?? searchParams.get("next");

  useEffect(() => {
    const next = returnUrl ? `?next=${encodeURIComponent(returnUrl)}` : "";
    router.replace(`/signup${next}`);
  }, [router, returnUrl]);

  return (
    <div className="mx-auto max-w-md px-4 py-8 text-center text-hertz-black-60">
      Redirecting to sign up…
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-md px-4 py-8">Loading…</div>}>
      <RegisterContent />
    </Suspense>
  );
}
