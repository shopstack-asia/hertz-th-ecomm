"use client";

import { Suspense } from "react";
import { usePathname } from "next/navigation";
import { PromotionProvider } from "@/contexts/PromotionContext";
import { BookingAndPromotionLayer } from "@/components/booking/BookingAndPromotionLayer";

/** Only these pages show the new premium sticky bar (Pickup / Drop-off / Promotion). All other pages (home, CMS, vouchers, special offers, etc.) show no bar. */
const PAGES_WITH_BOOKING_LAYER = ["/search", "/vehicles"];

/**
 * Wraps PromotionProvider in Suspense because provider uses useSearchParams.
 * Bar (BookingAndPromotionLayer) only on /search and /vehicles. Home uses sticky menu; other pages show no bar.
 */
export function PromotionBarWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const useBookingLayer = pathname != null && PAGES_WITH_BOOKING_LAYER.includes(pathname);

  return (
    <Suspense fallback={<div className="min-h-[44px] w-full" />}>
      <PromotionProvider>
        {useBookingLayer ? <BookingAndPromotionLayer /> : null}
        {children}
      </PromotionProvider>
    </Suspense>
  );
}
