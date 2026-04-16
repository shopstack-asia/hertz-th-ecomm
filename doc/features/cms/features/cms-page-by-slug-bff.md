# CMS page by slug BFF

## Purpose

Expose a **single CMS page document** for a slug with locale-aware content selection and a published flag gate.

## Related files (src/ paths only, no imports dump)

- `src/app/api/cms/pages/[slug]/route.ts`
- `src/lib/mock/cmsPages.ts` (via `getCmsPageBySlug`)

## Business logic (plain language rules)

- Resolve `slug` from path params.
- Resolve `locale` from `getLocaleFromRequest`.
- Return 404 JSON when page missing or unpublished.

## Conditions / branches

- Unpublished is treated same as not found for the client (404).

## Validation rules (if any)

- None in handler beyond JSON serialization.

## API contracts (route path, main request fields, success/error response shape)

- **Route:** `GET /api/cms/pages/{slug}`
- **Response:** Page JSON from mock or `{ error }` with 404.

## User flow / steps (if multi-step)

1. Editorial route loads slug server/client-side → fetch BFF → render blocks from payload.

## Edge cases (only what code confirms)

- Mock store defines which slugs exist per locale.

## Required tests (behaviors that must stay covered)

- Published vs unpublished branching.
- Locale propagation into mock lookup.
