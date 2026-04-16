# Domain features — booking

## Booking context

`BookingProvider` holds pickup/dropoff location codes and display names, “same as pickup” flag, and separate pickup/dropoff **date** and **time** strings with sensible defaults (today / tomorrow). Updates can mirror dropoff to pickup when `sameAsPickup` is true.

## Search BFF

`GET /api/search` forwards query params (`pickup`, `dropoff`, `pickupAt`, `dropoffAt`, filters, pagination) into `runSearch` mock and returns JSON results for the locale inferred from the request.

## Locations for booking UI

Booking flows call `GET /api/locations` **without** list-style query flags to receive a **legacy** array shape for dropdowns (`code`, `name`, `city`, `address`). The locations feature area documents the richer `list=1` response.

## Vehicle detail

`GET /api/vehicle/{groupCode}` returns a localized vehicle object or 404. The vehicle detail page drives `/api/checkout/price` for pricing panels. **Promotion eligibility** for list cards is requested from `VehicleCard` via `POST /api/promotion/check-eligibility` when a promo code and rental context exist.

## Add-ons list

`GET /api/addons` returns translated add-on catalog metadata (daily vs flat, insurance flags, optional seasonal) for building checkout add-on selection UIs.

## Reservation detail pages

- `GET /api/booking/{reservationNo}` loads a booking by reservation number.
- `GET /api/booking/by-ref/{bookingRef}` resolves `HZT######` style ref via in-memory map then returns booking JSON with `booking_ref` attached.

## Edge cases

- Booking by ref: unknown ref → 404 JSON `{ error: "Booking not found" }`.
- Search depends entirely on mock implementation quality for empty results.

> Needs product/domain confirmation: canonical mapping between location **codes** in URL vs display names sent to checkout.
