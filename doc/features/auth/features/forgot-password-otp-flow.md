# Forgot password OTP flow

## Purpose

Mock flow: request OTP reference by email, verify OTP, then reset “password” with length validation — without connecting to a persistent credential store in this codebase.

## Related files (src/ paths only, no imports dump)

- `src/app/api/auth/forgot-password/request-otp/route.ts`
- `src/app/api/auth/forgot-password/verify-otp/route.ts`
- `src/app/api/auth/forgot-password/reset/route.ts`
- `src/server/mock/forgot_password_otp_store.ts`

## Business logic (plain language rules)

- **Request:** Valid email → create OTP entry with mock fixed OTP `123456`; return `otp_ref`.
- **Verify:** Requires email, OTP, `otp_ref`; entry must exist; `verifyOtp` must succeed → `{ success: true }`.
- **Reset:** Requires email + `otp_ref` + `new_password` string length ≥ 8; `consumeAndInvalidate` must succeed or `OTP_NOT_VERIFIED`.

> Needs product/domain confirmation: production should persist hashed password server-side; current mock only validates and returns success.

## Conditions / branches

- Verify: missing `otp_ref` → 400 "OTP reference required".
- Reset: missing email or ref → 400; short password → 400.

## Validation rules (if any)

- Email format same regex family as request-otp route.
- Password minimum 8 characters (reset route); no letter/number mix required here (unlike signup complete).

## API contracts (route path, main request fields, success/error response shape)

| Route | Method | Body | Success | Errors |
|-------|--------|------|---------|--------|
| `/api/auth/forgot-password/request-otp` | POST | `{ email }` | `{ success, otp_ref }` | 400 |
| `/api/auth/forgot-password/verify-otp` | POST | `{ email, otp, otp_ref }` | `{ success: true }` | 400 |
| `/api/auth/forgot-password/reset` | POST | `{ email, otp_ref, new_password }` | `{ success: true }` | 400 |

## User flow / steps (if multi-step)

1. Request OTP → store receives mock OTP.
2. Verify OTP → unlock consume path.
3. Reset password → consumes OTP ref.

## Edge cases (only what code confirms)

- Expired `otp_ref` on verify → 400 `OTP_EXPIRED`.

## Required tests (behaviors that must stay covered)

- Invalid OTP vs expired ref responses.
- Reset without prior successful verify path (`OTP_NOT_VERIFIED`).
