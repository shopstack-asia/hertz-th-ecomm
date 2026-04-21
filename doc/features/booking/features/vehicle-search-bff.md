# Vehicle search BFF

## Purpose

Expose mock vehicle search for the storefront with consistent locale handling from the incoming request.

## Related files (src/ paths only, no imports dump)

- `src/app/api/search/route.ts`
- `src/lib/mock/searchVehicles.ts`
- `src/app/(site)/search/page.tsx`
- `src/app/(site)/vehicles/page.tsx`

## Business logic (plain language rules)

- Collect optional filters from query string: pickup/dropoff locations and datetimes, category, transmission, price bounds, sort, pagination.
- Resolve locale via `getLocaleFromRequest`.
- Delegate to `runSearch(params, locale)` and return JSON.

## Conditions / branches

- No explicit HTTP error branches in the route file beyond whatever `runSearch` throws (uncaught → framework error).

## Validation rules (if any)

- None in the route handler itself.

## API contracts (route path, main request fields, success/error response shape)

- **Route:** `GET /api/search`
- **Query:** `pickup`, `dropoff`, `pickupAt`, `dropoffAt`, `category`, `transmission`, `min_price`, `max_price`, `sort`, `page`, `page_size` (all optional strings as read from URL).
- **Response:** Opaque JSON from `runSearch` (mock-defined shape).

## User flow / steps (if multi-step)

1. Search or vehicles page builds query string from UI + `BookingContext`.
2. Browser or server fetch hits `/api/search`.

## Edge cases (only what code confirms)

- Missing params are passed as `undefined` into mock — behavior is mock-defined.

## Required tests (behaviors that must stay covered)

- Param forwarding completeness (regression if query keys rename).
- Locale propagation into mock (if mock becomes locale-sensitive).
