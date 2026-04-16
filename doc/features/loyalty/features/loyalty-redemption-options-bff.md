# Loyalty redemption options BFF

## Purpose

Produce a **mock** list of points redemption choices (fixed discounts, free days, free add-ons, upgrade) sized from rental duration and optional vehicle/add-on context.

## Related files (src/ paths only, no imports dump)

- `src/app/api/loyalty/redemption-options/route.ts`
- `src/lib/mock/data.ts` (`basePrices`)
- `src/lib/mock/searchVehicles.ts` (`getBasePrices`)

## Business logic (plain language rules)

- Parse `rentalDays` 1..365 from query (default 1).
- Optional `vehicleGroupCode` drives base rental total for FREE_DAY style rewards via pay-later daily rate × days.
- Optional `addonIds` comma list informs FREE_ADDON option pricing using the same per-addon daily/flat table as in the route.
- `bookingId` query param is read but **not used** in the current implementation.

## Conditions / branches

- Missing/invalid session → **200 with empty array** (not 401).

## Validation rules (if any)

- None beyond numeric clamps.

## API contracts (route path, main request fields, success/error response shape)

- **Route:** `GET /api/loyalty/redemption-options`
- **Query:** `bookingId?`, `vehicleGroupCode?`, `rentalDays?`, `addonIds?` (comma-separated)
- **Response:** JSON array of `PointsRedemptionOption` shaped objects.

## User flow / steps (if multi-step)

1. Checkout or vehicle UI (when wired) supplies rental context as query params.
2. Client renders selectable redemption rows.

## Edge cases (only what code confirms)

- Unauthenticated user receives empty options list, not an error.

## Required tests (behaviors that must stay covered)

- Rental day clamping and addon amount math for FREE_ADDON entries.
- Session present vs absent behavior difference.
