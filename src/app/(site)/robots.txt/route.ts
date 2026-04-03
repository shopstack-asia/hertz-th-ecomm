import { getWebsiteConfig, toPublicSiteOrigin } from "@/lib/cms/site-config";

type RobotsEnv = "development" | "production";

type RobotsRule = {
  userAgent: string;
  allow?: string[];
  disallow?: string[];
};

type RobotsConfig = {
  env: RobotsEnv;
  rules: RobotsRule[];
  sitemapPath: string;
};

function getRobotsConfig(): RobotsConfig {
  return {
    env:
      process.env.NODE_ENV === "production" ? "production" : "development",

    rules: [
      {
        userAgent: "*",
        allow: ["/"],
        disallow: ["/admin", "/api"],
      },
    ],

    sitemapPath: "/sitemap.xml",
  };
}

function generateRobotsText(config: RobotsConfig, domain: string): string {
  if (config.env === "development") {
    return ["User-agent: *", "Disallow: /"].join("\n");
  }

  const ruleBlocks = config.rules.map((rule) => {
    const lines = [`User-agent: ${rule.userAgent}`];
    for (const path of rule.allow ?? []) {
      lines.push(`Allow: ${path}`);
    }
    for (const path of rule.disallow ?? []) {
      lines.push(`Disallow: ${path}`);
    }
    return lines.join("\n");
  });

  const sitemapUrl = domain + config.sitemapPath;
  return [...ruleBlocks, `Sitemap: ${sitemapUrl}`].join("\n\n");
}

export async function GET(): Promise<Response> {
  const site = await getWebsiteConfig();
  const publicOrigin = toPublicSiteOrigin(site);

  const config = getRobotsConfig();
  const text = generateRobotsText(config, publicOrigin);

  return new Response(text, {
    headers: {
      "Content-Type": "text/plain",
    },
  });
}
