# Domain features — home

## Page composition

`page.tsx` renders a stack of home sections in a fixed order (hero → **members loyalty banner** → **explore locations** → booking bar → offers → categories → fuel types → vouchers → featured vehicles → why choose → testimonials → app download). Each block is a separate component; **Explore locations** owns the `explore-locations-bg.webp` decorative layer inside its section.

## Booking entry

`StickyBookingBar` provides persistent booking access from the home page (implementation details live in **booking** components path).

## Data fetching

The home route is a **Server Component**: it calls `getWebsiteConfig()` and passes resolved slices of `site.home_page` into section components.

### Hero background carousel

- Source: `CmsSitePublic.home_page` — first enabled block with `block_type === "CAROUSEL"` (local mock: `src/lib/mock/heroSection.ts`, wired from `getMockWebsiteConfig` in `src/lib/cms/site-config.ts`).
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

## Edge cases

- If `prefers-reduced-motion: reduce`, the hero does not auto-advance slides (first slide stays visible).
