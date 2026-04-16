# Domain features — checkout

## Query-string contract (checkout page)

The checkout page reads `groupCode`, `bookingType` (`PAY_LATER` | `PAY_NOW`, default `PAY_LATER`), location codes/names, and ISO-ish datetime strings `pickupAt` / `dropoffAt` from the URL. Missing renter fields block progression from the details step.

## Pricing snapshot on load

On mount and when voucher code or booking type changes, the page POSTs `/api/pricing/validate` with `vehicleGroupCode`, `pickupAt`, `dropoffAt`, optional `voucherCode`, and `bookingType`. When `breakdown` is returned, it becomes local `pricing` state. Errors are swallowed (empty catch).

## Promotion context (cross-feature)

If `PromotionContext` has a `promoCode`, checkout triggers `validatePromotion` with pickup/dropoff locations and dates when enough params exist. UI shows valid vs not-applicable states and allows clearing promo + stripping `promo` from URL on `/search`/`/vehicles` pattern is in promotion context, not checkout.

## Submit reservation

Successful `POST /api/reservation/create` returns `reservationNo` (and status). Client navigates to `/booking/{reservationNo}` for pay-later. For pay-now, calls `/api/payment/initiate` then pushes to payment URL with `reservationNo` query appended.

## Thank-you page

Reads `reservationId` or `booking_ref` plus optional `type`. Fetches `GET /api/reservations/{id}` where `id` may be reservation number or `HZT######` booking ref (resolved server-side). Receipt download opens `/api/reservations/{id}/receipt` in a new tab.

## Related booking BFF

`/api/booking/create` creates pay-later style reservation and returns `booking_ref` + `total` without payment session — used in flows that map ref to reservation for thank-you style UIs.

## Edge cases

- Thank-you: missing reference sets i18n error key `thankYou.missing_reference`.
- Checkout submit catch block is empty in source — failures do not surface UI in the read snippet.

> Needs product/domain confirmation: intended user-visible error handling for failed reservation create.
