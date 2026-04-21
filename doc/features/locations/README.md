# Locations — hertz-th-ecomm

## Purpose

**Branch finder** experience: browse/filter Hertz locations for customers, backed by a single **locations BFF** that supports both a **legacy** array shape (booking dropdowns) and a **rich** list payload (locations page filters).

## Scope

- **Belongs here:** `(site)/locations`, `src/components/locations/`, `src/app/api/locations/route.ts`, mock data `src/lib/mock/locationsBranches.ts`.
- **Does not belong here:** `BookingContext` defaults (**booking**). Checkout’s use of location **names** in reservation payload (**checkout**).

## Reading order

1. `domain-features.md`
2. `feature-logic-summary.md`
3. `features/locations-bff-legacy-vs-list.md`

## Code paths

- `src/app/(site)/locations/page.tsx`
- `src/components/locations/`
- `src/app/api/locations/route.ts`
- `src/lib/mock/locationsBranches.ts`
