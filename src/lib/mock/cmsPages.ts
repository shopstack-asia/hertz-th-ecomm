import type { CmsPage } from "@/types/cms";

export type MockLocale = "en" | "th" | "zh";

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

/** Full page overrides for th/zh. en uses CMS_PAGES as-is. */
const CMS_PAGE_TRANSLATIONS: Record<string, Record<MockLocale, CmsPage | null>> = {
  "hertz-gold-plus-rewards": {
    en: null,
    th: {
      slug: "hertz-gold-plus-rewards",
      title: "Hertz Gold Plus Rewards",
      meta_title: "Hertz Gold Plus Rewards | สมัครฟรี | Hertz ประเทศไทย",
      meta_description:
        "สมัคร Hertz Gold Plus Rewards ฟรี สะสมคะแนน เช็คเอาท์เร็วขึ้น อัปเกรดฟรี และโปรพิเศษสำหรับสมาชิกในการเช่ารถทั่วไทย",
      hero: {
        heading: "Hertz Gold Plus Rewards",
        subheading: "สะสมคะแนน บริการที่เร็วขึ้น และสิทธิพิเศษทุกครั้งที่เช่า",
        background_image:
          "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=1600&q=80",
        cta_label: "สมัครเลย",
        cta_link: "/account/register",
      },
      sections: [
        {
          type: "text",
          content: `
          <p class="mb-4">Hertz Gold Plus Rewards คือโปรแกรมสมาชิกฟรีที่ออกแบบมาให้การเช่าทุกครั้งเร็วและคุ้มค่าขึ้น ไม่ว่าคุณจะเดินทางเพื่อธุรกิจหรือพักผ่อน สมาชิกจะได้รับสิทธิประโยชน์ที่เพิ่มมูลค่าจริงในทุกการเดินทาง</p>
          <p class="mb-4">สมัครได้ในไม่กี่นาที—ไม่ต้องใช้บัตรเครดิต เริ่มสะสมคะแนนตั้งแต่เช่าครั้งแรก พร้อมเช็คเอาท์ที่เร็วขึ้น อัปเกรดฟรี และโปรโมชันพิเศษสำหรับสมาชิกเท่านั้น</p>
        `,
        },
        {
          type: "benefits",
          items: [
            {
              title: "เช็คเอาท์เร็วขึ้น",
              description:
                "ข้ามเคาน์เตอร์ ลงทะเบียนข้อมูลล่วงหน้า แล้วตรงไปที่รถกับ Hertz Gold Plus Rewards",
              icon: "speed",
            },
            {
              title: "สะสมคะแนนทุกครั้งที่เช่า",
              description:
                "สะสมคะแนนจากทุกการเช่าที่เข้าร่วม แลกเป็นวันเช่าฟรีและอัปเกรดได้ทั่วไทยและทั่วโลก",
              icon: "points",
            },
            {
              title: "อัปเกรดฟรีหนึ่งระดับ",
              description:
                "สมาชิก Gold Plus ได้รับการอัปเกรดหนึ่งระดับฟรีที่สาขาที่ร่วมรายการ ตามความพร้อม",
              icon: "upgrade",
            },
            {
              title: "โปรพิเศษเฉพาะสมาชิก",
              description:
                "เข้าถึงส่วนลดเฉพาะสมาชิก อีเวนต์คะแนนสองเท่า และข้อเสนอพิเศษที่ไม่มีให้คนทั่วไป",
              icon: "offer",
            },
          ],
        },
        {
          type: "text",
          content: `
          <p class="mb-4">คะแนนไม่หมดอายุตราบใดที่มีกิจกรรมที่เข้าร่วมอย่างน้อยครั้งหนึ่งทุก 18 เดือน ใช้แลกวันเช่าได้ที่สนามบินและในเมืองทั่วไทย หรือที่ Hertz กว่า 8,000 แห่งทั่วโลก</p>
          <p class="mb-4">จากกรุงเทพถึงภูเก็ต เชียงใหม่ถึงพัทยา—Hertz Gold Plus Rewards ใช้ได้ทุกที่ที่คุณเช่า สมัครวันนี้แล้วสัมผัสความแตกต่างของการเป็นสมาชิกที่มีคุณค่า</p>
        `,
        },
        {
          type: "cta_banner",
          heading: "พร้อมเริ่มต้นแล้วหรือยัง?",
          subheading: "สมัครฟรี ไม่มีข้อผูกมัด เริ่มใช้สิทธิประโยชน์ในการเช่าครั้งถัดไป",
          button_label: "สมัคร Gold Plus Rewards",
          button_link: "/account/register",
        },
      ],
      is_published: true,
    },
    zh: {
      slug: "hertz-gold-plus-rewards",
      title: "Hertz Gold Plus Rewards",
      meta_title: "Hertz Gold Plus Rewards | 免费加入 | Hertz 泰国",
      meta_description:
        "免费加入 Hertz Gold Plus Rewards。赚取积分、享受更快结账、免费升级及泰国租车会员专享优惠。",
      hero: {
        heading: "Hertz Gold Plus Rewards",
        subheading: "每次租车赚积分、享快捷服务、解锁专属福利。",
        background_image:
          "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=1600&q=80",
        cta_label: "立即加入",
        cta_link: "/account/register",
      },
      sections: [
        {
          type: "text",
          content: `
          <p class="mb-4">Hertz Gold Plus Rewards 是我们免费的忠诚度计划，让每次租车更快捷、更超值。无论商务还是休闲出行，会员均可享受一系列实实在在的福利。</p>
          <p class="mb-4">几分钟即可注册，无需信用卡。从第一次租车开始赚取积分，享受更快结账、免费升级及仅限会员的专属促销。</p>
        `,
        },
        {
          type: "benefits",
          items: [
            {
              title: "更快结账",
              description:
                "跳过柜台。预先登记信息，持 Hertz Gold Plus Rewards 直接取车。",
              icon: "speed",
            },
            {
              title: "每次租车赚积分",
              description:
                "每次符合条件租车累积积分。可兑换泰国及全球免租日与升级。",
              icon: "points",
            },
            {
              title: "免费升一档",
              description:
                "Gold Plus 会员在参与门店可享一档免费升级，视供应情况而定。",
              icon: "upgrade",
            },
            {
              title: "会员专享促销",
              description:
                "专享会员折扣、双倍积分活动及不对公众开放的特惠。",
              icon: "offer",
            },
          ],
        },
        {
          type: "text",
          content: `
          <p class="mb-4">只要每 18 个月至少有一次符合条件活动，积分永不过期。可在泰国各地机场与市区门店或全球逾 8,000 家 Hertz 门店兑换租车日。</p>
          <p class="mb-4">从曼谷到普吉、清迈到芭堤雅——无论在哪里租车，Hertz Gold Plus Rewards 都适用。立即加入，体验尊享会员的不同。</p>
        `,
        },
        {
          type: "cta_banner",
          heading: "准备开始？",
          subheading: "免费注册，无任何义务。下次租车即可享受福利。",
          button_label: "加入 Gold Plus Rewards",
          button_link: "/account/register",
        },
      ],
      is_published: true,
    },
  },
};

export function getCmsPageBySlug(slug: string, locale?: MockLocale): CmsPage | null {
  const base = CMS_PAGES[slug] ?? null;
  if (!base) return null;
  const effectiveLocale = locale && (locale === "en" || locale === "th" || locale === "zh") ? locale : "en";
  const translated = CMS_PAGE_TRANSLATIONS[slug]?.[effectiveLocale];
  if (translated) return translated;
  return base;
}
