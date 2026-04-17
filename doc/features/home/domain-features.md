# Domain features — home

## Page composition

`page.tsx` renders a stack of home sections in a fixed order (hero → booking bar → offers → categories → fuel types → locations → vouchers → featured vehicles → why choose → testimonials → app download). Each section is delegated to a component under `src/components/home/`.

## Booking entry

`StickyBookingBar` provides persistent booking access from the home page (implementation details live in **booking** components path).

## Data fetching

The home route is a **Server Component**: it calls `getWebsiteConfig()` and passes `resolveHomeHeroCarousel(site.home_page)` (from `src/lib/cms/websiteHomeHeroCarousel.ts`) into `HeroSection` so the hero background carousel is driven by CMS-shaped mock data on the storefront.

### Hero background carousel

- Source: `CmsSitePublic.home_page` — first enabled block with `block_type === "CAROUSEL"` (local mock: `src/lib/mock/heroSection.ts`, wired from `getMockWebsiteConfig` in `src/lib/cms/site-config.ts`).
- Slide image URL: `items[].image[0]` when a non-empty string; when `null` or missing, the storefront uses `/images/home/hero-slide-1.webp` … `hero-slide-3.webp` in item order.
- Timing: `config.config.auto_play` and `config.config.interval_ms` (defaults apply when the block is missing).
- Static assets: commit hero images under `public/images/home/` so `/images/home/*` is served by Next.js with no install-time copy step.

## Edge cases

- If `prefers-reduced-motion: reduce`, the hero does not auto-advance slides (first slide stays visible).
