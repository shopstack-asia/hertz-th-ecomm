import { getWebsiteConfig, toPublicSiteOrigin } from "@/lib/cms/site-config";

const DEFAULT_CHANGEFREQ = "weekly";
const DEFAULT_PRIORITY = 0.7;

// --- Mock data sources (replace with API calls later) ------------------------------------------

type MockCmsPage = {
  path: string;
  seo: {
    index?: boolean;
    priority?: number;
    changefreq?: string;
  };
};

function getMockCmsPages(): MockCmsPage[] {
  return [
    {
      path: "/",
      seo: { index: true, priority: 1.0, changefreq: "daily" },
    },
    {
      path: "/promotions",
      seo: { index: true, priority: 0.8 },
    },
    {
      path: "/about",
      seo: { index: true },
    },
    {
      path: "/hidden-page",
      seo: { index: false },
    },
  ];
}

function getMockProducts() {
  return [{ slug: "toyota-yaris" }, { slug: "honda-city" }];
}

function getMockCategories() {
  return [{ slug: "economy" }, { slug: "suv" }];
}

function getStaticPages() {
  return ["/contact", "/terms", "/privacy"];
}

// --- URL specs per source (swap mock callers for real APIs) ------------------------------------

type SitemapUrlSpec = {
  path: string;
  changefreq: string;
  priority: number;
};

function getCmsUrlSpecs(): SitemapUrlSpec[] {
  return getMockCmsPages()
    .filter((p) => p.seo.index !== false)
    .map((p) => ({
      path: p.path,
      changefreq: p.seo.changefreq ?? DEFAULT_CHANGEFREQ,
      priority: p.seo.priority ?? DEFAULT_PRIORITY,
    }));
}

function getProductUrlSpecs(): SitemapUrlSpec[] {
  return getMockProducts().map((product) => ({
    path: `/cars/${product.slug}`,
    changefreq: DEFAULT_CHANGEFREQ,
    priority: DEFAULT_PRIORITY,
  }));
}

function getCategoryUrlSpecs(): SitemapUrlSpec[] {
  return getMockCategories().map((category) => ({
    path: `/cars/${category.slug}`,
    changefreq: DEFAULT_CHANGEFREQ,
    priority: DEFAULT_PRIORITY,
  }));
}

function getStaticUrlSpecs(): SitemapUrlSpec[] {
  return getStaticPages().map((path) => ({
    path,
    changefreq: DEFAULT_CHANGEFREQ,
    priority: DEFAULT_PRIORITY,
  }));
}

// --- XML building -------------------------------------------------------------------------------

function escapeXml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function toAbsolutePath(path: string): string {
  return path.startsWith("/") ? path : `/${path}`;
}

function toLoc(path: string, publicOrigin: string): string {
  return `${publicOrigin}${toAbsolutePath(path)}`;
}

function buildUrlXmlFragment(
  opts: {
    path: string;
    changefreq: string;
    priority: number;
    lastmod: string;
  },
  publicOrigin: string,
): string {
  const loc = toLoc(opts.path, publicOrigin);
  return [
    "<url>",
    `  <loc>${escapeXml(loc)}</loc>`,
    `  <lastmod>${escapeXml(opts.lastmod)}</lastmod>`,
    `  <changefreq>${escapeXml(opts.changefreq)}</changefreq>`,
    `  <priority>${opts.priority}</priority>`,
    "</url>",
  ].join("\n");
}

function mergeAllUrlSpecsSorted(publicOrigin: string): SitemapUrlSpec[] {
  return [
    ...getCmsUrlSpecs(),
    ...getProductUrlSpecs(),
    ...getCategoryUrlSpecs(),
    ...getStaticUrlSpecs(),
  ].sort((a, b) =>
    toLoc(a.path, publicOrigin).localeCompare(toLoc(b.path, publicOrigin)),
  );
}

function buildSitemapXml(innerUrlBlocks: string): string {
  const header = '<?xml version="1.0" encoding="UTF-8"?>';
  const open =
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';
  const close = "</urlset>";
  return [header, open, innerUrlBlocks, close].join("\n");
}

export async function GET(): Promise<Response> {
  const site = await getWebsiteConfig();
  const publicOrigin = toPublicSiteOrigin(site);

  const lastmod = new Date().toISOString();

  const inner = mergeAllUrlSpecsSorted(publicOrigin)
    .map((spec) => buildUrlXmlFragment({ ...spec, lastmod }, publicOrigin))
    .join("\n");

  const xml = buildSitemapXml(inner);

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
    },
  });
}
