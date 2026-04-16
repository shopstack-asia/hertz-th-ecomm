# Payment — hertz-th-ecomm

## Purpose

This area covers **mock** card-style payment for car rental (pay-now path) and related **session lookup** used by the mock KBank UI. It also shares infrastructure with voucher purchases via the same mock gateway and `/api/payment/session/:sessionId`.

## Scope

- **Belongs here:** `(site)/payment/status`, `(site)/payment-return` (only the **booking_ref → `/api/payment/confirm`** branch), `(site)/mock-kbank-gateway`, BFF under `src/app/api/payment/*`, in-memory mock session stores consumed by those routes.
- **Does not belong here:** Voucher order confirmation (`/api/voucher-order/confirm`) and voucher thank-you flow (see **voucher**). Pay-later checkout completion without card (see **checkout** / **booking**). Pricing (see **checkout** / **promotion**).

## Reading order

1. `domain-features.md`
2. `feature-logic-summary.md`
3. `features/mock-rental-payment-flow.md`

## Code paths

- `src/app/(site)/payment/status/page.tsx`
- `src/app/(site)/payment-return/page.tsx` (booking branch)
- `src/app/(site)/mock-kbank-gateway/page.tsx`
- `src/app/api/payment/initiate/route.ts`
- `src/app/api/payment/create-session/route.ts`
- `src/app/api/payment/callback/route.ts`
- `src/app/api/payment/confirm/route.ts`
- `src/app/api/payment/session/[sessionId]/route.ts`
- `src/lib/mock/paymentSessions.ts` (session shape; mock)
- `src/lib/mock/voucherPaymentSessions.ts` (session lookup for voucher type; mock)
