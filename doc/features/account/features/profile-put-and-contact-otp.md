# Profile PUT, contact OTP, uploads, and session

## Purpose

Authenticated account maintenance: read/update profile, change email or phone via OTP, upload avatar and KYC-style documents, and fetch combined session + profile for client services.

## Related files (src/ paths only, no imports dump)

- `src/app/api/account/profile/route.ts`
- `src/app/api/profile/request-otp/route.ts`
- `src/app/api/profile/verify-otp/route.ts`
- `src/app/api/profile/upload-avatar/route.ts`
- `src/app/api/profile/upload-document/route.ts`
- `src/app/api/session/route.ts`
- `src/services/profile.service.ts`
- `src/server/mock/session_store.ts`
- `src/server/mock/profile_store.ts`
- `src/server/mock/otp_store.ts`

## Business logic (plain language rules)

- Session cookie name `hertz_session` across routes.
- Profile updates merge allowed keys only; session mirror fields updated on success.
- OTP verify commits email or phone to both profile and session.
- Session GET attaches profile when present.

## Conditions / branches

- All mutating profile/OTP/upload routes: 401 without valid session.
- Request OTP: 400 missing type/value; 429 when mock rate limit returns not ok.

## Validation rules (if any)

- Verify OTP: regex `^\d{6}$` on otp.
- Avatar: MIME allowlist + size cap.

## API contracts (route path, main request fields, success/error response shape)

| Route | Method | Notes |
|-------|--------|--------|
| `/api/account/profile` | GET / PUT | PUT JSON partial fields per route |
| `/api/profile/request-otp` | POST | `{ type, new_value }` |
| `/api/profile/verify-otp` | POST | `{ otp, type, new_value }` |
| `/api/profile/upload-avatar` | POST | `multipart/form-data` field `file` |
| `/api/profile/upload-document` | POST | multipart with `type` + `file` |
| `/api/session` | GET | 401 unauthenticated; 200 with user + profile |

## User flow / steps (if multi-step)

1. Change email: request OTP → verify with 6-digit code → session/profile updated.

## Edge cases (only what code confirms)

- Session rotation: cookie rewritten when `updateSessionUser` returns new session id.

## Required tests (behaviors that must stay covered)

- Disallowed identity document enum handling.
- OTP verify failure codes from `verifyOtp` result.
- Avatar oversize / wrong MIME.
