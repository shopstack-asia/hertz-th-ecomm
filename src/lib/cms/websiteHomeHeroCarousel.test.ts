import { resolveHomeHeroCarousel } from "./websiteHomeHeroCarousel";

describe("resolveHomeHeroCarousel", () => {
  it("returns default slides when home_page is missing", () => {
    const r = resolveHomeHeroCarousel(undefined);
    expect(r.slides).toHaveLength(3);
    expect(r.slides[0].src).toBe("/images/home/hero-slide-1.webp");
    expect(r.autoPlay).toBe(true);
    expect(r.intervalMs).toBe(3000);
  });

  it("uses public URLs from items when image[0] is a string", () => {
    const r = resolveHomeHeroCarousel([
      {
        block_type: "CAROUSEL",
        code: "HERO_SECTION",
        enabled: true,
        config: {
          config: {
            auto_play: false,
            interval_ms: 5000,
            alt: "Home",
            items: [
              { title: "A", image: ["https://cdn.example.com/a.jpg"] },
              { title: "B", image: [null] },
            ],
          },
        },
      },
    ]);
    expect(r.slides[0].src).toBe("https://cdn.example.com/a.jpg");
    expect(r.slides[0].alt).toBe("Home — A");
    expect(r.slides[1].src).toBe("/images/home/hero-slide-2.webp");
    expect(r.autoPlay).toBe(false);
    expect(r.intervalMs).toBe(5000);
  });

  it("ignores CAROUSEL blocks that are not HERO_SECTION", () => {
    const r = resolveHomeHeroCarousel([
      {
        block_type: "CAROUSEL",
        code: "EXCLUSIVE_OFFERS",
        enabled: true,
        config: {
          config: {
            items: [{ title: "Partner", image: ["https://cdn.example.com/partner.jpg"] }],
          },
        },
      },
    ]);
    expect(r.slides[0].src).toBe("/images/home/hero-slide-1.webp");
  });
});
