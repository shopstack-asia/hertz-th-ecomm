# Locations BFF: legacy vs list

## Purpose

Serve both booking **dropdown** clients and the **locations explorer** from one endpoint by switching JSON shape based on query params.

## Related files (src/ paths only, no imports dump)

- `src/app/api/locations/route.ts`
- `src/lib/mock/locationsBranches.ts`

## Business logic (plain language rules)

- Read optional filters from query string.
- Filter mock branches in-memory.
- If “locations page” detector true → `{ total, data }` with `toApiBranch` objects.
- Else → `toLegacyFormat` array.

## Conditions / branches

- `isLocationsPage` when `list=1` OR any of province, branch_type, keyword/q present OR `page` / `page_size` keys exist in search params (presence check via `searchParams.has`).

## Validation rules (if any)

- None beyond province normalization returning null for unknown tokens (then substring filter path may still apply).

## API contracts (route path, main request fields, success/error response shape)

- **Route:** `GET /api/locations`
- **Query:** `q` or `keyword`, `province`, `branch_type`, `list`, `page`, `page_size`
- **Response:** legacy array OR `{ total, data }`.

## User flow / steps (if multi-step)

1. Booking widget calls without list flags → legacy array.
2. Locations page calls with filters/list → paginated rich objects.

## Edge cases (only what code confirms)

- List branch returns **all** filtered rows in `data` (no slicing in route); `page` / `page_size` only influence **which response shape** is selected today.

## Required tests (behaviors that must stay covered)

- Shape switch boundary: minimal query sets that flip `isLocationsPage`.
- Province code vs display name filter paths.
