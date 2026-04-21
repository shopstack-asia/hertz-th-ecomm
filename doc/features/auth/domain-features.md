# Domain features — auth

## Client auth state (`AuthProvider`)

On mount, the provider calls `GET /api/auth/me` with credentials. If `authenticated` and `user` are present, it sets local state; otherwise clears. Network errors during refresh **do not** clear auth (commented in code).

## Email + password login

`POST /api/auth/login` validates against mock users, creates a session, sets `hertz_session` httpOnly cookie, returns `ok`, `user`, `expires_at`. Invalid credentials → 401.

## Magic OTP login

`POST /api/auth/request-otp` stores a mock OTP for the email (format validation). `POST /api/auth/verify-otp` accepts email + OTP; mock bypass `123456` always accepted; otherwise consumes from OTP store. On success creates session and sets cookie.

## Sign up

**Init:** Validates names, email, optional phone format, and **consent** object (`accept_terms` / `accept_privacy` must be true; marketing optional). Persists signup draft and returns `otp_ref`.

**Verify OTP:** Requires `otp_ref`, 6-digit OTP, `channel` email or phone; enforces phone channel only if signup has phone; attempts capped with messages; mock bypass `123456` marks channel verified.

**Resend:** Requires `otp_ref` and `channel`; errors if expired or no phone for phone channel.

**Complete:** Requires `otp_ref` + password meeting length and letter/number rules; consumes signup entry and calls `createSession(user)`.

> **Code note:** `signup/complete` creates a server session but **does not** set the `hertz_session` cookie in that route file — only returns JSON `success` and `user`. Whether the client sets session elsewhere is not proven from this file alone.

> Needs product/domain confirmation: intended production parity for signup completion (cookie vs token vs client-side follow-up).

## Forgot password

Request OTP by email (mock fixed OTP `123456` stored by ref). Verify requires email, OTP, and `otp_ref`. Reset requires email, `otp_ref`, and `new_password` (min length 8); consumes OTP entry; **mock does not persist new password** beyond success JSON.

## OAuth (Google / Apple)

**Start:** Validates optional `next` param, stores state with provider, redirects to real IdP authorize URL using placeholder `MOCK_INVALID_CLIENT` (comment in code: intentionally invalid client to surface IdP error pages).

**Callback:** Validates `state`, resolves user from `code` via mock user map, creates session, sets cookie, redirects to `next` path.

## Edge cases

- OAuth callback missing/invalid `state` → redirect to `/account/login?error=invalid_state`.
- Invalid `code` → `/account/login?error=invalid_code`.
