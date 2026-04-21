# Promotion validate, eligibility, and campaign

## Purpose

Server-side mock rules for promotion codes, client orchestration in `PromotionContext`, and campaign metadata for downstream pricing.

## Related files (src/ paths only, no imports dump)

- `src/contexts/PromotionContext.tsx`
- `src/app/api/promotion/validate/route.ts`
- `src/app/api/promotion/check-eligibility/route.ts`
- `src/app/api/campaign-logic/route.ts`
- `src/components/vehicle/VehicleCard.tsx`

## Business logic (plain language rules)

- **Validate:** Requires non-empty `promo_code`; known rule config must exist; rental day count from `pickup_date` / `dropoff_date` must meet `min_rental_days`; success returns `discount_label` + `conditions` object.
- **Eligibility:** Requires `promo_code` + `vehicle_id` + `rental_days` + `vehicle_class`; applies min-day and vehicle class gating; returns `discount_amount` when `base_price` > 0 else 0 with `eligible: true`.
- **Campaign logic:** Uppercases `code` query param; returns null campaign if unknown.
- **Context validatePromotion:** Empty code → invalid `{ message: "No promotion code" }` without network. Otherwise POST validate and map fields.

## Conditions / branches

- Validate: invalid JSON → 400.
- Eligibility: invalid JSON → 400.
- Context: URL promo wins over localStorage hydration timing per effects order.

## Validation rules (if any)

- Rental day parser returns 0 when dropoff ≤ pickup → triggers min-days failure for SAVE10.

## API contracts (route path, main request fields, success/error response shape)

| Route | Method | Body / query | Response notes |
|-------|--------|--------------|------------------|
| `/api/promotion/validate` | POST | `promo_code`, `pickup_date`, `dropoff_date`, locations | `{ valid, message, discount_label?, conditions? }` |
| `/api/promotion/check-eligibility` | POST | `promo_code`, `vehicle_id`, `rental_days`, `vehicle_class`, optional `base_price` | `{ eligible, discount_amount?, reason_if_not_eligible? }` |
| `/api/campaign-logic` | GET | `code` query | `{ campaign: null \| { type, value?, label } }` |

## User flow / steps (if multi-step)

1. User enters promo on search/vehicles or lands with `?promo=`.
2. Context stores code + optional URL sync.
3. Checkout or vehicle flows call `validatePromotion` or card eligibility as needed.

## Edge cases (only what code confirms)

- `usePromotion` throws outside provider; `usePromotionOptional` returns null.

## Required tests (behaviors that must stay covered)

- SAVE10 min-days vs class gating matrix on both endpoints.
- Context stale code: `validatePromotion` accepts `codeOverride` parameter.
