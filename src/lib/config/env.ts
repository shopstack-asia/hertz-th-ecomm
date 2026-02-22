/**
 * Environment configuration
 */

export const env = {
  apiBaseUrl:
    typeof window !== "undefined" ? "" : process.env.NEXT_PUBLIC_API_URL ?? "",
} as const;
