# Account — hertz-th-ecomm

## Purpose

**Signed-in customer hub:** profile fields and documents, **OTP-gated** email/phone changes, avatar upload, booking lists (upcoming/past), and the stricter **`/api/session`** payload used by profile service code.

## Scope

- **Belongs here:** `(site)/account/profile`, `(site)/account/bookings`, `src/components/profile/`, `src/components/points-table/` (if only used on account pages — verify callers when extending), `src/app/api/account/*`, `src/app/api/profile/*`, `src/services/profile.service.ts`, `src/services/otp.service.ts` (if present as thin wrappers), `src/app/api/session/route.ts` (only caller from `profile.service.ts` in repo).
- **Does not belong here:** Login/signup (**auth**). Points balance marketing pages (**loyalty**). Middleware cookie gate (**layout**).

## Reading order

1. `domain-features.md`
2. `feature-logic-summary.md`
3. `features/profile-put-and-contact-otp.md`

## Code paths

- `src/app/(site)/account/profile/page.tsx`
- `src/app/(site)/account/bookings/upcoming/page.tsx`
- `src/app/(site)/account/bookings/past/page.tsx`
- `src/components/profile/`
- `src/components/points-table/`
- `src/app/api/account/profile/route.ts`
- `src/app/api/account/bookings/upcoming/route.ts`
- `src/app/api/account/bookings/past/route.ts`
- `src/app/api/profile/request-otp/route.ts`
- `src/app/api/profile/verify-otp/route.ts`
- `src/app/api/profile/upload-avatar/route.ts`
- `src/app/api/profile/upload-document/route.ts`
- `src/app/api/session/route.ts`
- `src/services/profile.service.ts`
- `src/services/otp.service.ts`
