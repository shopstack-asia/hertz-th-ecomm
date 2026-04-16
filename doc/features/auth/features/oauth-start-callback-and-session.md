# OAuth start, callback, and session

## Purpose

Google and Apple OAuth **entry** and **return** handling: CSRF-ish `state` with optional `next` redirect, exchange `code` for mock user profile, then session cookie and browser redirect.

## Related files (src/ paths only, no imports dump)

- `src/app/api/auth/oauth/google/start/route.ts`
- `src/app/api/auth/oauth/google/callback/route.ts`
- `src/app/api/auth/oauth/apple/start/route.ts`
- `src/app/api/auth/oauth/apple/callback/route.ts`
- `src/server/mock/oauth_state_store.ts`
- `src/server/mock/oauth_mock_users.ts`
- `src/server/mock/session_store.ts`

## Business logic (plain language rules)

- **Start (both providers):** Read `next` query; default `/` if invalid per `validateNext`; create state tagged `GOOGLE` or `APPLE`; redirect to provider authorize URL with `redirect_uri` pointing to this deployment’s callback route and `MOCK_INVALID_CLIENT` as `client_id` (intentional for demo per code comments).
- **Callback:** Consume `state`; on failure redirect to login with `error=invalid_state`. Resolve user from `code` via mock helper; missing/invalid → `error=invalid_code`. Else create session, set `hertz_session`, redirect to origin + normalized `next` path.

## Conditions / branches

- Missing `code` or unknown code path yields invalid_code redirect.
- Apple vs Google differ only in authorize URL and scope/response_type params.

## Validation rules (if any)

- `next` must pass `validateNext` or fallback to `/` on start.

## API contracts (route path, main request fields, success/error response shape)

| Route | Method | Query | Response |
|-------|--------|-------|----------|
| `/api/auth/oauth/google/start` | GET | `next?` | 302 to Google authorize |
| `/api/auth/oauth/google/callback` | GET | `code`, `state` | 302 to app path or login error |
| `/api/auth/oauth/apple/start` | GET | `next?` | 302 to Apple authorize |
| `/api/auth/oauth/apple/callback` | GET | `code`, `state` | 302 to app path or login error |

## User flow / steps (if multi-step)

1. Browser hits start route → IdP (may error at IdP due to mock client id).
2. IdP returns to callback with `code` → session cookie → redirect to `next`.

## Edge cases (only what code confirms)

- Invalid client is **by design** in start routes for presentation.

## Required tests (behaviors that must stay covered)

- State replay: consumed state should fail second use (rely on store behavior).
- Redirect URL normalization for `next` values.
