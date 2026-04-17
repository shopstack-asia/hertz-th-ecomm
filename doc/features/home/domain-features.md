# Domain features — home

## Page composition

`page.tsx` renders a stack of home sections in a fixed order (hero → **members loyalty banner** → booking bar → offers → categories → fuel types → locations → vouchers → featured vehicles → why choose → testimonials → app download). Each section is delegated to a component under `src/components/home/`.

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

## Edge cases

- If `prefers-reduced-motion: reduce`, the hero does not auto-advance slides (first slide stays visible).
