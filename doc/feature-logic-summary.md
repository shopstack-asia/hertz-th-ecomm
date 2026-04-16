# Feature logic summary (global index)

## Purpose

This file is a **navigation index only**. It does **not** replace feature-area documentation under `doc/features/<feature-area>/`.

Use it to:

- Pick the correct **feature area** name for a task.  
- Jump to the **README** and **feature-level summary** for that area.

## Feature areas and doc paths

| Feature area | Doc folder | README | Area feature-logic summary |
|--------------|------------|--------|----------------------------|
| `booking` | [features/booking/](./features/booking/) | [README.md](./features/booking/README.md) | [feature-logic-summary.md](./features/booking/feature-logic-summary.md) |
| `checkout` | [features/checkout/](./features/checkout/) | [README.md](./features/checkout/README.md) | [feature-logic-summary.md](./features/checkout/feature-logic-summary.md) |
| `payment` | [features/payment/](./features/payment/) | [README.md](./features/payment/README.md) | [feature-logic-summary.md](./features/payment/feature-logic-summary.md) |
| `auth` | [features/auth/](./features/auth/) | [README.md](./features/auth/README.md) | [feature-logic-summary.md](./features/auth/feature-logic-summary.md) |
| `account` | [features/account/](./features/account/) | [README.md](./features/account/README.md) | [feature-logic-summary.md](./features/account/feature-logic-summary.md) |
| `voucher` | [features/voucher/](./features/voucher/) | [README.md](./features/voucher/README.md) | [feature-logic-summary.md](./features/voucher/feature-logic-summary.md) |
| `loyalty` | [features/loyalty/](./features/loyalty/) | [README.md](./features/loyalty/README.md) | [feature-logic-summary.md](./features/loyalty/feature-logic-summary.md) |
| `locations` | [features/locations/](./features/locations/) | [README.md](./features/locations/README.md) | [feature-logic-summary.md](./features/locations/feature-logic-summary.md) |
| `promotion` | [features/promotion/](./features/promotion/) | [README.md](./features/promotion/README.md) | [feature-logic-summary.md](./features/promotion/feature-logic-summary.md) |
| `cms` | [features/cms/](./features/cms/) | [README.md](./features/cms/README.md) | [feature-logic-summary.md](./features/cms/feature-logic-summary.md) |
| `layout` | [features/layout/](./features/layout/) | [README.md](./features/layout/README.md) | [feature-logic-summary.md](./features/layout/feature-logic-summary.md) |
| `home` | [features/home/](./features/home/) | [README.md](./features/home/README.md) | [feature-logic-summary.md](./features/home/feature-logic-summary.md) |

If a linked file is missing, the agent must **scaffold or update** that feature area’s docs per [rules/feature-area-documentation.md](./rules/feature-area-documentation.md) before relying on undocumented behavior.

## Cross-feature concerns

| Concern | Where it lives | Notes |
|---------|------------------|--------|
| **Language / i18n** | `src/contexts/LanguageContext.tsx` | User-facing strings via `useLanguage().t(...)`. |
| **Auth session** | `src/contexts/` (e.g. auth-related providers) | Session, OTP, OAuth flows; still BFF through `src/app/api/auth/*`. |
| **BFF** | `src/app/api/*` | Single path for external integration; see [rules/coding.md](./rules/coding.md). |
| **Booking / promotion / cookies** | Contexts under `src/contexts/` | Shared state; do not bypass documented flows. |

## Obsolete patterns to avoid

- **External `fetch` from the browser** to non-`/api/*` backend URLs for product features.  
- **Hardcoded locale strings** in components for user-visible text.  
- **Deep imports** across feature modules’ private folders.  
- **Duplicating** shared UI instead of using `src/components/ui/`.  
- **Documenting by file name only** (e.g. `BookingForm.md`) instead of **domain behavior** (e.g. `booking-date-validation.md`)—see [rules/feature-area-documentation.md](./rules/feature-area-documentation.md).
