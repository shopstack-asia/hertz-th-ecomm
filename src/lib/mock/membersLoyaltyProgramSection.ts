/**
 * Mock `CmsSitePublic.home_page` block: `MEMBERS_LOYALTY_PROGRAM_SECTION` (`block_type` BANNER).
 * Image URL absent → storefront uses `/images/home/members-loyalty-program-section.webp`.
 */
export const MOCK_MEMBERS_LOYALTY_PROGRAM_BANNER_BLOCK = {
  _id: "69e17ca749c0455c6c49a656",
  system: false,
  _need_refresh: true,
  code: "MEMBERS_LOYALTY_PROGRAM_SECTION",
  name: "Members Loyalty Program Section",
  enabled: true,
  block_type: "BANNER",
  config: {
    config: {
      cta: { label: "" },
      image: [{ is_public: false }],
      link: "/rewards",
      auto_play: true,
      title: "",
      subtitle: "",
      alt: "",
      section_title: "",
      section_subtitle: "",
    },
  },
  createdAt: "2026-04-17T00:19:51.116Z",
  updatedAt: "2026-04-17T00:26:15.649Z",
  _search_encrypt: [] as const,
  _search_text: "banner|members_loyalty_program_section|members loyalty program section",
  id: "69e17ca749c0455c6c49a656",
} as const;
