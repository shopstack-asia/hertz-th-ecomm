# Layout — hertz-th-ecomm

## Purpose

**Global shell** for the storefront: root HTML/font setup, **language** and **cookie consent** providers, PWA install banner, **middleware** session protection for selected routes, site chrome (`Header`/`Footer`), and **promotion** provider wrapper around main content.

## Scope

- **Belongs here:** `src/app/layout.tsx`, `src/app/(site)/layout.tsx`, `src/components/layout/`, `src/components/common/` (shared chrome pieces like cookie UI), `src/components/pwa/`, `src/contexts/LanguageContext.tsx`, `src/contexts/CookieConsentContext.tsx`, `src/middleware.ts`, BFF routes **`/api/i18n`** and **`/api/languages`** (only used from `LanguageProvider`).
- **Does not belong here:** Feature business rules inside pages. `/api/session` (**account**). All other `/api/*` routes — see `domain-features.md` ownership table.

## Reading order

1. `domain-features.md`
2. `feature-logic-summary.md`
3. `features/middleware-protected-routes.md`

## Code paths

- `src/app/layout.tsx`
- `src/app/(site)/layout.tsx`
- `src/middleware.ts`
- `src/components/layout/`
- `src/components/common/`
- `src/components/pwa/`
- `src/contexts/LanguageContext.tsx`
- `src/contexts/CookieConsentContext.tsx`
- `src/components/promotion/PromotionBarWrapper.tsx`
- `src/lib/api-locale-client.ts` (installed from `LanguageProvider` effect)
- `src/app/api/i18n/route.ts`
- `src/app/api/languages/route.ts`
