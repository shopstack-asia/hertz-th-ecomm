/**
 * Static home testimonials copy (design mock), shaped like `home.testimonials` in locale bundles.
 * Served via `/api/i18n`; edit here to change mock quotes/headers for all locales together.
 */
export const HOME_TESTIMONIALS_CARD_ORDER = [
  "excellent",
  "reliable",
  "transparent",
  "clean",
] as const;

export type HomeTestimonialCardId = (typeof HOME_TESTIMONIALS_CARD_ORDER)[number];

export const HOME_PAGE_TESTIMONIALS_MOCK = {
  en: {
    title: "What our customers say",
    rating_aria: "{n} out of 5 stars",
    cards: {
      excellent: {
        header: "EXCELLENT SERVICE",
        quote:
          "Great service at Phuket airport. Car was ready when we arrived.",
        author: "SARAH K.",
        location: "PHUKET INTERNATIONAL AIRPORT (DOMESTIC TERMINAL)",
      },
      reliable: {
        header: "RELIABLE QUALITY",
        quote: "Transparent pricing, no surprises. Hertz Thailand is my go-to.",
        author: "MICHAEL T.",
        location: "CHIANG MAI INTERNATIONAL AIRPORT",
      },
      transparent: {
        header: "TRANSPARENT PRICING",
        quote:
          "Smooth booking process and excellent vehicle condition. Will use again.",
        author: "JAMES L.",
        location: "BANGKOK SATHORN DOWNTOWN",
      },
      clean: {
        header: "CLEAN & NEW CARS",
        quote:
          "Excellent service. The car was new, clean, and in perfect condition.",
        author: "ADAM P.",
        location: "KHON KAEN INTERNATIONAL AIRPORT",
      },
    },
  },
  th: {
    title: "ลูกค้าของเราพูดถึงเราอย่างไร",
    rating_aria: "{n} จาก 5 ดาว",
    cards: {
      excellent: {
        header: "บริการยอดเยี่ยม",
        quote:
          "บริการดีมากที่สนามบินภูเก็ต รถพร้อมรับตามเวลาที่เรามาถึง",
        author: "SARAH K.",
        location: "PHUKET INTERNATIONAL AIRPORT (DOMESTIC TERMINAL)",
      },
      reliable: {
        header: "คุณภาพที่เชื่อถือได้",
        quote:
          "ราคาโปร่งใส ไม่มีเซอร์ไพรส์ เฮิร์ตประเทศไทยคือตัวเลือกแรกของผม",
        author: "MICHAEL T.",
        location: "CHIANG MAI INTERNATIONAL AIRPORT",
      },
      transparent: {
        header: "ราคาโปร่งใส",
        quote: "จองง่าย สภาพรถดีมาก จะใช้บริการอีกแน่นอน",
        author: "JAMES L.",
        location: "BANGKOK SATHORN DOWNTOWN",
      },
      clean: {
        header: "รถสะอาดใหม่",
        quote:
          "บริการยอดเยี่ยม รถใหม่ สะอาด และอยู่ในสภาพสมบูรณ์",
        author: "ADAM P.",
        location: "KHON KAEN INTERNATIONAL AIRPORT",
      },
    },
  },
  zh: {
    title: "客户评价",
    rating_aria: "{n} 星（满分 5 星）",
    cards: {
      excellent: {
        header: "卓越服务",
        quote: "普吉机场服务很棒，我们到达时车辆已备好。",
        author: "SARAH K.",
        location: "PHUKET INTERNATIONAL AIRPORT (DOMESTIC TERMINAL)",
      },
      reliable: {
        header: "品质可靠",
        quote: "价格透明、没有意外，泰国赫兹是我的首选。",
        author: "MICHAEL T.",
        location: "CHIANG MAI INTERNATIONAL AIRPORT",
      },
      transparent: {
        header: "价格透明",
        quote: "预订顺畅，车况出色，会再次选择。",
        author: "JAMES L.",
        location: "BANGKOK SATHORN DOWNTOWN",
      },
      clean: {
        header: "车辆崭新洁净",
        quote: "服务出色，车辆崭新、干净且状况完美。",
        author: "ADAM P.",
        location: "KHON KAEN INTERNATIONAL AIRPORT",
      },
    },
  },
} as const;
