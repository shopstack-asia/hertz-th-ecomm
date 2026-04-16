# Mock rental payment flow

## Purpose

Describe how the storefront simulates pay-now: reservation reference, payment session, mock bank UI, confirmation, and optional status callback — all backed by mock handlers and in-memory stores.

## Related files (src/ paths only, no imports dump)

- `src/app/(site)/checkout/page.tsx`
- `src/app/(site)/mock-kbank-gateway/page.tsx`
- `src/app/(site)/payment-return/page.tsx`
- `src/app/(site)/payment/status/page.tsx`
- `src/app/api/payment/initiate/route.ts`
- `src/app/api/payment/create-session/route.ts`
- `src/app/api/payment/session/[sessionId]/route.ts`
- `src/app/api/payment/confirm/route.ts`
- `src/app/api/payment/callback/route.ts`
- `src/lib/mock/handlers.ts` (via routes)
- `src/lib/mock/data.ts` (`bookingRefToReservationNo`)
- `src/lib/mock/paymentSessions.ts`

## Business logic (plain language rules)

- **Initiate:** Requires `reservationNo` in JSON body; delegates to mock `payment.initiate` and returns its JSON.
- **Create session:** Validates a fixed set of required booking fields; creates a `PAY_NOW` reservation; persists `booking_ref → reservationNo` and `session_id → { booking_ref, amount }`; returns `payment_url` under `/mock-kbank-gateway`.
- **Session GET:** Returns booking session if present; else voucher session with `type: "voucher"` merged in; else 404.
- **Confirm:** Requires `booking_ref`; resolves reservation; calls mock payment callback with `success`; returns `{ status: "paid" }`.
- **Callback:** Requires `reservationNo` and `status`; delegates to mock `payment.callback`.

## Conditions / branches

- Checkout: `PAY_LATER` → `/booking/{reservationNo}`; `PAY_NOW` → initiate → redirect with `reservationNo` on payment URL.
- Mock gateway: voucher vs booking determined by session payload `type` and presence of `order_ref` vs `booking_ref`.
- Payment status: without `reservationNo`, UI infers success/fail from `status` query only and does not POST callback.

## Validation rules (if any)

- `initiate`: missing `reservationNo` → 400 JSON `{ error }`.
- `create-session`: missing any required field among vehicle, locations, datetimes, renterName, contactEmail, contactPhone → 400 with enumerated error message.
- `confirm`: missing `booking_ref` → 400; unknown ref → 404.
- `callback`: missing `reservationNo` or `status` → 400.

## API contracts (route path, main request fields, success/error response shape)

| Route | Method | Request | Success | Errors |
|-------|--------|---------|---------|--------|
| `/api/payment/initiate` | POST | `{ reservationNo }` | Mock handler JSON | 400 missing field |
| `/api/payment/create-session` | POST | vehicle, locations, datetimes, renter, contacts, optional `driverName`, `voucherCode`, `total` | `{ session_id, booking_ref, payment_url }` | 400 missing required |
| `/api/payment/session/[sessionId]` | GET | path `sessionId` | `{ booking_ref, amount }` or voucher shape + `type` | 404 `{ error }` |
| `/api/payment/confirm` | POST | `{ booking_ref }` | `{ status: "paid" }` | 400, 404 |
| `/api/payment/callback` | POST | `{ reservationNo, status }` | Mock result JSON | 400 |

## User flow / steps (if multi-step)

1. User completes checkout as `PAY_NOW` → reservation created → initiate returns payment URL → client adds `reservationNo` and navigates.
2. **Or** client uses `create-session` (BFF) and opens returned `payment_url`.
3. Mock gateway loads session; user confirms or cancels.
4. Confirm path: `payment-return` POSTs confirm → thank-you with `booking_ref` and `type=pay_now`.
5. Alternate: `payment/status` posts callback then redirects to booking on success.

## Edge cases (only what code confirms)

- In-memory maps: server restart loses `booking_ref` / session bindings.
- `create-session` uses `total` from body when numeric; otherwise falls back to reservation pricing total or 0.

## Required tests (behaviors that must stay covered)

- BFF validation branches for `create-session` and `confirm` (400/404).
- Callback body validation.
- Client redirect conditions on `payment-return` for success vs cancel (no confirm on cancel).
