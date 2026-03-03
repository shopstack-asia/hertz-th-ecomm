import { NextRequest } from "next/server";
import { en } from "@/lib/i18n/en";
import { th } from "@/lib/i18n/th";
import { zh } from "@/lib/i18n/zh";

const messagesByLocale = { en, th, zh } as const;
type Locale = keyof typeof messagesByLocale;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const locale = (searchParams.get("locale") ?? "th").toLowerCase() as Locale;
  const messages =
    locale === "zh"
      ? messagesByLocale.zh
      : locale === "en"
        ? messagesByLocale.en
        : messagesByLocale.th;
  const resolvedLocale: Locale =
    locale === "zh" ? "zh" : locale === "en" ? "en" : "th";

  return Response.json({
    locale: resolvedLocale,
    messages,
  });
}
