/**
 * Mock `CmsSitePublic.home_page` block: `EXPLORE_LOCATIONS` (`block_type` CARD_LIST).
 * `items[].image[0]` null → `resolveExploreLocationsSection` maps to
 * `/images/explore_locations/explore-locations-{index}.webp`.
 */
export const MOCK_EXPLORE_LOCATIONS_CARD_LIST_BLOCK = {
  _id: "69e182c749c0455c6c49b003",
  system: false,
  _need_refresh: true,
  code: "EXPLORE_LOCATIONS",
  name: "Explore Locations",
  enabled: true,
  block_type: "CARD_LIST",
  config: {
    config: {
      cta: { label: "" },
      auto_play: true,
      items: [
        {
          uid: "36ad39b5-4abe-47da-9d75-a6eedba07059",
          image: [null],
          link: "/search?pickup=PYO",
          title: "พะเยา",
        },
        {
          uid: "6e5d427b-63ee-4f82-992e-c0c5a3eefff4",
          image: [null],
          link: "/search?pickup=KBV",
          title: "กระบี่",
        },
        {
          uid: "8fb6b4d9-6ee8-4300-9588-f3bc75498f13",
          image: [null],
          link: "/search?pickup=USM",
          title: "สุราษฎร์ธานี",
        },
        {
          uid: "b16ad99f-ae63-428b-9dff-100746a0c994",
          image: [null],
          link: "/search?pickup=CEI",
          title: "เชียงราย",
        },
        {
          uid: "c5190775-d11e-4592-aeeb-74e8b58f3ff1",
          image: [null],
          link: "/search?pickup=BKK",
          title: "กรุงเทพฯ",
        },
        {
          uid: "4c1b334b-186e-4457-be35-de174c0c4c4e",
          image: [null],
          link: "/search?pickup=UBP",
          title: "อุบลราชธานี",
        },
        {
          uid: "53d096e2-9bf9-41c4-9e81-f480ec56fd22",
          image: [null],
          link: "/search?pickup=RBP",
          title: "ราชบุรี",
        },
        {
          uid: "0c5d8e17-d1aa-4c1a-924b-98d4233641b9",
          image: [null],
          link: "/search?pickup=CNX",
          title: "เชียงใหม่",
        },
        {
          uid: "901ec9a5-fcaa-461b-ac1b-db3e536916fe",
          image: [null],
          link: "/search?pickup=HKT",
          title: "ภูเก็ต",
        },
        {
          uid: "de22ac32-01af-4852-aabb-3e5b8adde73f",
          image: [null],
          link: "/search?pickup=DMK",
          title: "กรุงเทพฯ",
        },
      ],
      title: "",
      subtitle: "",
      alt: "",
      section_title: "",
      section_subtitle: "",
    },
  },
  createdAt: "2026-04-17T00:45:59.125Z",
  updatedAt: "2026-04-17T01:19:56.009Z",
  _search_encrypt: [] as const,
  _search_text: "card_list|explore_locations|explore locations",
  id: "69e182c749c0455c6c49b003",
} as const;
