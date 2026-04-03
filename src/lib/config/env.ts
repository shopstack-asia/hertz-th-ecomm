/**
 * Environment configuration
 */

export const env = {
  apiBaseUrl:
    typeof window !== "undefined" ? "" : process.env.NEXT_PUBLIC_API_URL ?? "",

  /** CMS site `code` (cs-core `cms_site.code`), e.g. lookup key for website config. */
  websiteCode:
    typeof window !== "undefined" ? "" : process.env.WEBSITE_CODE ?? "HERTZ_WEBSITE",

  /** Commerce Suite API base URL (server-side fetches). */
  csApiBaseUrl:
    typeof window !== "undefined" ? "" : process.env.CS_API_BASE_URL ?? "",
} as const;
