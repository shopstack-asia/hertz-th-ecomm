# Domain features — home

## Page composition

`page.tsx` renders a stack of home sections in a fixed order (hero → **members loyalty banner** → **explore locations** → **exclusive partner offers** → **products and services banner** → **corporate car rental services banner** → booking bar → offers → categories → fuel types → vouchers → featured vehicles → why choose → testimonials → app download). Each block is a separate component; **Explore locations** owns the `explore-locations-bg.webp` decorative layer inside its section.

## Booking entry

`StickyBookingBar` provides persistent booking access from the home page (implementation details live in **booking** components path).

## Data fetching

The home route is a **Server Component**: it calls `getWebsiteConfig()` and passes resolved slices of `site.home_page` into section components.

### Hero background carousel

- Source: `CmsSitePublic.home_page` — first enabled block with `block_type === "CAROUSEL"` and `code === "HERO_SECTION"` (local mock: `src/lib/mock/heroSection.ts`, wired from `getMockWebsiteConfig` in `src/lib/cms/site-config.ts`).
- Slide image URL: `items[].image[0]` when a non-empty string; when `null` or missing, the storefront uses `/images/home/hero-slide-1.webp` … `hero-slide-3.webp` in item order.
- Timing: `config.config.auto_play` and `config.config.interval_ms` (defaults apply when the block is missing).
- Static assets: commit hero images under `public/images/home/` so `/images/home/*` is served by Next.js with no install-time copy step.

### Members Loyalty Program banner

- Source: `CmsSitePublic.home_page` — enabled block with `block_type === "BANNER"` and `code === "MEMBERS_LOYALTY_PROGRAM_SECTION"` (local mock: `src/lib/mock/membersLoyaltyProgramSection.ts`).
- Resolver: `resolveMembersLoyaltyProgramSection` in `src/lib/cms/websiteHomeMembersLoyalty.ts` → `MembersLoyaltyProgramSection`.
- Background image: first usable URL in `config.config.image[]` (`url` / `src` / string entry); otherwise `/images/home/members-loyalty-program-section.webp`.
- CTA href: `config.config.link` (mock: `/rewards`). The storefront wraps the **full-width image** in one `<Link>` (creative may embed headline, faux buttons, and benefit row in the asset).
- Fallback when the block or `link` is absent: `/rewards`. Optional `alt` / `section_title` feeds the `<img alt>`.

### Explore locations (Thailand bento)

- Source: `CmsSitePublic.home_page` — enabled block with `block_type === "CARD_LIST"` and `code === "EXPLORE_LOCATIONS"` (local mock: `src/lib/mock/exploreLocationsSection.ts`).
- Resolver: `resolveExploreLocationsSection` in `src/lib/cms/websiteHomeExploreLocations.ts` → `ExploreLocationsSection`.
- Tiles: `config.config.items[]` with `link`, `title`, `uid`, and `image[]` (first usable URL; when `null` / missing, `/images/explore_locations/explore-locations-{n}.webp` by item index, `n` cycling 1–10).
- Section heading: `config.config.section_title` or `config.config.title` when non-empty; otherwise i18n `home.explore_locations.title`. Optional `section_subtitle` / `subtitle` only.
- Per-tile primary action: `items[].link` (e.g. `/search?pickup=…`). Secondary **Contact** control: `config.config.cta.link` (default `/locations`) and optional `cta.label` (otherwise i18n `home.explore_locations.contact`).
- Section background: `explore-locations-bg.webp` is rendered inside `ExploreLocationsSection` (gradient overlay on top).
- Performance: same-origin tiles use `next/image` with **moderate `sizes`** (capped desktop selection), **`quality` ~82**, and lazy decode so ten tiles do not each pull full-resolution assets (avoids scroll jank). Absolute URLs fall back to `<img loading="lazy" fetchPriority="low">`. Desktop **12×6** grid as above. Hover/focus: inset `ring` + light scale / overlays with `motion-safe` / `motion-reduce` where appropriate.

### Exclusive partner offers (carousel)

