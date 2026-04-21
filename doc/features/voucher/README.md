# Voucher — hertz-th-ecomm

## Purpose

**Gift / discount voucher commerce:** browse catalog, wallet (“my vouchers”), apply voucher codes to rental checkout, purchase flow with auth gate, mock payment session, confirmation after return URL, and thank-you lookup.

## Scope

- **Belongs here:** `(site)/vouchers`, `(site)/vouchers/[id]`, `(site)/my-vouchers`, `(site)/voucher-checkout`, `(site)/voucher-thank-you`, `src/components/voucher/`, `src/app/api/vouchers/*`, `src/app/api/voucher/*`, `src/app/api/voucher-order/*`, `src/app/api/voucher-benefits/route.ts`, `(site)/payment-return` **voucher branch** and mock gateway **voucher mode** (documented here; **payment** owns shared session route file path only).
- **Does not belong here:** Rental reservation create (**checkout**). Car rental payment confirm for `booking_ref` (**payment**).

## Reading order

1. `domain-features.md`
2. `feature-logic-summary.md`
3. `features/voucher-order-create-pay-and-confirm.md`

## Code paths

- `src/app/(site)/vouchers/`
- `src/app/(site)/my-vouchers/page.tsx`
- `src/app/(site)/voucher-checkout/page.tsx`
- `src/app/(site)/voucher-thank-you/page.tsx`
- `src/components/voucher/`
- `src/app/api/vouchers/catalog/route.ts`
- `src/app/api/vouchers/my/route.ts`
- `src/app/api/voucher/apply/route.ts`
- `src/app/api/voucher-order/create/route.ts`
- `src/app/api/voucher-order/confirm/route.ts`
- `src/app/api/voucher-order/by-ref/route.ts`
- `src/app/api/voucher-benefits/route.ts`
- `src/app/(site)/payment-return/page.tsx` (voucher branch)
- `src/app/(site)/mock-kbank-gateway/page.tsx` (voucher branch)
- `src/lib/mock/voucherPaymentSessions.ts`
