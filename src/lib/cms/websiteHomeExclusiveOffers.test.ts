import { resolveHomeExclusiveOffers } from "./websiteHomeExclusiveOffers";

describe("resolveHomeExclusiveOffers", () => {
  it("returns empty when home_page is missing", () => {
    const r = resolveHomeExclusiveOffers(undefined);
    expect(r.items).toEqual([]);
  });

  it("skips items with no usable image", () => {
    const r = resolveHomeExclusiveOffers([
      {
        block_type: "CAROUSEL",
        code: "EXCLUSIVE_OFFERS",
        enabled: true,
        config: {
          config: {
            auto_play: false,
            interval_ms: 5000,
            items: [
              {
                uid: "a",
                title: "WHAT YOU'LL MASTER",
                subtitle: "Body",
                link: "/vouchers",
                cta: { label: "LEARN MORE" },
              },
            ],
          },
        },
      },
    ]);
    expect(r.items).toHaveLength(0);
  });

  it("resolves card copy and per-item CTA from CMS", () => {
    const r = resolveHomeExclusiveOffers([
      {
        block_type: "CAROUSEL",
        code: "EXCLUSIVE_OFFERS",
        enabled: true,
        config: {
          config: {
            auto_play: false,
            interval_ms: 5000,
            items: [
              {
                uid: "a",
                title: "WHAT YOU'LL MASTER",
                subtitle: "The core skills",
                link: "/vouchers",
                cta: { label: "LEARN MORE" },
                image: ["/images/exclusive_offers/AW Promotion Partner BAY_square.jpg"],
              },
            ],
          },
        },
      },
    ]);
    expect(r.items).toHaveLength(1);
    expect(r.items[0].imageSrc).toBe("/images/exclusive_offers/AW Promotion Partner BAY_square.jpg");
    expect(r.items[0].href).toBe("/vouchers");
    expect(r.items[0].cardTitle).toBe("WHAT YOU'LL MASTER");
    expect(r.items[0].cardDescription).toBe("The core skills");
    expect(r.items[0].itemCtaLabel).toBe("LEARN MORE");
    expect(r.autoPlay).toBe(false);
    expect(r.intervalMs).toBe(5000);
  });

  it("prefers items[].image[0] string when present", () => {
    const r = resolveHomeExclusiveOffers([
      {
        block_type: "CAROUSEL",
        code: "EXCLUSIVE_OFFERS",
        enabled: true,
        config: {
          config: {
            items: [
              {
                uid: "b",
                title: "T",
                image: ["https://cdn.example.com/promo.jpg"],
                link: "/x",
              },
            ],
          },
        },
      },
    ]);
    expect(r.items[0].imageSrc).toBe("https://cdn.example.com/promo.jpg");
  });
});
