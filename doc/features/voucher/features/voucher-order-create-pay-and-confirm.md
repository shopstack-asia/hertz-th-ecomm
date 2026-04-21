# Voucher order: create, pay, and confirm

## Purpose

End-to-end **mock** purchase: authenticated checkout page → create pending order + payment session → mock bank → confirm on return → thank-you.

## Related files (src/ paths only, no imports dump)

- `src/app/(site)/voucher-checkout/page.tsx`
- `src/app/(site)/payment-return/page.tsx`
- `src/app/(site)/mock-kbank-gateway/page.tsx`
- `src/app/(site)/voucher-thank-you/page.tsx`
- `src/app/api/voucher-order/create/route.ts`
- `src/app/api/voucher-order/confirm/route.ts`
- `src/app/api/voucher-order/by-ref/route.ts`
- `src/app/api/payment/session/[sessionId]/route.ts`
- `src/lib/mock/voucherPaymentSessions.ts`

## Business logic (plain language rules)

- **Create:** Validates JSON; `voucher_id` required; quantity clamped 1..10; looks up catalog for localized title + price; computes subtotal, VAT 7%, total; stores pending order + voucher payment session; returns `order_ref`, totals, `payment_url` to mock gateway including `type=voucher`.
- **Confirm:** Requires `order_ref`; returns early paid payload if already paid; otherwise marks paid, generates voucher code, sets expiry ~365 days, timestamps `paid_at`.
- **Payment-return:** On voucher success branch, POST confirm then client navigates to voucher thank-you.

## Conditions / branches

- Checkout: missing `voucher_id` ends loading with no voucher.
- Create: non-OK response shows `data.error` string or generic failure.

## Validation rules (if any)

- Create: invalid JSON → 400; missing voucher_id → 400; unknown id → 404.

## API contracts (route path, main request fields, success/error response shape)

| Route | Method | Request | Success |
|-------|--------|---------|---------|
| `/api/voucher-order/create` | POST | `voucher_id`, `quantity`, optional `recipient_name`, `gift_message` | `order_ref`, `total`, `subtotal`, `vat_amount`, `payment_url` |
| `/api/voucher-order/confirm` | POST | `{ order_ref }` | `status`, `order_ref`, `voucher_code`, `expiry_date` |
| `/api/voucher-order/by-ref` | GET | `order_ref` query | Order JSON |

## User flow / steps (if multi-step)

1. Authenticated user opens voucher-checkout with `voucher_id`.
2. Pay now → create → mock gateway → confirm on return → thank-you.

## Edge cases (only what code confirms)

- Confirm twice: second call returns existing `voucher_code` without regenerating.

## Required tests (behaviors that must stay covered)

- Quantity clamping and VAT alignment between client display and server.
- Confirm idempotency contract.
- Unauthenticated redirect preserves `returnUrl`.
