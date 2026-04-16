# Prompt: Scan & Scaffold Feature Area Documentation for hertz-th-ecomm

## Objective

Read the existing source code across all feature areas and create initial documentation under `doc/features/<feature-area>/` for each area. Documentation must reflect **what the code actually does today** — do not invent behavior, do not guess intent beyond what the code proves.

This is a **read-then-document** task. No production code changes. No test changes.

---

## Rules before starting

1. Read `doc/ai-agent-instruction.md` and all files under `doc/rules/` first.
2. For each feature area: read the code → write the doc. Do not write docs from memory or assumption.
3. If intent is unclear from code alone, write: `> Needs product/domain confirmation` in that section.
4. Keep every doc **concise** — describe invariants and flows, not line-by-line code.

---

## Feature areas to document (do all 12)

| Feature area | Primary code paths to scan |
|---|---|
| `booking` | `src/app/(site)/` (home, car-rental, search, vehicle, vehicles pages), `src/components/booking/`, `src/components/search/`, `src/app/api/search/`, `src/app/api/locations/`, `src/app/api/vehicle/`, `src/app/api/addons/`, `src/contexts/BookingContext.tsx` |
| `checkout` | `src/app/(site)/checkout/`, `src/app/(site)/thank-you/`, `src/components/checkout/`, `src/components/vehicle/`, `src/app/api/checkout/`, `src/app/api/reservation/`, `src/app/api/booking/` |
| `payment` | `src/app/(site)/payment/`, `src/app/(site)/payment-return/`, `src/app/(site)/mock-kbank-gateway/`, `src/app/api/payment/` |
| `auth` | `src/app/(site)/account/login/`, `src/app/(site)/account/forgot-password/`, `src/app/(site)/signup/`, `src/components/auth/`, `src/app/api/auth/`, `src/contexts/auth_context.tsx` |
| `account` | `src/app/(site)/account/profile/`, `src/app/(site)/account/bookings/`, `src/components/profile/`, `src/components/points-table/`, `src/app/api/account/`, `src/app/api/profile/`, `src/services/profile.service.ts`, `src/services/otp.service.ts` |
| `voucher` | `src/app/(site)/vouchers/`, `src/app/(site)/my-vouchers/`, `src/app/(site)/voucher-checkout/`, `src/app/(site)/voucher-thank-you/`, `src/components/voucher/`, `src/app/api/vouchers/`, `src/app/api/voucher/`, `src/app/api/voucher-order/` |
| `loyalty` | `src/app/(site)/rewards/`, `src/app/(site)/my-points/`, `src/app/(site)/gold-rewards/`, `src/components/loyalty/`, `src/components/loyalty-card/`, `src/app/api/loyalty/`, `src/services/loyalty.service.ts` |
| `locations` | `src/app/(site)/locations/`, `src/components/locations/`, `src/app/api/locations/` |
| `promotion` | `src/components/promotion/`, `src/app/api/promotion/`, `src/app/api/campaign-logic/`, `src/contexts/PromotionContext.tsx`, `src/components/booking/BookingAndPromotionLayer.tsx` |
| `cms` | `src/app/(site)/products-services/`, `src/app/(site)/drivers/`, `src/app/(site)/special-offers/`, `src/app/(site)/vehicle-guide/`, `src/components/cms/`, `src/components/special-offers/`, `src/app/api/cms/`, `src/app/api/special-offers/`, `src/lib/cms/` |
| `layout` | `src/app/(site)/layout.tsx`, `src/app/layout.tsx`, `src/components/layout/`, `src/components/common/`, `src/components/pwa/`, `src/contexts/CookieConsentContext.tsx`, `src/contexts/LanguageContext.tsx`, `src/middleware.ts` |
| `home` | `src/app/(site)/page.tsx`, `src/components/home/` |

---

## Required output per feature area

Create the following files under `doc/features/<feature-area>/`:

### 1. `README.md`

```
# <Feature area name> — hertz-th-ecomm

## Purpose
One paragraph: what user capability this area owns.

## Scope
- What belongs here (pages, components, API routes)
- What does NOT belong here (cross-references to other areas)

## Reading order
1. domain-features.md
2. feature-logic-summary.md
3. features/<relevant-file>.md (if exists)

## Code paths
List of primary src/ paths that belong to this area.
```

### 2. `domain-features.md`

```
# Domain features — <feature-area>

High-level narrative of what this area does. One section per major capability.
For each capability:
- What the user can do
- Key conditions or constraints visible in code
- Which API routes / contexts are involved
- Any notable edge cases found in code

Mark anything unclear as: > Needs product/domain confirmation
```

### 3. `feature-logic-summary.md`

```
# Feature logic summary — <feature-area>

| Behavior | Doc file | Notes |
|---|---|---|
| <behavior name> | features/<file>.md | one-line description |
| ... | (inline) | behaviors too simple for a separate file |
```

### 4. `features/*.md` (only when behavior meets the threshold)

Create a separate file under `features/` for each behavior that meets **any** of these conditions:
- Spans multiple files or layers
- Has more than 3 meaningful conditions or branches
- Involves validation rules or error handling logic
- Involves multi-step flows (e.g. OTP → verify → complete)
- Is business-critical (payments, auth, reservations, pricing)

**File naming:** use domain behavior names, not component names.

Good: `otp-verification-flow.md`, `booking-search-and-filter.md`, `payment-callback-handling.md`
Invalid: `LoginModal.md`, `route.md`, `BookingForm.md`

Each detailed file should cover:
```
# <Behavior title>

## Purpose
## Related files (src/ paths only, no imports dump)
## Business logic (plain language rules)
## Conditions / branches
## Validation rules (if any)
## API contracts (route path, main request fields, success/error response shape)
## User flow / steps (if multi-step)
## Edge cases (only what code confirms)
## Required tests (behaviors that must stay covered)
```

---

## Important constraints

- **Do not create files for areas where code is trivial** (e.g. a page that just renders static HTML with no logic). A short entry in `domain-features.md` is enough.
- **Do not duplicate content** across `domain-features.md` and `features/*.md`. The domain file is overview only; details go in `features/`.
- **Do not copy-paste code** into docs. Describe intent and invariants.
- **Mock data** (`src/lib/mock/`, `src/server/mock/`) — document the mock behavior only if it reveals the real contract shape. Note it as mock where relevant.
- **Do not touch** any `.ts`, `.tsx`, config, or test files.

---

## Completion criteria

- [ ] All 12 feature areas have `doc/features/<feature-area>/README.md`, `domain-features.md`, `feature-logic-summary.md`
- [ ] `features/*.md` files exist for any behavior meeting the threshold above
- [ ] No invented logic — everything traceable to actual code
- [ ] `> Needs product/domain confirmation` used where intent is unclear
- [ ] No production code modified
