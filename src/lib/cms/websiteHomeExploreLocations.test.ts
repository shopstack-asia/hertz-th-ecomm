import { resolveExploreLocationsSection } from "./websiteHomeExploreLocations";

describe("resolveExploreLocationsSection", () => {
  it("returns empty tiles when home_page is missing", () => {
    const r = resolveExploreLocationsSection(undefined);
    expect(r.tiles).toEqual([]);
    expect(r.contactCtaHref).toBe("/locations");
  });

  it("maps null images to numbered fallbacks and parses links", () => {
    const r = resolveExploreLocationsSection([
      {
        block_type: "CARD_LIST",
        code: "EXPLORE_LOCATIONS",
        enabled: true,
        config: {
          config: {
            cta: { label: "Call us", link: "/contact" },
            items: [
              {
                uid: "a",
                image: [null],
                link: "/search?pickup=PYO",
                title: "พะเยา",
              },
              {
                uid: "b",
                image: ["https://cdn.example.com/x.jpg"],
                link: "/search?pickup=KBV",
                title: "กระบี่",
              },
            ],
            section_title: "Custom title",
          },
        },
      },
    ]);
    expect(r.tiles).toHaveLength(2);
    expect(r.tiles[0].imageSrc).toBe("/images/explore_locations/explore-locations-1.webp");
    expect(r.tiles[0].href).toBe("/search?pickup=PYO");
    expect(r.tiles[1].imageSrc).toBe("https://cdn.example.com/x.jpg");
    expect(r.sectionTitle).toBe("Custom title");
    expect(r.contactCtaHref).toBe("/contact");
    expect(r.contactCtaLabel).toBe("Call us");
  });
});
