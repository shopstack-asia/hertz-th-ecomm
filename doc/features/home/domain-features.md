# Domain features — home

## Page composition

`page.tsx` renders a stack of home sections in a fixed order (hero → **members loyalty banner** → **explore locations** → **exclusive partner offers** → **products and services banner** → **corporate car rental services banner** → booking bar → offers → categories → fuel types → vouchers → featured vehicles → why choose → testimonials → app download). Each block is a separate component; **Explore locations** owns the `explore-locations-bg.webp` decorative layer inside its section.

Site-wide, `max-w-container` is configured as **full viewport width** (no fixed pixel cap); components still use horizontal padding (typically `px-12`, with slightly tighter gutters on narrow breakpoints where noted) so content does not touch the screen edges.

## Booking entry

`StickyBookingBar` provides persistent booking access from the home page (implementation details live in **booking** components path).

## Data fetching

The home route is a **Server Component**: it calls `getWebsiteConfig()` and passes resolved slices of `site.home_page` into section components.

### Hero background carousel

- Source: `CmsSitePublic.home_page` — first enabled block with `block_type === "CAROUSEL"` and `code === "HERO_SECTION"` (local mock: `src/lib/mock/heroSection.ts`, wired from `getMockWebsiteConfig` in `src/lib/cms/site-config.ts`).
- Slide image URL: `items[].image[0]` when a non-empty string; when `null` or missing, the storefront uses `/images/home/hero-slide-1.webp` … `hero-slide-3.webp` in item order.
- Timing: `config.config.auto_play` and `config.config.interval_ms` (defaults apply when the block is missing).
- Static assets: commit hero images under `public/images/home/` so `/images/home/*` is served by Next.js with no install-time copy step.
- The in-hero “search availability” panel (`home.hero.search_availability` + `BookingForm`) is capped at **1280px** width, centered (`mx-auto w-full max-w-[1280px]`) inside the full-width hero content column. The **headline stack** (`headline_explore` / `headline_country` / `tagline`) stays **left-aligned** (`items-start`) but sits in a **`flex-1` column with `justify-content: center`** so it is **vertically centered** in the space below the search panel, matching the reference hero layout.

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
- Section background: `explore-locations-bg.webp` is rendered inside `ExploreLocationsSection` (gradient overlay on top). There is **no bottom border** on this section so the transition into **Exclusive partner offers** stays seamless (avoids a light hairline on the dark stack).
- Performance: same-origin tiles use `next/image` with **moderate `sizes`** (capped desktop selection), **`quality` ~82**, and lazy decode so ten tiles do not each pull full-resolution assets (avoids scroll jank). Absolute URLs fall back to `<img loading="lazy" fetchPriority="low">`. Desktop **12×6** grid as above. Hover/focus: inset `ring` + light scale / overlays with `motion-safe` / `motion-reduce` where appropriate.

### Exclusive partner offers (carousel)

- Source: `CmsSitePublic.home_page` — enabled block with `block_type === "CAROUSEL"` and `code === "EXCLUSIVE_OFFERS"` (local mock: `src/lib/mock/exclusiveOffersSection.ts`).
- Resolver: `resolveHomeExclusiveOffers` in `src/lib/cms/websiteHomeExclusiveOffers.ts` → `ExclusiveOffersSection`.
- Items: `config.config.items[]` with `link`, `uid`, **`title`** (card heading), **`subtitle`** (card body), optional **`cta.label`** (per-card CTA row), and **`image[]`** (first usable URL required — items without a usable image are omitted).
- Section heading: `config.config.section_title` or `config.config.title` when non-empty; otherwise i18n `home.exclusive_offers.section_title`. Optional `section_subtitle` / `subtitle` at block level for a line under the heading.
- Empty `items[].title` / `items[].subtitle`: storefront falls back to i18n `home.exclusive_offers.card_heading` / `home.exclusive_offers.card_description`.
- CTA row label: `items[].cta.label`, else `config.config.cta.label`, else i18n `home.exclusive_offers.learn_more`. Each card links to `items[].link`.
- Timing: `config.config.auto_play` and `config.config.interval_ms` (same bounds as hero). With `prefers-reduced-motion: reduce`, auto-advance is disabled.
- Layout: responsive paged carousel (1 / 2 / 4 cards per page) with dot pagination for **pages**, not per item (no header **Previous / Next** controls). Slides use a horizontal **`translate3d`** strip (`transition-transform` ~500ms; disabled when `prefers-reduced-motion: reduce`). Forward wrap is **seamless**: an extra duplicate of the first page follows the last so the track always advances in the same direction, then the index snaps back to the real first slide without animation after `transitionend` on the track only (`target === currentTarget` so card transitions do not fire the snap), or in `useLayoutEffect` when reduced motion. **Keyboard** (← / →) and **touch swipe** still advance by page when `pageCount > 1`. Auto-advance uses `interval_ms` and pauses when the document is hidden (`visibilitychange`); it is not paused on hover.
- **Card chrome:** each item is a **stack of two sibling panels** inside the same `<Link>` (same width), with a **vertical gap** (`gap-3`) between them — no stroked “button” border on the CTA. **Top panel:** light gray (`#E8E8E8`), `rounded-2xl`, even padding (`p-4` / `sm:p-5`), subtle `border-black/10`, drop shadow; square image with **inner** `rounded-xl`; heading + body **left-aligned**. **Bottom panel:** same gray, radius, border, and shadow; single line **LEARN MORE →** in bold uppercase black — shape comes only from background + rounding, matching the reference layout.
- **Card type:** CMS title line uses **`font-black` + `uppercase`** (~`text-sm` / `15px` from `sm`); body copy **`font-normal`** slightly below heading size; CTA line **`font-black` + `uppercase`**, one step larger on `sm` (`text-base`) so it reads like the reference emphasis.
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
