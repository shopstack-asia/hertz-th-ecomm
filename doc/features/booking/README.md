# Booking — hertz-th-ecomm

## Purpose

**Discover and configure** a rental: home and car-rental entry points, location/datetime state, **search** results and filters, **vehicle** detail with mock pricing/add-ons, navigation into **checkout**, and post-booking **reservation detail** pages backed by mock booking APIs.

## Scope

- **Belongs here:** `(site)/page.tsx` only where booking widgets compose (see **home** for marketing sections), `(site)/car-rental`, `(site)/search`, `(site)/vehicle/[groupCode]`, `(site)/vehicles`, `(site)/booking/[reservationNo]`, `src/components/booking/`, `src/components/search/`, `src/contexts/BookingContext.tsx`, BFF `src/app/api/search`, `src/app/api/locations`, `src/app/api/vehicle`, `src/app/api/addons`, `src/app/api/booking/*` (reservation fetch by id/ref — not the same as checkout’s `reservation/create` which lives under **checkout**).
- **Does not belong here:** Checkout stepper and thank-you (**checkout**). Pay-now payment (**payment**). Promotion rule tables in `/api/promotion/*` (**promotion** — booking **consumes** search results that may include promo eligibility from vehicle/list UI).

## Reading order

1. `domain-features.md`
2. `feature-logic-summary.md`
3. `features/*.md` linked from the summary

## Code paths

- `src/app/(site)/car-rental/page.tsx`
- `src/app/(site)/search/page.tsx`
- `src/app/(site)/vehicle/[groupCode]/page.tsx`
- `src/app/(site)/vehicles/page.tsx`
- `src/app/(site)/booking/[reservationNo]/page.tsx`
- `src/components/booking/`
- `src/components/search/`
- `src/contexts/BookingContext.tsx`
- `src/app/api/search/route.ts`
- `src/app/api/locations/route.ts`
- `src/app/api/vehicle/[groupCode]/route.ts`
- `src/app/api/addons/route.ts`
- `src/app/api/booking/[reservationNo]/route.ts`
- `src/app/api/booking/by-ref/[bookingRef]/route.ts`
- `src/lib/mock/searchVehicles.ts` (search behavior; mock)
