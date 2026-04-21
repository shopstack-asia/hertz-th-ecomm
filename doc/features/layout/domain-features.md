# Domain features — layout

## Root layout (`app/layout.tsx`)

Loads global CSS, sets metadata (title, description, PWA manifest links), viewport theme color, font variables (IBM Plex Sans Thai + Noto Sans SC link). Wraps all pages with `LanguageProvider`, `CookieConsentProvider`, `InstallPromptBanner`.

## Site layout (`(site)/layout.tsx`)

Wraps authenticated booking shell: `AuthProvider` → `BookingProvider` → `Header` + `PromotionBarWrapper` (Suspense-wrapped promotion provider per wrapper file) → `main` → `Footer`.

## Language provider

- Fetches `/api/languages` after mount; builds `availableLocales` (filters `enabled !== false`), picks `defaultLocale` when present in list.
- Restores locale from `localStorage` key `hertz-locale` when valid vs available codes.
- Loads message JSON via `GET /api/i18n?locale=...` with in-memory `messagesCache` per locale.
- `setLocale` persists to `localStorage` and **reloads the full window** so “API-fetched content” re-requests with new locale (comment in code).
- While `!isReady`, shows `GlobalLoadingScreen` instead of children.

## Cookie consent provider

Parses `localStorage` key `hertz-cookie-consent` (`accepted` shorthand or JSON). Renders consent bar + settings modal components; `initializeAnalytics` is a stub logging hook for future analytics wiring.

## Middleware session gate

See linked feature doc; cookie name `hertz_session`; matcher lists specific account/loyalty-adjacent paths.

## BFF route ownership (single area)

Use this table when adding new routes so docs stay unambiguous:

| Route prefix or path | Documented feature area |
|----------------------|-------------------------|
| `/api/addons` | booking |
| `/api/auth/*` | auth |
| `/api/account/*`, `/api/profile/*`, `/api/session` | account |
| `/api/booking/*` | booking |
| `/api/campaign-logic` | promotion |
| `/api/checkout/price` | checkout |
| `/api/cms/*` | cms |
| `/api/i18n`, `/api/languages` | layout |
| `/api/locations` | locations |
| `/api/loyalty/*` | loyalty |
| `/api/payment/*` | payment |
| `/api/pricing/validate` | checkout |
| `/api/promotion/*` | promotion |
| `/api/reservation/create` | checkout |
| `/api/reservations/*` | checkout |
| `/api/search` | booking |
| `/api/special-offers` | cms |
| `/api/vehicle/*` | booking |
| `/api/voucher/*`, `/api/vouchers/*`, `/api/voucher-order/*`, `/api/voucher-benefits` | voucher |

> Needs product/domain confirmation: whether `PromotionProvider` should wrap only promo-heavy routes instead of all site pages.
