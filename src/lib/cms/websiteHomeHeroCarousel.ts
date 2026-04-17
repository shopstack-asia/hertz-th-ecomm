export type HomeHeroSlide = { src: string; alt: string };

export type HomeHeroCarouselResolved = {
  slides: HomeHeroSlide[];
  autoPlay: boolean;
  intervalMs: number;
};

const MOCK_FALLBACK_BASE = "/images/home";
const MOCK_FALLBACK_FILES = [
  "hero-slide-1.webp",
  "hero-slide-2.webp",
  "hero-slide-3.webp",
] as const;

function firstImageUrl(images: unknown): string | null {
  if (!Array.isArray(images) || images.length === 0) return null;
  const v = images[0];
  return typeof v === "string" && v.trim() ? v.trim() : null;
}

/** CMS payload nests carousel fields under `config.config`. */
function extractCarouselInnerConfig(block: Record<string, unknown>): Record<string, unknown> | null {
  const c = block.config;
  if (!c || typeof c !== "object") return null;
  const outer = c as Record<string, unknown>;
  const inner = outer.config;
  if (inner && typeof inner === "object") return inner as Record<string, unknown>;
  return outer;
}

function normalizeHomeBlocks(homePage: unknown): unknown[] {
  if (Array.isArray(homePage)) return homePage;
  if (homePage && typeof homePage === "object") {
    const o = homePage as Record<string, unknown>;
    if (Array.isArray(o.blocks)) return o.blocks;
    if (typeof o.block_type === "string") return [homePage];
  }
  return [];
}

const DEFAULT_RESOLVED: HomeHeroCarouselResolved = {
  slides: MOCK_FALLBACK_FILES.map((f, i) => ({
    src: `${MOCK_FALLBACK_BASE}/${f}`,
    alt: `Hero background ${i + 1}`,
  })),
  autoPlay: true,
  intervalMs: 3000,
};

/**
 * Resolves home hero background slides from `CmsSitePublic.home_page` carousel block.
 * When `items[].image[0]` is null or missing, uses `/images/home/hero-slide-{n}.webp`.
 */
export function resolveHomeHeroCarousel(homePage: unknown): HomeHeroCarouselResolved {
  const blocks = normalizeHomeBlocks(homePage);
  const block = blocks.find((b) => {
    if (!b || typeof b !== "object") return false;
    const o = b as Record<string, unknown>;
    return o.block_type === "CAROUSEL" && o.enabled !== false;
  }) as Record<string, unknown> | undefined;

  if (!block) {
    return DEFAULT_RESOLVED;
  }

  const inner = extractCarouselInnerConfig(block);
  if (!inner) {
    return DEFAULT_RESOLVED;
  }

  const items = inner.items;
  if (!Array.isArray(items) || items.length === 0) {
    return DEFAULT_RESOLVED;
  }

  const autoPlay = inner.auto_play !== false;
  const rawInterval = inner.interval_ms;
  const intervalMs =
    typeof rawInterval === "number" && Number.isFinite(rawInterval) && rawInterval >= 1000
      ? Math.min(rawInterval, 60_000)
      : DEFAULT_RESOLVED.intervalMs;

  const sectionAlt = typeof inner.alt === "string" ? inner.alt.trim() : "";

  const slides: HomeHeroSlide[] = items.map((it, index) => {
    const row = it as Record<string, unknown>;
    const fromConfig = firstImageUrl(row.image);
    const fallbackFile = MOCK_FALLBACK_FILES[index % MOCK_FALLBACK_FILES.length];
    const src = fromConfig ?? `${MOCK_FALLBACK_BASE}/${fallbackFile}`;
    const title = typeof row.title === "string" ? row.title.trim() : "";
    const alt =
      [sectionAlt, title].filter(Boolean).join(" — ") || `Hero background ${index + 1}`;
    return { src, alt };
  });

  return { slides, autoPlay, intervalMs };
}
