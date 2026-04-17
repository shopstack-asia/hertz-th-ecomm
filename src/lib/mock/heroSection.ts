/**
 * Mock `CmsSitePublic.home_page` blocks: CMS `code` HERO_SECTION, `block_type` CAROUSEL.
 * `items[].image[0]` null → `resolveHomeHeroCarousel` uses `/images/home/hero-slide-*.webp`.
 */
export const MOCK_HERO_SECTION_CAROUSEL_BLOCKS = [
  {
    _id: "69e0b7ca49c0455c6c490ba2",
    system: false,
    _need_refresh: true,
    code: "HERO_SECTION",
    name: "Hero Section",
    enabled: true,
    block_type: "CAROUSEL",
    config: {
      config: {
        cta: { label: "" },
        auto_play: true,
        interval_ms: 3000,
        items: [
          {
            uid: "2ec5e438-1a32-44ec-add5-a628030b1eb6",
            image: [null],
            title: "Background 1",
            subtitle: "",
          },
          {
            uid: "e302f31e-0820-4526-8ac7-edae52078495",
            image: [null],
            title: "Background 2",
            subtitle: "",
          },
          {
            uid: "fcac7aa7-9a16-4545-92b3-cef7ea99aab5",
            image: [null],
            title: "Background 3",
            subtitle: "",
          },
        ],
        title: "",
        subtitle: "",
        alt: "",
        section_title: "",
        section_subtitle: "",
      },
    },
    createdAt: "2026-04-16T10:19:54.714Z",
    updatedAt: "2026-04-16T23:45:18.980Z",
    _search_encrypt: [] as const,
    _search_text: "carousel|hero_section|hero section",
    id: "69e0b7ca49c0455c6c490ba2",
  },
] as const;
