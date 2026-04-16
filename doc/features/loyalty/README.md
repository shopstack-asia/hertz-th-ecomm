# Loyalty — hertz-th-ecomm

## Purpose

**Rewards discovery and signed-in loyalty surfaces:** tier/spend profile header data, points summary, transaction history filters, redemption option list for checkout integration, and Gold rewards marketing page — mostly **mock** JSON from BFF routes plus `loyalty.service` client helpers.

## Scope

- **Belongs here:** `(site)/rewards`, `(site)/my-points`, `(site)/gold-rewards`, `src/components/loyalty/`, `src/components/loyalty-card/`, `src/app/api/loyalty/*`, `src/services/loyalty.service.ts`.
- **Does not belong here:** Checkout application of selected redemption (**checkout** `/api/checkout/price`). Account profile tier copy sourced elsewhere (**account**).

## Reading order

1. `domain-features.md`
2. `feature-logic-summary.md`
3. `features/loyalty-redemption-options-bff.md`

## Code paths

- `src/app/(site)/rewards/page.tsx`
- `src/app/(site)/my-points/page.tsx`
- `src/app/(site)/gold-rewards/page.tsx`
- `src/components/loyalty/`
- `src/components/loyalty-card/`
- `src/app/api/loyalty/profile/route.ts`
- `src/app/api/loyalty/summary/route.ts`
- `src/app/api/loyalty/points/route.ts`
- `src/app/api/loyalty/transactions/route.ts`
- `src/app/api/loyalty/redemption-options/route.ts`
- `src/services/loyalty.service.ts`
