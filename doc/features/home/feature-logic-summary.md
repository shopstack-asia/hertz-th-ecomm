# Feature logic summary — home

| Behavior | Doc file | Notes |
|----------|----------|--------|
| Section stack on `/` | (inline) | `page.tsx` ordering |
| Hero background carousel | [domain-features.md](./domain-features.md) | `getWebsiteConfig` → `resolveHomeHeroCarousel` (`websiteHomeHeroCarousel.ts`) → `HeroSection` |
| Per-section fetching | (inline) | Inspect each `src/components/home/*` when documenting data dependencies |
