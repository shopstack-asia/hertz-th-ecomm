"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  useEffect,
} from "react";
import { useSearchParams } from "next/navigation";

const PROMO_STORAGE_KEY = "hertz_promo_code";

export interface PromotionValidation {
  status: "valid" | "invalid";
  message?: string;
  /** When valid: discount label e.g. "10% discount" */
  discountLabel?: string;
  /** When invalid: rejection reason for display */
  reason?: string;
  conditions?: {
    min_rental_days?: number;
    vehicle_classes?: string[];
  };
}

export interface VehicleEligibility {
  eligible: boolean;
  discount_amount?: number;
  reason_if_not_eligible?: string;
}

export interface PromotionState {
  promoCode: string | null;
  validation: PromotionValidation | null;
  /** vehicle id (groupCode) -> eligibility result */
  eligibilityMap: Record<string, VehicleEligibility>;
}

interface PromotionContextValue extends PromotionState {
  setPromoCode: (code: string | null) => void;
  setValidation: (validation: PromotionValidation | null) => void;
  setEligibility: (vehicleId: string, eligibility: VehicleEligibility) => void;
  setEligibilityMap: (map: Record<string, VehicleEligibility>) => void;
  clearPromotion: () => void;
  /** Validate promo with given search params; updates validation in state. Pass code when applying so state is not stale. */
  validatePromotion: (
    params: {
      pickup_location: string;
      dropoff_location: string;
      pickup_date: string;
      dropoff_date: string;
    },
    codeOverride?: string | null
  ) => Promise<PromotionValidation>;
}

const PromotionContext = createContext<PromotionContextValue | null>(null);

export function PromotionProvider({ children }: { children: React.ReactNode }) {
  const searchParams = useSearchParams();

  const [promoCode, setPromoCodeState] = useState<string | null>(null);
  const [validation, setValidation] = useState<PromotionValidation | null>(null);
  const [eligibilityMap, setEligibilityMap] = useState<Record<string, VehicleEligibility>>({});

  // Hydrate from URL on mount and when searchParams change
  useEffect(() => {
    const promo = searchParams.get("promo")?.trim().toUpperCase() || null;
    if (promo) {
      setPromoCodeState(promo);
    }
  }, [searchParams]);

  // Hydrate from localStorage on mount (only if no URL promo, so URL wins)
  useEffect(() => {
    if (typeof window === "undefined") return;
    const fromUrl = searchParams.get("promo")?.trim().toUpperCase();
    if (fromUrl) return;
    try {
      const stored = localStorage.getItem(PROMO_STORAGE_KEY);
      if (stored) setPromoCodeState(stored.trim().toUpperCase());
    } catch {
      // ignore
    }
  }, [searchParams]);

  const setPromoCode = useCallback((code: string | null) => {
    setPromoCodeState(code);
    if (typeof window !== "undefined") {
      try {
        if (code) localStorage.setItem(PROMO_STORAGE_KEY, code);
        else localStorage.removeItem(PROMO_STORAGE_KEY);
      } catch {
        // ignore
      }
    }
    if (!code) {
      setValidation(null);
      setEligibilityMap({});
    }
  }, []);

  const setEligibility = useCallback((vehicleId: string, eligibility: VehicleEligibility) => {
    setEligibilityMap((prev) => ({ ...prev, [vehicleId]: eligibility }));
  }, []);

  const clearPromotion = useCallback(() => {
    setPromoCodeState(null);
    setValidation(null);
    setEligibilityMap({});
    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem(PROMO_STORAGE_KEY);
      } catch {
        // ignore
      }
    }
  }, []);

  const validatePromotion = useCallback(
    async (
      params: {
        pickup_location: string;
        dropoff_location: string;
        pickup_date: string;
        dropoff_date: string;
      },
      codeOverride?: string | null
    ): Promise<PromotionValidation> => {
      const code = (codeOverride !== undefined ? codeOverride : promoCode)?.trim().toUpperCase();
      if (!code) {
        setValidation(null);
        return { status: "invalid", message: "No promotion code" };
      }
      const res = await fetch("/api/promotion/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          promo_code: code,
          pickup_location: params.pickup_location,
          dropoff_location: params.dropoff_location,
          pickup_date: params.pickup_date,
          dropoff_date: params.dropoff_date,
        }),
      });
      const data = await res.json();
      const result: PromotionValidation = {
        status: data.valid ? "valid" : "invalid",
        message: data.message,
        reason: data.message,
        discountLabel: data.discount_label,
        conditions: data.conditions,
      };
      setValidation(result);
      return result;
    },
    [promoCode]
  );

  const value = useMemo<PromotionContextValue>(
    () => ({
      promoCode,
      validation,
      eligibilityMap,
      setPromoCode,
      setValidation,
      setEligibility,
      setEligibilityMap,
      clearPromotion,
      validatePromotion,
    }),
    [
      promoCode,
      validation,
      eligibilityMap,
      setPromoCode,
      setValidation,
      setEligibility,
      setEligibilityMap,
      clearPromotion,
      validatePromotion,
    ]
  );

  return (
    <PromotionContext.Provider value={value}>{children}</PromotionContext.Provider>
  );
}

export function usePromotion() {
  const ctx = useContext(PromotionContext);
  if (!ctx) throw new Error("usePromotion must be used within PromotionProvider");
  return ctx;
}

export function usePromotionOptional() {
  return useContext(PromotionContext);
}
