import type { CmsPage } from "@/types/cms";

export const CMS_PAGES: Record<string, CmsPage> = {
  "hertz-gold-plus-rewards": {
    slug: "hertz-gold-plus-rewards",
    title: "Hertz Gold Plus Rewards",
    meta_title: "Hertz Gold Plus Rewards | Join Free | Hertz Thailand",
    meta_description:
      "Join Hertz Gold Plus Rewards for free. Earn points, enjoy faster checkout, complimentary upgrades, and exclusive member offers on car rentals across Thailand.",
    hero: {
      heading: "Hertz Gold Plus Rewards",
      subheading:
        "Earn points, enjoy faster service, and unlock exclusive benefits every time you rent.",
      background_image:
        "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=1600&q=80",
      cta_label: "Join Now",
      cta_link: "/account/register",
    },
    sections: [
      {
        type: "text",
        content: `
          <p class="mb-4">Hertz Gold Plus Rewards is our free loyalty program designed to make every rental faster and more rewarding. Whether you travel for business or leisure, membership unlocks a range of benefits that add real value to every trip.</p>
          <p class="mb-4">Sign up in minutes—no credit card required. Start earning points on your very first rental and enjoy faster checkout, complimentary upgrades, and exclusive promotions reserved for members only.</p>
        `,
      },
      {
        type: "benefits",
        items: [
          {
            title: "Faster Checkout",
            description:
              "Skip the counter. Pre-register your details and go straight to your car with Hertz Gold Plus Rewards.",
            icon: "speed",
          },
          {
            title: "Earn Points on Every Rental",
            description:
              "Accumulate points with every qualifying rental. Redeem for free rental days and upgrades across Thailand and globally.",
            icon: "points",
          },
          {
            title: "Complimentary Upgrade",
            description:
              "Gold Plus members receive a one-category complimentary upgrade at participating locations, subject to availability.",
            icon: "upgrade",
          },
          {
            title: "Exclusive Member Promotions",
            description:
              "Access members-only discounts, double points events, and special offers not available to the general public.",
            icon: "offer",
          },
        ],
      },
      {
        type: "text",
        content: `
          <p class="mb-4">Your points never expire as long as you have qualifying activity at least once every 18 months. Use them for rental days at airports and downtown locations across Thailand, or at over 8,000 Hertz locations worldwide.</p>
          <p class="mb-4">From Bangkok to Phuket, Chiang Mai to Pattaya—Hertz Gold Plus Rewards works wherever you rent. Join today and experience the difference of being a valued member.</p>
        `,
      },
      {
        type: "cta_banner",
        heading: "Ready to get started?",
        subheading: "Sign up free. No obligations. Start earning benefits on your next rental.",
        button_label: "Join Gold Plus Rewards",
        button_link: "/account/register",
      },
    ],
    is_published: true,
  },
};

export function getCmsPageBySlug(slug: string): CmsPage | null {
  return CMS_PAGES[slug] ?? null;
}
