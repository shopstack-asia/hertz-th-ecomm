const FALLBACK_BACKGROUND = "/images/home/members-loyalty-program-section.webp";
const DEFAULT_CTA_HREF = "/rewards";

export type MembersLoyaltyProgramSectionResolved = {
  backgroundImageSrc: string;
  backgroundAlt: string;
  /** Single storefront destination from `config.config.link` (creative may embed copy/buttons in the image). */
  ctaHref: string;
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

function firstBannerImageUrl(inner: Record<string, unknown>): string | null {
  const images = inner.image;
  if (!Array.isArray(images) || images.length === 0) return null;
  const first = images[0];
  if (typeof first === "string" && first.trim()) return first.trim();
  if (first && typeof first === "object") {
    const o = first as Record<string, unknown>;
    for (const key of ["url", "src", "path", "publicUrl"] as const) {
      const v = o[key];
      if (typeof v === "string" && v.trim()) return v.trim();
    }
  }
  return null;
}

const DEFAULT_RESOLVED: MembersLoyaltyProgramSectionResolved = {
  backgroundImageSrc: FALLBACK_BACKGROUND,
  backgroundAlt: "",
  ctaHref: DEFAULT_CTA_HREF,
};

/**
 * Resolves the home Members Loyalty Program banner from `CmsSitePublic.home_page`
 * (`block_type` BANNER, `code` MEMBERS_LOYALTY_PROGRAM_SECTION).
 */
export function resolveMembersLoyaltyProgramSection(
  homePage: unknown
): MembersLoyaltyProgramSectionResolved {
  const blocks = normalizeHomeBlocks(homePage);
  const block = blocks.find((b) => {
    if (!b || typeof b !== "object") return false;
    const o = b as Record<string, unknown>;
    return (
      o.block_type === "BANNER" &&
      o.code === "MEMBERS_LOYALTY_PROGRAM_SECTION" &&
      o.enabled !== false
    );
  }) as Record<string, unknown> | undefined;

  if (!block) {
    return DEFAULT_RESOLVED;
  }

  const inner = extractInnerConfig(block);
  if (!inner) {
    return DEFAULT_RESOLVED;
  }

  const fromConfig = firstBannerImageUrl(inner);
  const link =
    typeof inner.link === "string" && inner.link.trim() ? inner.link.trim() : DEFAULT_CTA_HREF;
  const alt =
    typeof inner.alt === "string" && inner.alt.trim()
      ? inner.alt.trim()
      : typeof inner.section_title === "string" && inner.section_title.trim()
        ? inner.section_title.trim()
        : "";

  return {
    backgroundImageSrc: fromConfig ?? FALLBACK_BACKGROUND,
    backgroundAlt: alt,
    ctaHref: link,
  };
}
