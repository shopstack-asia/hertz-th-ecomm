# Signup consent, OTP, and complete

## Purpose

Registration flow: collect PII + **mandatory consent**, issue `otp_ref`, verify OTP per channel, optionally resend, then set password and finalize user — mock implementation.

## Related files (src/ paths only, no imports dump)

- `src/app/api/auth/signup/init/route.ts`
- `src/app/api/auth/signup/verify-otp/route.ts`
- `src/app/api/auth/signup/resend-otp/route.ts`
- `src/app/api/auth/signup/complete/route.ts`
- `src/server/mock/signup_store.ts`

## Business logic (plain language rules)

- **Init:** Validates first/last name, email format, optional phone pattern, consent object must exist and `accept_terms` / `accept_privacy` true; builds consent record with IP and user-agent; creates signup entry; returns `otp_ref`.
- **Verify:** Validates `otp_ref`, 6-digit OTP, channel; loads entry or returns expired-style error; phone channel rejected if no phone on entry; invalid OTP returns attempts-derived message; mock `123456` forces success and marks channel verified.
- **Resend:** Delegates to store; errors for missing phone on phone channel or expired link.
- **Complete:** Password rules (min 8, letter + number); consumes signup entry; builds user with loyalty tier `SILVER` and consent metadata; calls `createSession` (see edge case).

## Conditions / branches

- Verify: unknown `otp_ref` → 400 `EXPIRED` style payload.
- Complete: missing `otp_ref` or password → 400; consume failure → 400 session expired message.

## Validation rules (if any)

- Phone regex `^[\d\s\-+()]{8,20}$` when phone non-empty.
- OTP length must be 6 digits after stripping non-digits for signup verify.

## API contracts (route path, main request fields, success/error response shape)

| Route | Method | Body | Success | Errors |
|-------|--------|------|---------|--------|
| `/api/auth/signup/init` | POST | names, email, phone?, `consent` | `{ success, otp_ref }` | 400 field errors |
| `/api/auth/signup/verify-otp` | POST | `otp_ref`, `otp`, `channel` | `{ success, email_verified, phone_verified, has_phone }` | 400 |
| `/api/auth/signup/resend-otp` | POST | `otp_ref`, `channel` | `{ success: true }` | 400 |
| `/api/auth/signup/complete` | POST | `otp_ref`, `password` | `{ success, user }` | 400 |

## User flow / steps (if multi-step)

1. Init → receive `otp_ref`.
2. Verify email (and optionally phone) via OTP.
3. Resend if needed (same `otp_ref`).
4. Complete with password.

## Edge cases (only what code confirms)

- `complete` creates a session via `createSession(user)` but **does not** set `hertz_session` in this route — client must not assume cookie auth without another step.

## Required tests (behaviors that must stay covered)

- Consent gate branches (terms/privacy false).
- OTP attempt exhaustion messaging.
- Complete password validation matrix.
