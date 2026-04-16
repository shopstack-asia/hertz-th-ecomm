# Promotion — hertz-th-ecomm

## Purpose

Apply and validate **promotion codes** during search/vehicle/checkout: URL + `localStorage` hydration, server validation of rental window rules, per-vehicle **eligibility** for pricing tiles, and **campaign metadata** for checkout price calculations.

## Scope

- **Belongs here:** `src/components/promotion/`, `src/app/api/promotion/*`, `src/app/api/campaign-logic/route.ts`, `src/contexts/PromotionContext.tsx`, `src/components/booking/BookingAndPromotionLayer.tsx` (sticky booking chrome only — no promotion API calls in that file).
- **Does not belong here:** Full checkout step machine (**checkout**). Mock pricing math in `/api/checkout/price` (**checkout** — consumes campaign/promo inputs). Payment (**payment**).

## Reading order

1. `domain-features.md`
2. `feature-logic-summary.md`
3. `features/promotion-validate-eligibility-and-campaign.md`

## Code paths

- `src/components/promotion/`
- `src/contexts/PromotionContext.tsx`
- `src/components/booking/BookingAndPromotionLayer.tsx`
- `src/app/api/promotion/validate/route.ts`
- `src/app/api/promotion/check-eligibility/route.ts`
- `src/app/api/campaign-logic/route.ts`
- `src/components/vehicle/VehicleCard.tsx` (caller of check-eligibility)
