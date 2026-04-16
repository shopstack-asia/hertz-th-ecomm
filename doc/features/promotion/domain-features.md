# Domain features — promotion

## Promotion context

- Hydrates `promoCode` from `?promo=` on every `searchParams` change (uppercased).
- If no URL promo, reads `localStorage` key `hertz_promo_code` once per relevant effect.
- `setPromoCode` writes/removes localStorage; clearing also resets validation + eligibility map.
- On `/search` and `/vehicles` only, setting a code updates the URL `promo` param via `router.replace` (scroll false).
- `validatePromotion` POSTs `/api/promotion/validate` with locations + dates and maps JSON to `valid` / `invalid` with `discountLabel` / `reason` fields.

## Validate BFF

Implements **SAVE10** rules only in mock table: min rental days from pickup/dropoff datetimes, vehicle class list metadata in response, localized messages. Unknown codes → not recognized message.

## Check eligibility BFF

Implements SAVE10-style percent rule: rental days, normalized vehicle class string checks, optional `base_price` for discount amount rounding. Unknown code → not recognized.

## Campaign logic BFF

`GET /api/campaign-logic?code=...` returns `{ campaign: null }` if missing code; otherwise maps known codes (`SAVE10`, `HERTZ10`, …) to `type` (`percent_off_rental` | `percent_off_total` | `free_insurance`), `value`, localized `label`.

## BookingAndPromotionLayer

Renders sticky booking UI and opens modal/sheet; **no** promotion fetches in this component (name is historical).

## Duplication note

SAVE10 constraints appear in both `/api/promotion/validate`, `/api/promotion/check-eligibility`, and `/api/checkout/price` — all mock-layer; keep behavior aligned when changing any one.

> Needs product/domain confirmation: single source of truth for promo rules when moving off mocks.
