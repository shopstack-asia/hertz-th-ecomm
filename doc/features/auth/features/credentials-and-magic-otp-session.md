# Credentials and magic OTP session

## Purpose

Document email/password login, logout, session introspection for the client, and OTP-based login that sets the same session cookie as password login.

## Related files (src/ paths only, no imports dump)

- `src/app/api/auth/login/route.ts`
- `src/app/api/auth/logout/route.ts`
- `src/app/api/auth/me/route.ts`
- `src/app/api/auth/request-otp/route.ts`
- `src/app/api/auth/verify-otp/route.ts`
- `src/contexts/auth_context.tsx`
- `src/server/mock/session_store.ts`
- `src/server/mock/otp_store.ts`
- `src/server/mock/mock_users.ts`
- `src/server/mock/profile_store.ts` (avatar merge on `/me`)

## Business logic (plain language rules)

- **Login:** Mock user validation; create session; set `hertz_session` cookie with maxAge from session expiry.
- **Logout:** If cookie present, delete server session and clear cookie (`maxAge: 0`).
- **Me:** No cookie → `{ authenticated: false, user: null }` (200). Invalid/expired session → same shape. Valid → merge optional `avatar_url` from profile store into user JSON.
- **Request OTP:** Email required and regex-valid; stores OTP in mock store; returns `otp_ref` (mock ref string).
- **Verify OTP:** Email + OTP required; fixed `123456` bypass; on success synthetic user from email local-part, session + cookie set; returns `success` and `user`.

## Conditions / branches

- Verify: invalid OTP → 400 `{ success: false, error: "INVALID_OTP" }`.
- Login: missing email or undefined password → 400; bad credentials → 401.

## Validation rules (if any)

- Request OTP: invalid email format → 400.
- Verify: empty email/otp → 400.

## API contracts (route path, main request fields, success/error response shape)

| Route | Method | Body | Success | Errors |
|-------|--------|------|---------|--------|
| `/api/auth/login` | POST | `{ email, password }` | `{ ok, user, expires_at }` | 400, 401 |
| `/api/auth/logout` | POST | — | `{ ok: true }` | — |
| `/api/auth/me` | GET | — | `{ authenticated, user, expires_at? }` | always 200 for unauthenticated shape |
| `/api/auth/request-otp` | POST | `{ email }` | `{ success, otp_ref }` | 400 |
| `/api/auth/verify-otp` | POST | `{ email, otp }` | `{ success, user }` | 400 |

## User flow / steps (if multi-step)

1. Magic login: request OTP → enter OTP (mock `123456`) → verify → cookie set → `AuthProvider` can refresh `/me`.

## Edge cases (only what code confirms)

- `/me` merges `avatar_url` from profile when present.
- `AuthProvider` catches network errors and leaves prior `authenticated`/`user` unchanged while ending loading.

## Required tests (behaviors that must stay covered)

- Cookie set/clear semantics on login/logout.
- OTP bypass vs consume path (multi-worker note in verify route comment).
- `/me` response shape for missing vs invalid cookie.
