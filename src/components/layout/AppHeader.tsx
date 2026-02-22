"use client";

import Link from "next/link";

interface AppHeaderProps {
  showBack?: boolean;
  title?: string;
}

export function AppHeader({ showBack, title }: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-50 flex h-14 min-h-tap items-center justify-between border-b border-gray-200 bg-white px-4 shadow-card lg:h-16">
      <div className="flex items-center gap-3">
        {showBack ? (
          <Link
            href="/"
            className="flex min-h-tap min-w-tap items-center justify-center rounded-lg text-hertz-black-80 hover:bg-hertz-gray focus:outline-none focus:ring-2 focus:ring-hertz-yellow"
            aria-label="Go back"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </Link>
        ) : null}
        <Link
          href="/"
          className="flex items-center gap-2"
          aria-label="Hertz Thailand - Home"
        >
          <span className="text-xl font-bold text-hertz-black">Hertz</span>
          <span className="hidden text-sm text-hertz-black-80 sm:inline">
            Thailand
          </span>
        </Link>
      </div>
      {title && (
        <h1 className="absolute left-1/2 -translate-x-1/2 text-lg font-semibold text-hertz-black-80">
          {title}
        </h1>
      )}
      <div className="flex items-center gap-2">
        <Link
          href="/account/login"
          className="rounded-lg px-3 py-2 text-sm font-medium text-hertz-black-80 hover:bg-hertz-gray focus:outline-none focus:ring-2 focus:ring-hertz-yellow"
        >
          Log in
        </Link>
        <Link
          href="/account/register"
          className="rounded-lg bg-hertz-yellow px-4 py-2 text-sm font-semibold text-hertz-black-90 hover:bg-hertz-yellow/90 focus:outline-none focus:ring-2 focus:ring-hertz-yellow focus:ring-offset-2"
        >
          Sign up
        </Link>
      </div>
    </header>
  );
}
