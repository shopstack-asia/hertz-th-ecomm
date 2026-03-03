"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { CookieConsentBar } from "@/components/common/CookieConsentBar";
import { CookieSettingsModal } from "@/components/common/CookieSettingsModal";

export const STORAGE_KEY = "hertz-cookie-consent";

/** GDPR-style consent structure */
export interface CookieConsentState {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  timestamp: number;
}

function parseStoredConsent(raw: string | null): CookieConsentState | null {
  if (!raw) return null;
  if (raw === "accepted") {
    return {
      necessary: true,
      analytics: true,
      marketing: true,
      timestamp: Date.now(),
    };
  }
  try {
    const parsed = JSON.parse(raw) as CookieConsentState;
    if (
      typeof parsed.necessary === "boolean" &&
      typeof parsed.timestamp === "number"
    ) {
      return parsed;
    }
  } catch {
    // ignore
  }
  return null;
}

function saveConsentToStorage(state: CookieConsentState): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    localStorage.setItem(STORAGE_KEY, "accepted");
  }
}

/** Future-ready: call after saving preferences to enable/disable analytics. */
export function initializeAnalytics(enabled: boolean): void {
  if (typeof window === "undefined") return;
  // eslint-disable-next-line no-console
  console.log("[Cookie consent] Analytics enabled:", enabled);
}

interface CookieConsentContextValue {
  consent: CookieConsentState | null;
  setConsent: (state: CookieConsentState) => void;
  modalOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
}

const CookieConsentContext = createContext<CookieConsentContextValue | null>(
  null
);

export function CookieConsentProvider({ children }: { children: React.ReactNode }) {
  const [consent, setConsentState] = useState<CookieConsentState | null>(null);
  const [mounted, setMounted] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setMounted(true);
    const raw = localStorage.getItem(STORAGE_KEY);
    setConsentState(parseStoredConsent(raw));
  }, []);

  const setConsent = useCallback((state: CookieConsentState) => {
    const full: CookieConsentState = {
      necessary: true,
      analytics: state.analytics ?? false,
      marketing: state.marketing ?? false,
      timestamp: state.timestamp ?? Date.now(),
    };
    saveConsentToStorage(full);
    setConsentState(full);
    initializeAnalytics(full.analytics);
  }, []);

  const openModal = useCallback(() => setModalOpen(true), []);
  const closeModal = useCallback(() => setModalOpen(false), []);

  const value: CookieConsentContextValue = mounted
    ? {
        consent,
        setConsent,
        modalOpen,
        openModal,
        closeModal,
      }
    : {
        consent: null,
        setConsent: () => {},
        modalOpen: false,
        openModal: () => {},
        closeModal: () => {},
      };

  return (
    <CookieConsentContext.Provider value={value}>
      {children}
      {mounted && !consent && <CookieConsentBar />}
      {mounted && modalOpen && (
        <CookieSettingsModal onClose={closeModal} />
      )}
    </CookieConsentContext.Provider>
  );
}

export function useCookieConsent(): CookieConsentContextValue {
  const ctx = useContext(CookieConsentContext);
  if (!ctx) throw new Error("useCookieConsent must be used within CookieConsentProvider");
  return ctx;
}
