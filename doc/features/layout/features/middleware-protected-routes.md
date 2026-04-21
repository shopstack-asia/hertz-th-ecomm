# Middleware protected routes

## Purpose

Redirect anonymous users (missing `hertz_session` cookie) from selected **account/loyalty-adjacent** pages to login with a `returnUrl` query.

## Related files (src/ paths only, no imports dump)

- `src/middleware.ts`

## Business logic (plain language rules)

- If pathname is **not** one of the protected prefixes, `NextResponse.next()` immediately.
- Else read cookie `hertz_session`; missing/empty → 302 to `/account/login?returnUrl={original pathname}`.
- Else continue.

## Conditions / branches

- `isProtectedPath` checks exact match or prefix match for configured base paths.

## Validation rules (if any)

- None (cookie presence only).

## API contracts (route path, main request fields, success/error response shape)

- None — Edge middleware only.

## User flow / steps (if multi-step)

1. User hits `/account/profile` without cookie → redirected to login.

## Edge cases (only what code confirms)

- `isProtectedPath` includes `/account/bookings`, but `config.matcher` only lists `/account/bookings/:path*` (subpaths), **not** the exact `/account/bookings` path — so the middleware may **not** run for `/account/bookings` alone while it does for `/account/bookings/upcoming` etc.

> Needs product/domain confirmation: whether `/account/bookings` index should be gated; if yes, extend `matcher` to include that path.

## Required tests (behaviors that must stay covered)

- Matcher coverage vs `isProtectedPath` (routes that should gate but are not matched will bypass middleware entirely).
