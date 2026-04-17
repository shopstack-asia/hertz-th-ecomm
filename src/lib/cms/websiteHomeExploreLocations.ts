const FALLBACK_IMAGE_DIR = "/images/explore_locations";
const DEFAULT_CONTACT_HREF = "/locations";

export type ExploreLocationTile = {
  uid: string;
  imageSrc: string;
  href: string;
  title: string;
  imageAlt: string;
};

export type ExploreLocationsSectionResolved = {
  sectionTitle: string | null;
  sectionSubtitle: string | null;
  tiles: ExploreLocationTile[];
  contactCtaHref: string;
  /** When set (non-empty CMS `cta.label`), storefront uses this instead of i18n. */
  contactCtaLabel: string | null;
};

function normalizeHomeBlocks(homePage: unknown): unknown[] {
  if (Array.isArray(homePage)) return homePage;
  if (homePage && typeof homePage === "object") {
    const o = homePage as Record<string, unknown>;
    if (Array.isArray(o.blocks)) return o.blocks;
    if (typeof o.block_type === "string") return [homePage];
  }
  return [];
}

function extractInnerConfig(block: Record<string, unknown>): Record<string, unknown> | null {
  const c = block.config;
  if (!c || typeof c !== "object") return null;
  const outer = c as Record<string, unknown>;
  const inner = outer.config;
  if (inner && typeof inner === "object") return inner as Record<string, unknown>;
  return outer;
}

function firstItemImageUrl(images: unknown): string | null {
  if (!Array.isArray(images) || images.length === 0) return null;
  const first = images[0];
  if (first === null || first === undefined) return null;
  if (typeof first === "string" && first.trim()) return first.trim();
  if (typeof first === "object") {
    const o = first as Record<string, unknown>;
    for (const key of ["url", "src", "path", "publicUrl"] as const) {
      const v = o[key];
      if (typeof v === "string" && v.trim()) return v.trim();
    }
  }
  return null;
}

function fallbackImageForIndex(index: number): string {
  const n = (index % 10) + 1;
  return `${FALLBACK_IMAGE_DIR}/explore-locations-${n}.webp`;
}

function parseCta(inner: Record<string, unknown>): { href: string; label: string | null } {
  const cta = inner.cta;
  if (!cta || typeof cta !== "object") {
    return { href: DEFAULT_CONTACT_HREF, label: null };
  }
  const o = cta as Record<string, unknown>;
  const href =
    typeof o.link === "string" && o.link.trim() ? o.link.trim() : DEFAULT_CONTACT_HREF;
  const label = typeof o.label === "string" && o.label.trim() ? o.label.trim() : null;
  return { href, label };
}

function trimOrNull(v: unknown): string | null {
  if (typeof v !== "string") return null;
  const t = v.trim();
  return t ? t : null;
}

function parseTiles(inner: Record<string, unknown>): ExploreLocationTile[] {
  const items = inner.items;
  if (!Array.isArray(items) || items.length === 0) return [];

  return items.map((raw, index) => {
    if (!raw || typeof raw !== "object") {
      return {
        uid: `explore-fallback-${index}`,
        imageSrc: fallbackImageForIndex(index),
        href: "/search",
        title: "",
        imageAlt: "",
      };
    }
    const o = raw as Record<string, unknown>;
    const uid = typeof o.uid === "string" && o.uid.trim() ? o.uid.trim() : `explore-${index}`;
    const href = typeof o.link === "string" && o.link.trim() ? o.link.trim() : "/search";
    const title = typeof o.title === "string" ? o.title : "";
    const imageSrc = firstItemImageUrl(o.image) ?? fallbackImageForIndex(index);
    const imageAlt = title || `Location ${index + 1}`;
    return { uid, imageSrc, href, title, imageAlt };
  });
}

const EMPTY_RESOLVED: ExploreLocationsSectionResolved = {
  sectionTitle: null,
  sectionSubtitle: null,
  tiles: [],
  contactCtaHref: DEFAULT_CONTACT_HREF,
  contactCtaLabel: null,
};

/**
 * Resolves the home “Explore locations” masonry from `CmsSitePublic.home_page`
 * (`block_type` CARD_LIST, `code` EXPLORE_LOCATIONS).
 */
export function resolveExploreLocationsSection(
  homePage: unknown
): ExploreLocationsSectionResolved {
  const blocks = normalizeHomeBlocks(homePage);
  const block = blocks.find((b) => {
    if (!b || typeof b !== "object") return false;
    const o = b as Record<string, unknown>;
    return (
      o.block_type === "CARD_LIST" &&
      o.code === "EXPLORE_LOCATIONS" &&
      o.enabled !== false
    );
  }) as Record<string, unknown> | undefined;

  if (!block) {
    return EMPTY_RESOLVED;
  }

  const inner = extractInnerConfig(block);
  if (!inner) {
    return EMPTY_RESOLVED;
  }

  const tiles = parseTiles(inner);
  const { href: contactCtaHref, label: contactCtaLabel } = parseCta(inner);

  const sectionTitle =
    trimOrNull(inner.section_title) ??
    trimOrNull(inner.title) ??
    null;
  const sectionSubtitle =
    trimOrNull(inner.section_subtitle) ?? trimOrNull(inner.subtitle) ?? null;

  return {
    sectionTitle,
    sectionSubtitle,
    tiles,
    contactCtaHref,
    contactCtaLabel,
  };
}
