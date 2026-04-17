# Feature logic summary — home

| Behavior | Doc file | Notes |
|----------|----------|--------|
| Section stack on `/` | (inline) | `page.tsx` ordering |
| Hero background carousel | [domain-features.md](./domain-features.md) | `getWebsiteConfig` → `resolveHomeHeroCarousel` (`websiteHomeHeroCarousel.ts`) → `HeroSection` |
| Members loyalty banner | [domain-features.md](./domain-features.md) | `resolveMembersLoyaltyProgramSection` (`websiteHomeMembersLoyalty.ts`) → `MembersLoyaltyProgramSection` |
| Explore locations bento | [domain-features.md](./domain-features.md) | `resolveExploreLocationsSection` (`websiteHomeExploreLocations.ts`) → `ExploreLocationsSection` |
| Per-section fetching | (inline) | Inspect each `src/components/home/*` when documenting data dependencies |
