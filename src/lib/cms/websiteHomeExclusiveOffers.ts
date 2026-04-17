const DEFAULT_LINK = "/vouchers";

export type ExclusiveOfferCard = {
  uid: string;
  imageSrc: string;
  href: string;
  imageAlt: string;
  /** `items[].title` — card heading (middle block). */
  cardTitle: string;
  /** `items[].subtitle` — card body copy. */
  cardDescription: string | null;
  /** `items[].cta.label` when set. */
  itemCtaLabel: string | null;
};

export type HomeExclusiveOffersResolved = {
  sectionTitle: string | null;
  sectionSubtitle: string | null;
  items: ExclusiveOfferCard[];
  autoPlay: boolean;
  intervalMs: number;
  /** Non-empty CMS `cta.label` overrides storefront “Learn more” label. */
  ctaLabel: string | null;
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

function trimOrNull(v: unknown): string | null {
  if (typeof v !== "string") return null;
  const t = v.trim();
  return t ? t : null;
}

function parseCtaLabel(inner: Record<string, unknown>): string | null {
  const cta = inner.cta;
  if (!cta || typeof cta !== "object") return null;
  const label = trimOrNull((cta as Record<string, unknown>).label);
  return label;
}

function parseItemCtaLabel(o: Record<string, unknown>): string | null {
  const cta = o.cta;
  if (!cta || typeof cta !== "object") return null;
  return trimOrNull((cta as Record<string, unknown>).label);
}

function parseItems(inner: Record<string, unknown>, sectionAlt: string): ExclusiveOfferCard[] {
  const rawItems = inner.items;
  if (!Array.isArray(rawItems) || rawItems.length === 0) return [];

  const out: ExclusiveOfferCard[] = [];
  rawItems.forEach((raw, index) => {
    if (!raw || typeof raw !== "object") return;
    const o = raw as Record<string, unknown>;
    const uid =
      typeof o.uid === "string" && o.uid.trim() ? o.uid.trim() : `exclusive-offer-${index}`;
    const title = typeof o.title === "string" ? o.title.trim() : "";
    const href =
      typeof o.link === "string" && o.link.trim() ? o.link.trim() : DEFAULT_LINK;
    const imageSrc = firstItemImageUrl(o.image);
    if (!imageSrc) return;
    const cardDescription = trimOrNull(o.subtitle);
    const itemCtaLabel = parseItemCtaLabel(o);
    const imageAlt =
      [sectionAlt, title, cardDescription].filter(Boolean).join(" — ") ||
      `Partner offer ${index + 1}`;
    out.push({
      uid,
      imageSrc,
      href,
      imageAlt,
      cardTitle: title,
      cardDescription,
      itemCtaLabel,
    });
  });
  return out;
}

const EMPTY: HomeExclusiveOffersResolved = {
  sectionTitle: null,
  sectionSubtitle: null,
  items: [],
  autoPlay: true,
  intervalMs: 3000,
  ctaLabel: null,
};

/**
 * Resolves home “Exclusive offers” partner carousel from `CmsSitePublic.home_page`
 * (`block_type` CAROUSEL, `code` EXCLUSIVE_OFFERS).
 *
 * Copy: `items[].title` (heading), `items[].subtitle` (body). CTA label: `items[].cta.label`, else block `config.config.cta.label`, else i18n.
 * Image: first usable `items[].image[0]` only (required for the card to appear).
 */
export function resolveHomeExclusiveOffers(homePage: unknown): HomeExclusiveOffersResolved {
  const blocks = normalizeHomeBlocks(homePage);
  const block = blocks.find((b) => {
    if (!b || typeof b !== "object") return false;
    const o = b as Record<string, unknown>;
    return (
      o.block_type === "CAROUSEL" &&
      o.code === "EXCLUSIVE_OFFERS" &&
      o.enabled !== false
    );
  }) as Record<string, unknown> | undefined;

  if (!block) {
    return EMPTY;
  }

  const inner = extractInnerConfig(block);
  if (!inner) {
    return EMPTY;
  }

  const sectionAlt = typeof inner.alt === "string" ? inner.alt.trim() : "";
  const items = parseItems(inner, sectionAlt);
  if (items.length === 0) {
    return EMPTY;
  }

  const autoPlay = inner.auto_play !== false;
  const rawInterval = inner.interval_ms;
  const intervalMs =
    typeof rawInterval === "number" && Number.isFinite(rawInterval) && rawInterval >= 1000
      ? Math.min(rawInterval, 60_000)
      : EMPTY.intervalMs;

  const sectionTitle =
    trimOrNull(inner.section_title) ?? trimOrNull(inner.title) ?? null;
  const sectionSubtitle =
    trimOrNull(inner.section_subtitle) ?? trimOrNull(inner.subtitle) ?? null;

  return {
    sectionTitle,
    sectionSubtitle,
    items,
    autoPlay,
    intervalMs,
    ctaLabel: parseCtaLabel(inner),
  };
}