- Source: `CmsSitePublic.home_page` — enabled block with `block_type === "CAROUSEL"` and `code === "EXCLUSIVE_OFFERS"` (local mock: `src/lib/mock/exclusiveOffersSection.ts`).
- Resolver: `resolveHomeExclusiveOffers` in `src/lib/cms/websiteHomeExclusiveOffers.ts` → `ExclusiveOffersSection`.
- Items: `config.config.items[]` with `link`, `uid`, **`title`** (card heading), **`subtitle`** (card body), optional **`cta.label`** (per-card CTA row), and **`image[]`** (first usable URL required — items without a usable image are omitted).
- Section heading: `config.config.section_title` or `config.config.title` when non-empty; otherwise i18n `home.exclusive_offers.section_title`. Optional `section_subtitle` / `subtitle` at block level for a line under the heading.
- Empty `items[].title` / `items[].subtitle`: storefront falls back to i18n `home.exclusive_offers.card_heading` / `home.exclusive_offers.card_description`.
- CTA row label: `items[].cta.label`, else `config.config.cta.label`, else i18n `home.exclusive_offers.learn_more`. Each card links to `items[].link`.
- Timing: `config.config.auto_play` and `config.config.interval_ms` (same bounds as hero). With `prefers-reduced-motion: reduce`, auto-advance is disabled.
- Layout: responsive paged carousel (1 / 2 / 4 cards per page) with dot pagination for **pages**, not per item. Slides use a horizontal **`translate3d`** strip (`transition-transform` ~500ms; disabled when `prefers-reduced-motion: reduce`). Forward wrap is **seamless**: an extra duplicate of the first page follows the last so the track always advances in the same direction, then the index snaps back to the real first slide without animation after `transitionend` on the track only (`target === currentTarget` so card transitions do not fire the snap), or in `useLayoutEffect` when reduced motion. **Previous / Next** advance by page. Auto-advance uses `interval_ms` and pauses when the document is hidden (`visibilitychange`); it is not paused on hover.
- Section background: `exclusive-offers-bg.webp` under `public/images/exclusive_offers/` is rendered full-bleed behind the section (gradient overlays for contrast), same idea as Explore locations’ in-section background asset.

### Products and services banner

- Source: `CmsSitePublic.home_page` — enabled block with `block_type === "BANNER"` and `code === "PRODUCTS_AND_SERVICES"` (local mock: `src/lib/mock/productsAndServicesSection.ts`).
- Resolver: `resolveProductsAndServicesSection` in `src/lib/cms/websiteHomeProductsAndServices.ts` → `ProductsAndServicesSection`.
- Background image: first usable URL in `config.config.image[]` (same rules as Members loyalty); otherwise `/images/home/products-and-services.webp`.
- CTA href: `config.config.link` (mock: `/vouchers`). The storefront wraps the **full-width image** in one `<Link>`.
- Fallback when the block or `link` is absent: `/vouchers`. Optional `alt` / `section_title` feeds `<img alt>`; otherwise i18n `home.products_services.banner_aria`.

### Corporate car rental services banner

- Source: `CmsSitePublic.home_page` — enabled block with `block_type === "BANNER"` and `code === "CORPORATE_CAR_RENTAL_SERVICES"` (local mock: `src/lib/mock/corporateCarRentalServicesSection.ts`).
- Resolver: `resolveCorporateCarRentalServicesSection` in `src/lib/cms/websiteHomeCorporateCarRentalServices.ts` → `CorporateCarRentalServicesSection`.
- Background image: first usable URL in `config.config.image[]`; when `null` or missing, `/images/home/corporate-car-rental-services.webp`.
- CTA href: `config.config.link` (mock: `/vouchers`). Full-width image wrapped in one `<Link>`.
- Fallback when the block or `link` is absent: `/vouchers`. Optional `alt` / `section_title` feeds `<img alt>`; otherwise i18n `home.corporate_car_rental.banner_aria`.

## Edge cases

- If `prefers-reduced-motion: reduce`, the hero does not auto-advance slides (first slide stays visible).
