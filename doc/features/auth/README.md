# Auth — hertz-th-ecomm

## Purpose

End-user **identification** for the storefront: email/password login, email OTP (“magic” style) login, registration with consent + OTP verification, forgot-password OTP reset, and Google/Apple OAuth **start**/**callback** — all backed by **mock** session and OTP stores in this repo.

## Scope

- **Belongs here:** `(site)/account/login`, `(site)/account/forgot-password`, `(site)/signup` (+ welcome if present), `src/components/auth/`, `src/app/api/auth/*`, `src/contexts/auth_context.tsx` (client session view via `/api/auth/me`).
- **Does not belong here:** Profile field updates and document uploads (**account**). Route-guard cookie checks (**layout** / `middleware.ts`). `/api/session` (**account** — used by profile service).

## Reading order

1. `domain-features.md`
2. `feature-logic-summary.md`
3. `features/*.md` as linked from the summary table

## Code paths

- `src/app/(site)/account/login/`
- `src/app/(site)/account/forgot-password/`
- `src/app/(site)/signup/`
- `src/components/auth/`
- `src/app/api/auth/login/route.ts`
- `src/app/api/auth/logout/route.ts`
- `src/app/api/auth/me/route.ts`
- `src/app/api/auth/request-otp/route.ts`
- `src/app/api/auth/verify-otp/route.ts`
- `src/app/api/auth/signup/init/route.ts`
- `src/app/api/auth/signup/verify-otp/route.ts`
- `src/app/api/auth/signup/resend-otp/route.ts`
- `src/app/api/auth/signup/complete/route.ts`
- `src/app/api/auth/forgot-password/request-otp/route.ts`
- `src/app/api/auth/forgot-password/verify-otp/route.ts`
- `src/app/api/auth/forgot-password/reset/route.ts`
- `src/app/api/auth/oauth/google/start/route.ts`
- `src/app/api/auth/oauth/google/callback/route.ts`
- `src/app/api/auth/oauth/apple/start/route.ts`
- `src/app/api/auth/oauth/apple/callback/route.ts`
- `src/contexts/auth_context.tsx`
- `src/server/mock/session_store.ts`, `src/server/mock/otp_store.ts`, `src/server/mock/signup_store.ts`, `src/server/mock/forgot_password_otp_store.ts`, `src/server/mock/oauth_state_store.ts`, `src/server/mock/oauth_mock_users.ts`, `src/server/mock/mock_users.ts`
