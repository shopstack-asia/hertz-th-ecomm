import { en } from "./en";
import { th } from "./th";

export type Locale = "th" | "en";
export type TranslationKey = keyof typeof th;

const translations = { th, en } as const;

export function t(locale: Locale, key: string): string {
  const keys = key.split(".");
  let value: unknown = translations[locale];
  for (const k of keys) {
    value = (value as Record<string, unknown>)?.[k];
  }
  return typeof value === "string" ? value : key;
}

export function getTranslations(locale: Locale) {
  return translations[locale];
}

export { en, th };
