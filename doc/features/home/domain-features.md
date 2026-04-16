# Domain features — home

## Page composition

`page.tsx` renders a stack of home sections in a fixed order (hero → booking bar → offers → categories → fuel types → locations → vouchers → featured vehicles → why choose → testimonials → app download). Each section is delegated to a component under `src/components/home/`.

## Booking entry

`StickyBookingBar` provides persistent booking access from the home page (implementation details live in **booking** components path).

## Data fetching

Individual home sections may fetch mock or BFF endpoints internally; the root `page.tsx` itself is a **Server Component** with no async data calls in the current snippet.

> Needs product/domain confirmation: if any home section should SSR critical CMS content, that behavior is not visible from `page.tsx` alone—verify each child component when extending.

## Edge cases

- None at the `page.tsx` level beyond standard React composition.
