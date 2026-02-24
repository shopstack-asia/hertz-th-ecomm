"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

function getLoginUrl(next: string | null): string {
  if (!next || next === "/") return "/account/login";
  return `/account/login?next=${encodeURIComponent(next)}`;
}

function WelcomeContent() {
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? searchParams.get("returnUrl");
  const email = searchParams.get("email");
  const firstName = searchParams.get("firstName");

  const loginUrl = getLoginUrl(next);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 py-12 sm:py-16">
      <div
        className="animate-fade-in w-full max-w-[560px] rounded-xl bg-white p-8 shadow-md sm:p-[32px]"
        style={{ animationDuration: "350ms" }}
      >
        {/* 1) Success section */}
        <div className="flex flex-col items-center text-center">
          <div
            className="flex h-16 w-16 items-center justify-center rounded-full bg-[#FFCC00]/25 text-black"
            aria-hidden
          >
            <svg
              className="h-8 w-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={2.5}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="mt-6 text-[28px] font-bold leading-tight text-black sm:text-[32px]">
            Account successfully created
          </h1>
          <p className="mt-2 text-base text-hertz-black-60">
            {firstName
              ? `Welcome to Hertz, ${firstName}!`
              : "Welcome to Hertz"}
          </p>
        </div>

        {/* 2) Information block */}
        <div className="mt-6 space-y-3 border-t border-hertz-border/60 pt-6">
          <p className="text-[15px] leading-relaxed text-hertz-black-80">
            Your account is ready. You can now log in and start booking premium
            vehicles across Thailand.
          </p>
          {email && (
            <p className="text-sm text-hertz-black-60">
              Registered email:{" "}
              <span className="font-medium text-hertz-black-80">{email}</span>
            </p>
          )}
        </div>

        {/* 3) Optional benefits */}
        <ul className="mt-6 space-y-2 text-left text-[15px] text-hertz-black-80">
          <li className="flex items-center gap-2">
            <span className="text-hertz-yellow">✓</span>
            Faster booking
          </li>
          <li className="flex items-center gap-2">
            <span className="text-hertz-yellow">✓</span>
            Access to rewards
          </li>
          <li className="flex items-center gap-2">
            <span className="text-hertz-yellow">✓</span>
            Exclusive offers
          </li>
        </ul>

        {/* 4) Action section */}
        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:gap-3">
          <Link
            href={loginUrl}
            className="btn-primary flex h-12 w-full items-center justify-center rounded-xl font-bold text-black hover:opacity-95 sm:w-auto sm:min-w-[140px]"
          >
            Log in
          </Link>
          <Link
            href="/"
            className="flex h-12 w-full items-center justify-center rounded-xl border-2 border-hertz-border bg-white font-medium text-black hover:bg-hertz-gray/30 sm:w-auto sm:min-w-[140px]"
          >
            Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function SignupWelcomePage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[40vh] items-center justify-center px-6 text-hertz-black-60">
          Loading…
        </div>
      }
    >
      <WelcomeContent />
    </Suspense>
  );
}
