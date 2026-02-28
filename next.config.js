/** @type {import('next').NextConfig} */
const path = require("path");
const withPWA = require("@ducanh2912/next-pwa").default({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
  skipWaiting: true,
  cacheOnFrontEndNav: true,
  cacheStartUrl: true,
  reloadOnOnline: true,
  fallbacks: {
    document: "/~offline",
  },
  extendDefaultRuntimeCaching: true,
  workboxOptions: {
    runtimeCaching: [
      {
        urlPattern: /^https:\/\/images\.unsplash\.com\/.*/i,
        handler: "StaleWhileRevalidate",
        options: {
          cacheName: "images-unsplash",
          expiration: { maxEntries: 64, maxAgeSeconds: 30 * 24 * 60 * 60 },
          cacheableResponse: { statuses: [0, 200] },
        },
      },
      {
        urlPattern: /\/api\/search/,
        handler: "NetworkFirst",
        options: {
          cacheName: "api-search",
          networkTimeoutSeconds: 10,
          expiration: { maxEntries: 32, maxAgeSeconds: 5 * 60 },
          cacheableResponse: { statuses: [0, 200] },
        },
      },
      {
        urlPattern: /\/api\/locations/,
        handler: "NetworkFirst",
        options: {
          cacheName: "api-locations",
          networkTimeoutSeconds: 10,
          expiration: { maxEntries: 16, maxAgeSeconds: 10 * 60 },
          cacheableResponse: { statuses: [0, 200] },
        },
      },
      {
        urlPattern: /\/api\/special-offers/,
        handler: "NetworkFirst",
        options: {
          cacheName: "api-special-offers",
          networkTimeoutSeconds: 10,
          expiration: { maxEntries: 8, maxAgeSeconds: 10 * 60 },
          cacheableResponse: { statuses: [0, 200] },
        },
      },
      {
        urlPattern: /\/api\/cms/,
        handler: "NetworkFirst",
        options: {
          cacheName: "api-cms",
          networkTimeoutSeconds: 10,
          expiration: { maxEntries: 16, maxAgeSeconds: 60 * 60 },
          cacheableResponse: { statuses: [0, 200] },
        },
      },
    ],
    navigateFallbackDenylist: [
      /^\/api\/reservation\/create/,
      /^\/api\/payment/,
      /^\/api\/account\/profile/,
      /^\/checkout/,
    ],
  },
});

const nextConfig = {
  reactStrictMode: true,
  outputFileTracingRoot: path.join(__dirname),
  webpack: (config, { dev }) => {
    // Avoid "Unexpected early exit / Unfinished hook action (terser) renderChunk" with Next 15
    if (!dev && config.optimization?.minimizer) {
      config.optimization.minimizer = config.optimization.minimizer.filter((plugin) => {
        const name = plugin?.constructor?.name ?? "";
        return !name.includes("Terser");
      });
    }
    return config;
  },
  async redirects() {
    return [
      { source: "/gold-rewards", destination: "/rewards", permanent: true },
    ];
  },
};

module.exports = withPWA(nextConfig);
