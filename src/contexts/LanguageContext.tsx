"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import { GlobalLoadingScreen } from "@/components/ui/GlobalLoadingScreen";
import { installApiLocaleHeader } from "@/lib/api-locale-client";

const STORAGE_KEY = "hertz-locale";

/** Single locale from API. CS-ready: flagUrl, enabled optional. */
export interface LocaleOption {
  code: string;
  label: string;
  flag?: string;
  flagUrl?: string;
  enabled?: boolean;
}

const FALLBACK_LOCALES: LocaleOption[] = [
  { code: "th", label: "ไทย", flag: "🇹🇭" },
  { code: "en", label: "English", flag: "🇬🇧" },
];

const FALLBACK_DEFAULT = "th";

type Messages = Record<string, unknown>;

export type TParams = Record<string, string | number>;

interface LanguageContextValue {
  locale: string;
  setLocale: (l: string) => void;
  t: (key: string, params?: TParams) => string;
  translations: Messages;
  loading: boolean;
  isReady: boolean;
  availableLocales: LocaleOption[];
  defaultLocale: string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

function traverseMessages(messages: Messages, key: string): string | null {
  const keys = key.split(".");
  let value: unknown = messages;
  for (const k of keys) {
    value = (value as Record<string, unknown>)?.[k];
  }
  return typeof value === "string" ? value : null;
}

function interpolate(str: string, params?: TParams): string {
  if (!params || typeof str !== "string") return str;
  let out = str;
  for (const [k, v] of Object.entries(params)) {
    out = out.replace(new RegExp(`\\{${k}\\}`, "g"), String(v));
  }
  return out;
}

/** In-memory cache: locale -> messages. Prevents loading screen when switching back to a previously loaded locale. */
const messagesCache: Record<string, Messages> = {};

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<string>(FALLBACK_DEFAULT);
  const [messages, setMessages] = useState<Messages>({});
  const [loading, setLoading] = useState(true);
  const [isReady, setIsReady] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [availableLocales, setAvailableLocales] =
    useState<LocaleOption[]>(FALLBACK_LOCALES);
  const [defaultLocale, setDefaultLocale] = useState<string>(FALLBACK_DEFAULT);
  const [languagesLoaded, setLanguagesLoaded] = useState(false);
  const localeRef = useRef(locale);
  localeRef.current = locale;

  useEffect(() => {
    setMounted(true);
    installApiLocaleHeader();
  }, []);

  useEffect(() => {
    if (!mounted) return;
    fetch("/api/languages")
      .then((res) => res.json())
      .then((data: { defaultLocale?: string; locales?: LocaleOption[] }) => {
        const list = Array.isArray(data.locales) ? data.locales : [];
        const enabled = list.filter((l) => l.enabled !== false);
        setAvailableLocales(enabled.length > 0 ? enabled : FALLBACK_LOCALES);
        const def =
          data.defaultLocale && enabled.some((l) => l.code === data.defaultLocale)
            ? data.defaultLocale
            : FALLBACK_DEFAULT;
        setDefaultLocale(def);
        setLanguagesLoaded(true);
      })
      .catch(() => {
        setAvailableLocales(FALLBACK_LOCALES);
        setDefaultLocale(FALLBACK_DEFAULT);
        setLanguagesLoaded(true);
      });
  }, [mounted]);

  useEffect(() => {
    if (!languagesLoaded) return;
    const stored = localStorage.getItem(STORAGE_KEY);
    const validCode = stored && availableLocales.some((l) => l.code === stored);
    setLocaleState(validCode ? stored! : defaultLocale);
  }, [languagesLoaded, defaultLocale, availableLocales]);

  useEffect(() => {
    if (!mounted || !languagesLoaded) return;
    if (!availableLocales.some((l) => l.code === locale)) return;

    const cached = messagesCache[locale];
    if (cached && Object.keys(cached).length > 0) {
      setMessages(cached);
      setLoading(false);
      setIsReady(true);
      return;
    }

    setLoading(true);
    const requestedLocale = locale;
    fetch(`/api/i18n?locale=${requestedLocale}`)
      .then((res) => res.json())
      .then((data: { locale?: string; messages?: Messages }) => {
        const next = data.messages && typeof data.messages === "object" ? data.messages : {};
        messagesCache[requestedLocale] = next;
        if (localeRef.current === requestedLocale) {
          setMessages(next);
          setIsReady(true);
        }
      })
      .catch(() => {
        if (localeRef.current === requestedLocale) {
          setMessages({});
          setIsReady(true);
        }
      })
      .finally(() => setLoading(false));
  }, [locale, mounted, languagesLoaded, availableLocales]);

  const setLocale = useCallback((code: string) => {
    if (!availableLocales.some((l) => l.code === code)) return;
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, code);
      // Reload so API-fetched content (vehicle details, price labels, etc.) is requested with new locale
      window.location.reload();
      return;
    }
    setLocaleState(code);
  }, [availableLocales]);

  const t = useCallback(
    (key: string, params?: TParams) => {
      if (Object.keys(messages).length === 0) return "";
      const value = traverseMessages(messages, key);
      const str = value ?? "";
      return interpolate(str, params);
    },
    [messages]
  );

  const value: LanguageContextValue = {
    locale,
    setLocale,
    t,
    translations: messages,
    loading,
    isReady,
    availableLocales,
    defaultLocale,
  };

  return (
    <LanguageContext.Provider value={value}>
      {!isReady ? <GlobalLoadingScreen /> : children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}
