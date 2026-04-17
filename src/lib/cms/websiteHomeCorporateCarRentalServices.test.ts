import { resolveCorporateCarRentalServicesSection } from "./websiteHomeCorporateCarRentalServices";

describe("resolveCorporateCarRentalServicesSection", () => {
  it("returns defaults when home_page is missing", () => {
    const r = resolveCorporateCarRentalServicesSection(undefined);
    expect(r.backgroundImageSrc).toBe("/images/home/corporate-car-rental-services.webp");
    expect(r.ctaHref).toBe("/vouchers");
  });

  it("uses fallback when image[0] is null", () => {
    const r = resolveCorporateCarRentalServicesSection([
      {
        block_type: "BANNER",
        code: "CORPORATE_CAR_RENTAL_SERVICES",
        enabled: true,
        config: {
          config: {
            image: [null],
            link: "/vouchers",
          },
        },
      },
    ]);
    expect(r.backgroundImageSrc).toBe("/images/home/corporate-car-rental-services.webp");
  });

  it("uses image url and link from banner when present", () => {
    const r = resolveCorporateCarRentalServicesSection([
      {
        block_type: "BANNER",
        code: "CORPORATE_CAR_RENTAL_SERVICES",
        enabled: true,
        config: {
          config: {
            image: ["https://cdn.example.com/corp.jpg"],
            link: "/vehicles",
            alt: "Corporate",
          },
        },
      },
    ]);
    expect(r.backgroundImageSrc).toBe("https://cdn.example.com/corp.jpg");
    expect(r.ctaHref).toBe("/vehicles");
    expect(r.backgroundAlt).toBe("Corporate");
  });
});
