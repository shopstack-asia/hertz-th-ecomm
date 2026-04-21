# Booking datetime and location state

## Purpose

Centralize pickup/dropoff **codes**, human-readable **names**, and **date/time** fields used by booking bar components and search/navigation flows.

## Related files (src/ paths only, no imports dump)

- `src/contexts/BookingContext.tsx`

## Business logic (plain language rules)

- Default pickup date = today; default dropoff date = tomorrow; times default `10:00`.
- `setPickupLocation` updates pickup code/name and, when `sameAsPickup` is true, also updates dropoff to the same code/name.
- `setSameAsPickup(true)` copies pickup to dropoff; `false` leaves dropoff unchanged.
- `updateState` merges arbitrary partial state.

## Conditions / branches

- `useBooking` throws if used outside `BookingProvider`.

## Validation rules (if any)

- None in context (free-form strings).

## API contracts (route path, main request fields, success/error response shape)

- None — client context only.

## User flow / steps (if multi-step)

1. User edits booking bar → context updates → linked pages read state for search/navigation.

## Edge cases (only what code confirms)

- Initial empty location codes until user selects branches.

## Required tests (behaviors that must stay covered)

- `sameAsPickup` toggling copies and decouples dropoff as expected.
- Default date rolling (if tests freeze time).
