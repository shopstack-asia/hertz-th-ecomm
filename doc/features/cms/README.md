# CMS — hertz-th-ecomm

## Purpose

**Editorial and marketing pages** driven by mock CMS page JSON (by slug) and **site-wide config** typing/helpers, plus **special offers** listing BFF used by home and offers surfaces.

## Scope

- **Belongs here:** `(site)/products-services`, `(site)/drivers`, `(site)/special-offers`, `(site)/vehicle-guide`, `src/components/cms/`, `src/components/special-offers/`, `src/app/api/cms/*`, `src/app/api/special-offers/route.ts`, `src/lib/cms/site-config.ts` and related `src/lib/cms/*`.
- **Does not belong here:** Vehicle catalog pricing (**booking** / **checkout**). Account profile CMS (**account** — none today).

## Reading order

1. `domain-features.md`
2. `feature-logic-summary.md`
3. `features/cms-page-by-slug-bff.md`

## Code paths

- `src/app/(site)/products-services/`
- `src/app/(site)/drivers/`
- `src/app/(site)/special-offers/`
- `src/app/(site)/vehicle-guide/`
- `src/components/cms/`
- `src/components/special-offers/`
- `src/app/api/cms/pages/[slug]/route.ts`
- `src/app/api/special-offers/route.ts`
- `src/lib/cms/site-config.ts`
