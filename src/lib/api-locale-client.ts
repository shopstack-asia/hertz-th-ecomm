"use client";

import { LOCALE_HEADER } from "./request-locale";

const STORAGE_KEY = "hertz-locale";
const DEFAULT_LOCALE = "th";

function getStoredLocale(): string {
  if (typeof window === "undefined") return DEFAULT_LOCALE;
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored || DEFAULT_LOCALE;
}

let patched = false;

/**
 * Patch window.fetch so requests to /api/* include X-Locale and Accept-Language.
 * Call once from LanguageProvider on mount. Uses same storage key as LanguageContext.
 */
export function installApiLocaleHeader(): void {
  if (patched || typeof window === "undefined") return;
  patched = true;
  const originalFetch = window.fetch;
  window.fetch = function (
    input: RequestInfo | URL,
    init?: RequestInit
  ): Promise<Response> {
    const url = typeof input === "string" ? input : input instanceof URL ? input.href : (input as Request).url;
    const path = url.startsWith("/") ? url : new URL(url).pathname;
    if (path.startsWith("/api/")) {
      const locale = getStoredLocale();
      const headers = new Headers(init?.headers);
      headers.set(LOCALE_HEADER, locale);
      headers.set("Accept-Language", locale);
      init = { ...init, headers };
    }
    return originalFetch.call(this, input, init);
  };
}
