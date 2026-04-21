# Home — hertz-th-ecomm

## Purpose

The **marketing home page** composition: hero, booking entry (`StickyBookingBar`), special offers, categories, fuel types, top locations, gift vouchers CTA, featured vehicles, trust sections, testimonials, and app download — mostly presentational sections assembled in the route file.

## Scope

- **Belongs here:** `src/app/(site)/page.tsx`, `src/components/home/`.
- **Does not belong here:** Booking search BFF and filters (**booking**). CMS special offers API internals (**cms** — consumed indirectly via components that may fetch). Auth (**auth**).

## Reading order

1. `domain-features.md`
2. `feature-logic-summary.md`

## Code paths

- `src/app/(site)/page.tsx`
- `src/components/home/`
