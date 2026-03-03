/** Header name client sends and server reads for locale. */
export const LOCALE_HEADER = "x-locale";

/** Supported API response locales. */
export const SUPPORTED_LOCALES = ["en", "th", "zh"] as const;
export type ApiLocale = (typeof SUPPORTED_LOCALES)[number];

const DEFAULT_LOCALE: ApiLocale = "th";

/**
 * Get locale from request (API route). Prefers x-locale, then Accept-Language.
 * Normalizes to supported locale or default.
 * Accepts Request or NextRequest (both have headers).
 */
export function getLocaleFromRequest(request: Request): ApiLocale {
  const fromHeader =
    request.headers.get(LOCALE_HEADER)?.toLowerCase().trim() ||
    request.headers.get("accept-language")?.split(",")[0]?.split("-")[0]?.toLowerCase().trim();
  if (fromHeader && SUPPORTED_LOCALES.includes(fromHeader as ApiLocale)) {
    return fromHeader as ApiLocale;
  }
  return DEFAULT_LOCALE;
}
