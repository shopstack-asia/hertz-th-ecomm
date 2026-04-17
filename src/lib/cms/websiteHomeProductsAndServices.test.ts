import { resolveProductsAndServicesSection } from "./websiteHomeProductsAndServices";

describe("resolveProductsAndServicesSection", () => {
  it("returns defaults when home_page is missing", () => {
    const r = resolveProductsAndServicesSection(undefined);
    expect(r.backgroundImageSrc).toBe("/images/home/products-and-services.webp");
    expect(r.ctaHref).toBe("/vouchers");
  });

  it("uses image url and link from banner block when present", () => {
    const r = resolveProductsAndServicesSection([
      {
        block_type: "BANNER",
        code: "PRODUCTS_AND_SERVICES",
        enabled: true,
        config: {
          config: {
            image: ["https://cdn.example.com/pas.jpg"],
            link: "/vehicles",
            alt: "Products",
          },
        },
      },
    ]);
    expect(r.backgroundImageSrc).toBe("https://cdn.example.com/pas.jpg");
    expect(r.ctaHref).toBe("/vehicles");
    expect(r.backgroundAlt).toBe("Products");
  });
});
