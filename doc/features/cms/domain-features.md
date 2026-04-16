# Domain features — cms

## Page by slug (`/api/cms/pages/[slug]`)

Loads `getCmsPageBySlug(slug, locale)` from mock CMS store. Returns **404** `{ error: "Page not found" }` when missing, and **404** `{ error: "Page not published" }` when `is_published` is false. Success returns full page JSON for the storefront.

## Special offers list (`/api/special-offers`)

Returns localized offers from `getSpecialOffers(locale)` with filtering:

- Default removes inactive or date-expired offers unless `is_active=false` query allows.
- Optional `promotion_type`, `is_member_only=true`, etc.

## Site config helper (`site-config.ts`)

Documents alignment intent with upstream CMS schema; provides mock `CmsSitePublic` for `HERTZ_WEBSITE` code, origin normalization, and short-lived in-memory cache (TTL constant in file).

> Needs product/domain confirmation: when real CMS client replaces mocks, which fields remain mandatory for header/footer.

## Edge cases

- Special offers expiration compares `valid_to` string to today’s ISO date (`YYYY-MM-DD` slice).
