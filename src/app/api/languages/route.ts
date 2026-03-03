import { NextResponse } from "next/server";

/**
 * Mock API for available languages.
 * CS-ready: future response may include flagUrl, enabled.
 */
export async function GET() {
  const body = {
    defaultLocale: "th" as const,
    locales: [
      { code: "th", label: "ไทย", flag: "🇹🇭" },
      { code: "en", label: "English", flag: "🇬🇧" },
      { code: "zh", label: "中文", flag: "🇨🇳" },
    ],
  };
  return NextResponse.json(body);
}
