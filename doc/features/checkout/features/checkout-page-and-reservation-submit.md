# Checkout page and reservation submit

## Purpose

Capture renter/contact data across steps, keep pricing in sync with voucher and booking type, integrate optional authenticated prefill, submit reservation, and branch to booking detail or payment initiation.

## Related files (src/ paths only, no imports dump)

- `src/app/(site)/checkout/page.tsx`
- `src/app/api/reservation/create/route.ts`
- `src/app/api/pricing/validate/route.ts`
- `src/app/api/payment/initiate/route.ts`
- `src/contexts/auth_context.tsx`
- `src/contexts/PromotionContext.tsx`
- `src/lib/api/proxy_fetch.ts`

## Business logic (plain language rules)

- Steps are fixed order: `details` → `extras` → `review` → `payment` (labels from i18n).
- **Details:** `canProceedDetails` requires non-empty renter name, email, phone. Logged-out users see login CTA with `returnUrl` = current path + query. Logged-in users see editable fields prefilled once from `authUser` without overwriting non-empty edits.
- **Extras:** Voucher input with apply button re-runs pricing validate. Promotion banner reads `promotion.validation` and can clear promo + remove `promo` query on `/search` and `/vehicles` only (delegated to context).
- **Submit:** Guard on renter fields; `POST /api/reservation/create` with location **names** from query params, datetimes, `bookingType`, optional driver and voucher.

## Conditions / branches

- `bookingType === "PAY_LATER"` → `router.push(/booking/{reservationNo})`.
- Else → `POST /api/payment/initiate` with `reservationNo`; parse returned `paymentRedirectUrl`, append `reservationNo` query, `router.push`.

## Validation rules (if any)

- Reservation BFF returns 400 if any required field missing (server-side list in route).
- Client blocks submit without renter/contact fields.

## API contracts (route path, main request fields, success/error response shape)

| Route | Method | Role in checkout |
|-------|--------|-------------------|
| `/api/pricing/validate` | POST | `vehicleGroupCode`, `pickupAt`, `dropoffAt`, optional `voucherCode`, `bookingType` → `{ valid, breakdown? }` |
| `/api/reservation/create` | POST | Full booking payload per route | `{ reservationNo, status }` from mock handler |
| `/api/payment/initiate` | POST | `{ reservationNo }` | `{ paymentRedirectUrl }` (shape from mock) |

## User flow / steps (if multi-step)

1. Land with search/vehicle query params.
2. Fill details (optional login prefill).
3. Extras: optional voucher apply; view promo state.
4. Review → payment step UI (within same page state machine).
5. Submit → pay-later booking page or pay-now initiate redirect.

## Edge cases (only what code confirms)

- `promotion.validatePromotion` effect depends on `promotion` object from optional context — checkout uses `usePromotionOptional`.
- Submit `catch` empty — no user feedback from thrown errors in snippet.

## Required tests (behaviors that must stay covered)

- PAY_LATER vs PAY_NOW branching after reservation create.
- Prefill does not clobber user-edited fields.
- Promotion validate effect gating on datetime/location presence.
