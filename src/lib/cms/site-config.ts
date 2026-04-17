import { env } from "@/lib/config/env";
import { MOCK_HERO_SECTION_CAROUSEL_BLOCKS } from "@/lib/mock/heroSection";
import { MOCK_MEMBERS_LOYALTY_PROGRAM_BANNER_BLOCK } from "@/lib/mock/membersLoyaltyProgramSection";

/**
 * Public website document aligned with cs-core `src/modules/cms/site/site.schema.ts`.
 * Populated from API by `code` (see {@link env.websiteCode}); mock until the client exists.
 */
export type CmsSitePublic = {
  code: string;
  name: string;
  /** Public hostname or full origin; normalized via {@link toPublicSiteOrigin}. */
  domain: string;
  enabled: boolean;
  home_page?: unknown;
  header_layout?: unknown;
  footer_layout?: unknown;
  /** `CmsSiteSettings` in cs-core `cms.type.ts` — kept loose on the storefront. */
  settings?: unknown;
};

type SiteConfigCache = {
  code: string;
  data: CmsSitePublic;
  expiresAt: number;
};

const CACHE_TTL_MS = 60_000;

let cache: SiteConfigCache | null = null;

/** Turn `site.domain` (host or URL) into a canonical origin without trailing slash. */
export function toPublicSiteOrigin(site: CmsSitePublic): string {
  return normalizeDomainToOrigin(site.domain);
}

function normalizeDomainToOrigin(domain: string): string {
  const trimmed = domain.trim().replace(/\/+$/, "");
  if (!trimmed) {
    throw new Error("Site domain is empty");
  }
  const withScheme = /^https?:\/\//i.test(trimmed)
    ? trimmed
    : `https://${trimmed}`;
  return withScheme.replace(/\/+$/, "");
}

function getMockWebsiteConfig(code: string): CmsSitePublic {
  if (code === "HERTZ_WEBSITE") {
    return {
      code: "HERTZ_WEBSITE",
      name: "Hertz Thailand",
      domain: "https://hertz-ecom-dev.vinobe.com",
      enabled: true,
      home_page: [...MOCK_HERO_SECTION_CAROUSEL_BLOCKS, MOCK_MEMBERS_LOYALTY_PROGRAM_BANNER_BLOCK],
      header_layout: undefined,
      footer_layout: undefined,
      settings: mockSiteSettings(),
    };
  }

  return {
    code,
    name: "Unconfigured site",
    domain: "localhost:4100",
    enabled: false,
    settings: undefined,
  };
}

/** Minimal valid `settings` blob for local mock only. */
function mockSiteSettings(): CmsSitePublic["settings"] {
  return {
    branding: {
      logo: { primary: "" },
    },
    localization: {
      default_language: "th",
      supported_languages: ["th", "en"],
    },
  };
}

/**
 * Fetches CMS site by code. Replace with `fetch(env.csApiBaseUrl + ...)` when the route exists.
 */
async function fetchWebsiteConfigFromApi(code: string): Promise<CmsSitePublic> {
  if (!code) {
    throw new Error("WEBSITE_CODE is not set");
  }
  // Use env.csApiBaseUrl for the real HTTP client when the CS endpoint exists.
  return getMockWebsiteConfig(code);
}

/**
 * Cached website config per request cycle: uses memory cache; on miss calls {@link fetchWebsiteConfigFromApi}.
 */
export async function getWebsiteConfig(): Promise<CmsSitePublic> {
  const code = env.websiteCode;
  const now = Date.now();
  if (cache && cache.code === code && cache.expiresAt > now) {
    return cache.data;
  }

  const data = await fetchWebsiteConfigFromApi(code);
  cache = { code, data, expiresAt: now + CACHE_TTL_MS };
  return data;
}
