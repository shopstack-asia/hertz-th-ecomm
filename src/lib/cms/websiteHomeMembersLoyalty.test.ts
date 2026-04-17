import { resolveMembersLoyaltyProgramSection } from "./websiteHomeMembersLoyalty";

describe("resolveMembersLoyaltyProgramSection", () => {
  it("returns defaults when home_page is missing", () => {
    const r = resolveMembersLoyaltyProgramSection(undefined);
    expect(r.backgroundImageSrc).toBe("/images/home/members-loyalty-program-section.webp");
    expect(r.ctaHref).toBe("/rewards");
  });

  it("uses image url and link from banner block when present", () => {
    const r = resolveMembersLoyaltyProgramSection([
      {
        block_type: "BANNER",
        code: "MEMBERS_LOYALTY_PROGRAM_SECTION",
        enabled: true,
        config: {
          config: {
            image: ["https://cdn.example.com/banner.jpg"],
            link: "/account/register",
            alt: "Loyalty",
          },
        },
      },
    ]);
    expect(r.backgroundImageSrc).toBe("https://cdn.example.com/banner.jpg");
    expect(r.ctaHref).toBe("/account/register");
    expect(r.backgroundAlt).toBe("Loyalty");
  });
});
