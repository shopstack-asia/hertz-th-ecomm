# Checkout — hertz-th-ecomm

## Purpose

Multi-step **rental checkout**: renter/contact details, extras (promo display + voucher code + optional add-ons messaging), review, then submit to create a **reservation** and branch to pay-later confirmation vs pay-now payment handoff. Post-purchase **thank-you** loads reservation details from the BFF.

## Scope

- **Belongs here:** `(site)/checkout`, `(site)/thank-you`, `src/components/checkout/`, vehicle UI used only as checkout handoff if documented where used (vehicle page drives price → checkout query string — primary ownership stays **booking** for vehicle selection; checkout owns the **checkout page** composition).
- **Also owns BFF usage from checkout page:** `/api/reservation/create`, `/api/pricing/validate`, `/api/payment/initiate` (handoff only), `/api/reservations/*` as used by thank-you.
- **Does not belong here:** Promotion rules implementation (**promotion** for `/api/promotion/*` and `PromotionContext` internals, though checkout **calls** them). Full price engine spec for vehicle page (**booking** + `checkout/price` route owned here for **API** surface when called from checkout context — see summary). Voucher **catalog purchase** (**voucher**).

## Reading order

1. `domain-features.md`
2. `feature-logic-summary.md`
3. `features/checkout-page-and-reservation-submit.md`

## Code paths

- `src/app/(site)/checkout/page.tsx`
- `src/app/(site)/thank-you/page.tsx`
- `src/components/checkout/`
- `src/app/api/reservation/create/route.ts`
- `src/app/api/reservations/[id]/route.ts`
- `src/app/api/reservations/[id]/receipt/route.ts`
- `src/app/api/pricing/validate/route.ts`
- `src/app/api/checkout/price/route.ts` (also used from vehicle page)
- `src/app/api/booking/create/route.ts` (pay-later path returning `booking_ref`; related to confirmation flows)
