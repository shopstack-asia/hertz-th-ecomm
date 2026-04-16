# Domain features — account

## Profile CRUD (`/api/account/profile`)

- **GET:** Requires session cookie; lazily creates profile row from session user if missing; returns `AccountProfile` JSON.
- **PUT:** Partial update for name fields, avatar URL, identity document type (`id_card` | `passport`) and URLs, driver license URL/expiry. Email/phone changes are explicitly **excluded** here (comment in route) — those go through OTP routes. May rotate session id via `updateSessionUser` and reset cookie when returned session id differs.

## Contact change OTP (`/api/profile/request-otp` + `/api/profile/verify-otp`)

- **Request:** Authenticated; `type` must be `phone` or `email`; `new_value` required; uses mock `createOtp` with rate limit path (`429` with error body). Logs OTP to server console in non-production.
- **Verify:** Authenticated; requires 6-digit `otp`, `type`, `new_value`; updates profile + session email or phone; may rotate session cookie like profile PUT.

## Uploads

- **Avatar:** multipart `file`; JPEG/PNG only; max 5MB; stores data URL in profile and updates session user snapshot.
- **Document:** (see route for `type` identity vs driver license) — mock returns URL + optional extracted expiry.

## Session introspection (`/api/session`)

- Returns **401** when cookie missing or session invalid (stricter than `/api/auth/me` which returns 200 with `authenticated: false`).
- Success JSON includes `user` and optional `profile` blob from profile store.

## Bookings lists

- `GET /api/account/bookings/upcoming` and `.../past` return `{ bookings }` from mock handlers (no auth guard in the small route file — relies on middleware for pages).

> Needs product/domain confirmation: whether booking list APIs should enforce session server-side like profile routes.

## Edge cases

- Profile PUT with invalid `identity_document_type` is ignored (only accepts the two literals).
