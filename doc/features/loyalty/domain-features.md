# Domain features — loyalty

## Profile (`/api/loyalty/profile`)

Session required; returns fixed `MOCK_LOYALTY` spending/tier ladder JSON (401 if unauthenticated).

## Summary (`/api/loyalty/summary`)

Session required; returns fixed `MOCK_SUMMARY` points + tier info (401 if missing/invalid session).

## Lightweight points (`/api/loyalty/points`)

Returns `{ available_points: 0 }` without session; `{ available_points: 1200 }` when session valid — mock comment in file.

## Transactions (`/api/loyalty/transactions`)

Authenticated; supports query filters (`page`, `type`, date range, `sort`) against an in-memory mock list with pagination math (see route for exact keys).

## Redemption options (`/api/loyalty/redemption-options`)

Authenticated path returns `[]` if no session; otherwise builds synthetic `PointsRedemptionOption[]` from rental days, optional `vehicleGroupCode`, and comma-separated `addonIds` to price FREE_ADDON style rewards.

## Client service

`loyalty.service.ts` documents that the browser must call `/api/loyalty/*` only; wraps profile, summary, and transactions with `credentials: "include"` and throws on 401 for some helpers.

> Needs product/domain confirmation: alignment between redemption option IDs and `/api/checkout/price` `points_redemption` input expectations.
