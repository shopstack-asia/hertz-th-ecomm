# Checkout price BFF

## Purpose

`POST /api/checkout/price` computes **mock** rental pricing (pay-later and pay-now totals) from vehicle id, rental days, promotion code, vouchers, optional campaign object, and optional points redemption — with locale-specific line labels and multiple discount branches.

## Related files (src/ paths only, no imports dump)

- `src/app/api/checkout/price/route.ts`
- `src/lib/mock/searchVehicles.ts` (base rates, vehicle meta)
- `src/lib/mock/data.ts`
- `src/app/(site)/vehicle/[groupCode]/page.tsx` (caller)

## Business logic (plain language rules)

- Parses JSON; requires `vehicle_id`; clamps `rental_days` to 1..365.
- Normalizes `promotion_code`; applies **SAVE10** eligibility (min 2 days, economy/compact category) before using code in math; surfaces `promo_code_error` when ineligible or unknown code without campaign.
- Computes separate totals for pay-later and pay-now daily rates.
- Applies long-stay discount (≥5 days): 20% off base rental in breakdown.
- Applies vouchers: fixed/percent discounts; benefit vouchers tied to add-ons; campaign types `percent_off_rental`, `percent_off_total`, `free_insurance`.
- Caps points redemption discount against a max share of base rental discount budget (`MAX_DISCOUNT_PERCENT_OF_BASE`).

## Conditions / branches

- Invalid JSON body → 400 `Invalid JSON`.
- Unknown `promotion_code` without `campaign` → `promo_code_error` uses locale “invalid promo” message.
- SAVE10 ineligible → code stripped; error string from eligibility helper.

## Validation rules (if any)

- `vehicle_id` required (400).
- OTP-related validation: none here.

## API contracts (route path, main request fields, success/error response shape)

- **Route:** `POST /api/checkout/price`
- **Request (main):** `vehicle_id`, `rental_days`, optional `promotion_code`, `vouchers[]`, `addon_ids[]`, `campaign`, `points_redemption`
- **Response:** Rich JSON: `pay_later_total`, `pay_now_total`, `line_items`, `breakdown`, `vat_rate`, `promo_code_error`, `points_used`, etc. (see route types in file).

## User flow / steps (if multi-step)

1. Vehicle page fetches price when inputs change (client `fetch` to this BFF per vehicle page code path).

## Edge cases (only what code confirms)

- Benefit voucher types map to add-on ids; discount applies only when that add-on selected.

## Required tests (behaviors that must stay covered)

- SAVE10 eligibility vs vehicle category and rental days.
- Points discount capping when other discounts already applied.
- Campaign `free_insurance` interaction with `premium_insurance` add-on.
