export type DiscountType = "percentage" | "fixed_amount";
export type PromotionType =
  | "Pay Now Discount"
  | "Long Rental Deal"
  | "Member Exclusive"
  | "Airport Special"
  | "Early Bird"
  | "EV Promotion";

export type MockLocale = "en" | "th" | "zh";

export interface SpecialOffer {
  id: string;
  title: string;
  short_description: string;
  full_description: string;
  discount_type: DiscountType;
  discount_value: number;
  badge_label: string;
  promotion_type: PromotionType;
  valid_from: string;
  valid_to: string;
  is_member_only: boolean;
  min_rental_days: number;
  applicable_vehicle_category: string[];
  applicable_locations: string[];
  hero_image_url: string;
  thumbnail_image_url: string;
  is_active: boolean;
}

const now = new Date();
const in30Days = new Date(now);
in30Days.setDate(in30Days.getDate() + 30);
const in60Days = new Date(now);
in60Days.setDate(in60Days.getDate() + 60);
const in90Days = new Date(now);
in90Days.setDate(in90Days.getDate() + 90);

function toISO(d: Date) {
  return d.toISOString().slice(0, 10);
}

export const SPECIAL_OFFERS: SpecialOffer[] = [
  {
    id: "po-001",
    title: "Pay Now, Save 10%",
    short_description: "Book and pay in advance for the best rate on your rental.",
    full_description:
      "When you book and pay at the time of reservation, you save 10% on your base rental rate. Available on all vehicle categories. No coupon code required—select Pay Now at checkout to apply.",
    discount_type: "percentage",
    discount_value: 10,
    badge_label: "10% OFF",
    promotion_type: "Pay Now Discount",
    valid_from: toISO(new Date(now.getFullYear(), now.getMonth() - 1, 1)),
    valid_to: toISO(in90Days),
    is_member_only: false,
    min_rental_days: 1,
    applicable_vehicle_category: ["All"],
    applicable_locations: ["All"],
    hero_image_url: "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=800&q=80",
    thumbnail_image_url: "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=600&q=80",
    is_active: true,
  },
  {
    id: "po-002",
    title: "Weekly Rental Deal",
    short_description: "Save up to 15% on 7+ day rentals. Perfect for long trips.",
    full_description:
      "Planning a week-long road trip? Rent for 7 days or more and save up to 15% on your total rental. Applies to Economy, Compact, and Mid-size vehicles. Minimum 7 consecutive rental days required.",
    discount_type: "percentage",
    discount_value: 15,
    badge_label: "Save up to 15%",
    promotion_type: "Long Rental Deal",
    valid_from: toISO(new Date(now.getFullYear(), now.getMonth(), 1)),
    valid_to: toISO(in60Days),
    is_member_only: false,
    min_rental_days: 7,
    applicable_vehicle_category: ["Economy", "Compact", "Mid-size"],
    applicable_locations: ["All"],
    hero_image_url: "https://images.unsplash.com/photo-1502877338535-766e1452684a?w=800&q=80",
    thumbnail_image_url: "https://images.unsplash.com/photo-1502877338535-766e1452684a?w=600&q=80",
    is_active: true,
  },
  {
    id: "po-003",
    title: "Gold Plus Complimentary Upgrade",
    short_description: "Gold Plus Rewards members get complimentary car class upgrade.",
    full_description:
      "Gold Plus Rewards members receive a complimentary one-category upgrade at participating locations. Subject to availability at pickup. Join Gold Plus Rewards for free to unlock this benefit.",
    discount_type: "fixed_amount",
    discount_value: 0,
    badge_label: "Member Only",
    promotion_type: "Member Exclusive",
    valid_from: toISO(new Date(now.getFullYear(), 0, 1)),
    valid_to: toISO(new Date(now.getFullYear() + 1, 11, 31)),
    is_member_only: true,
    min_rental_days: 1,
    applicable_vehicle_category: ["All"],
    applicable_locations: ["All"],
    hero_image_url: "https://images.unsplash.com/photo-1619767886558-efdc259cde1a?w=800&q=80",
    thumbnail_image_url: "https://images.unsplash.com/photo-1619767886558-efdc259cde1a?w=600&q=80",
    is_active: true,
  },
  {
    id: "po-004",
    title: "Early Bird Special",
    short_description: "Book 30 days ahead and enjoy 5% extra savings.",
    full_description:
      "Plan ahead and save. Book your rental at least 30 days before pickup and receive an additional 5% off your base rate. Combines with Pay Now discount. Valid for bookings made 30+ days in advance.",
    discount_type: "percentage",
    discount_value: 5,
    badge_label: "Early Bird",
    promotion_type: "Early Bird",
    valid_from: toISO(now),
    valid_to: toISO(in90Days),
    is_member_only: false,
    min_rental_days: 1,
    applicable_vehicle_category: ["All"],
    applicable_locations: ["All"],
    hero_image_url: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&q=80",
    thumbnail_image_url: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=600&q=80",
    is_active: true,
  },
  {
    id: "po-005",
    title: "EV Special Discount",
    short_description: "Save 12% on electric vehicle rentals. Go green, save more.",
    full_description:
      "Experience zero-emission driving with our electric vehicle fleet. Save 12% on BYD Atto 3, MG4 Electric, and other EV models. Charging cable included. Available at major airport and downtown locations.",
    discount_type: "percentage",
    discount_value: 12,
    badge_label: "12% OFF EV",
    promotion_type: "EV Promotion",
    valid_from: toISO(now),
    valid_to: toISO(in60Days),
    is_member_only: false,
    min_rental_days: 2,
    applicable_vehicle_category: ["EV"],
    applicable_locations: ["BKK", "DMK", "CNX", "HKT", "All"],
    hero_image_url: "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=800&q=80",
    thumbnail_image_url: "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=600&q=80",
    is_active: true,
  },
  {
    id: "po-006",
    title: "Airport Pickup Special",
    short_description: "Exclusive rates when you pick up at any Thailand airport.",
    full_description:
      "Arriving by air? Get exclusive rates when you pick up at Suvarnabhumi, Don Mueang, Phuket, Chiang Mai, or other airport locations. Same-day return to any Hertz branch at no extra fee.",
    discount_type: "percentage",
    discount_value: 8,
    badge_label: "Airport Special",
    promotion_type: "Airport Special",
    valid_from: toISO(now),
    valid_to: toISO(in60Days),
    is_member_only: false,
    min_rental_days: 1,
    applicable_vehicle_category: ["All"],
    applicable_locations: ["BKK", "DMK", "HKT", "CNX", "UTP", "HDY", "USM", "KBV", "KKC", "UTH", "PHS", "URT"],
    hero_image_url: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&q=80",
    thumbnail_image_url: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=600&q=80",
    is_active: true,
  },
  {
    id: "po-007",
    title: "Weekend Getaway",
    short_description: "Special rates for Friday to Sunday rentals.",
    full_description:
      "Escape for the weekend with our Friday–Sunday special. Save 8% on 2–3 day weekend rentals. Pick up Friday, return Sunday. Available at all downtown and airport locations.",
    discount_type: "percentage",
    discount_value: 8,
    badge_label: "Weekend 8%",
    promotion_type: "Pay Now Discount",
    valid_from: toISO(now),
    valid_to: toISO(in30Days),
    is_member_only: false,
    min_rental_days: 2,
    applicable_vehicle_category: ["Economy", "Compact", "Mid-size", "SUV"],
    applicable_locations: ["All"],
    hero_image_url: "https://images.unsplash.com/photo-1553440569-bcc63803a83d?w=800&q=80",
    thumbnail_image_url: "https://images.unsplash.com/photo-1553440569-bcc63803a83d?w=600&q=80",
    is_active: true,
  },
  {
    id: "po-008",
    title: "Member Double Points",
    short_description: "Earn double Gold Plus Rewards points on your next rental.",
    full_description:
      "Gold Plus Rewards members earn double points on qualifying rentals this month. Points can be redeemed for free rental days. Must be logged in and a Gold Plus member at time of booking.",
    discount_type: "fixed_amount",
    discount_value: 0,
    badge_label: "Member Only",
    promotion_type: "Member Exclusive",
    valid_from: toISO(now),
    valid_to: toISO(in30Days),
    is_member_only: true,
    min_rental_days: 1,
    applicable_vehicle_category: ["All"],
    applicable_locations: ["All"],
    hero_image_url: "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=800&q=80",
    thumbnail_image_url: "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=600&q=80",
    is_active: true,
  },
  {
    id: "po-009",
    title: "SUV Family Pack",
    short_description: "Save 10% on SUV rentals for 5+ days. Space for the whole family.",
    full_description:
      "Planning a family trip? Rent an SUV for 5 days or more and save 10%. Toyota Fortuner, Honda CR-V, and similar models. Perfect for road trips to Chiang Mai, Phuket, or the mountains.",
    discount_type: "percentage",
    discount_value: 10,
    badge_label: "10% SUV",
    promotion_type: "Long Rental Deal",
    valid_from: toISO(now),
    valid_to: toISO(in60Days),
    is_member_only: false,
    min_rental_days: 5,
    applicable_vehicle_category: ["SUV"],
    applicable_locations: ["All"],
    hero_image_url: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&q=80",
    thumbnail_image_url: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=600&q=80",
    is_active: true,
  },
  {
    id: "po-010",
    title: "Hybrid Eco Savings",
    short_description: "15% off hybrid vehicles. Lower fuel cost, lower emissions.",
    full_description:
      "Drive a Toyota Camry Hybrid or Corolla Cross Hybrid and save 15%. Hybrid vehicles offer excellent fuel economy for city and highway driving. Available at major locations across Thailand.",
    discount_type: "percentage",
    discount_value: 15,
    badge_label: "15% Hybrid",
    promotion_type: "EV Promotion",
    valid_from: toISO(now),
    valid_to: toISO(in90Days),
    is_member_only: false,
    min_rental_days: 2,
    applicable_vehicle_category: ["Hybrid"],
    applicable_locations: ["All"],
    hero_image_url: "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=800&q=80",
    thumbnail_image_url: "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=600&q=80",
    is_active: true,
  },
  {
    id: "po-011",
    title: "Phuket Airport Welcome",
    short_description: "10% off when you pick up at Phuket International Airport.",
    full_description:
      "Land in Phuket and drive away with savings. Get 10% off your rental when you pick up at Phuket International Airport. Perfect for beach holidays and island exploration.",
    discount_type: "percentage",
    discount_value: 10,
    badge_label: "Phuket 10%",
    promotion_type: "Airport Special",
    valid_from: toISO(now),
    valid_to: toISO(in60Days),
    is_member_only: false,
    min_rental_days: 1,
    applicable_vehicle_category: ["All"],
    applicable_locations: ["HKT"],
    hero_image_url: "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=800&q=80",
    thumbnail_image_url: "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=600&q=80",
    is_active: true,
  },
  {
    id: "po-012",
    title: "Long Stay Monthly Rate",
    short_description: "Extended rental? Get our best monthly rate. Up to 20% off.",
    full_description:
      "Need a car for a month or more? Our extended rental program offers up to 20% off for rentals of 28 days or longer. Ideal for expats, project assignments, or long vacations.",
    discount_type: "percentage",
    discount_value: 20,
    badge_label: "20% Monthly",
    promotion_type: "Long Rental Deal",
    valid_from: toISO(now),
    valid_to: toISO(in90Days),
    is_member_only: false,
    min_rental_days: 28,
    applicable_vehicle_category: ["Economy", "Compact", "Mid-size"],
    applicable_locations: ["All"],
    hero_image_url: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80",
    thumbnail_image_url: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&q=80",
    is_active: true,
  },
  {
    id: "po-013",
    title: "Limited Time Flash Sale",
    short_description: "Pay now and save 15% on select Economy and Compact cars.",
    full_description:
      "Flash sale: 15% off when you pay at booking. Applies to Economy and Compact categories only. Limited availability. Book now to lock in this rate.",
    discount_type: "percentage",
    discount_value: 15,
    badge_label: "Limited Time",
    promotion_type: "Pay Now Discount",
    valid_from: toISO(now),
    valid_to: toISO(in30Days),
    is_member_only: false,
    min_rental_days: 1,
    applicable_vehicle_category: ["Economy", "Compact"],
    applicable_locations: ["All"],
    hero_image_url: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800&q=80",
    thumbnail_image_url: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=600&q=80",
    is_active: true,
  },
];

/** Per-offer translations for th and zh. en uses base SPECIAL_OFFERS. */
const OFFER_TRANSLATIONS: Record<
  MockLocale,
  Partial<Record<string, { title: string; short_description: string; full_description: string; badge_label: string }>>
> = {
  en: {},
  th: {
    "po-001": {
      title: "ชำระล่วงหน้า ลด 10%",
      short_description: "จองและชำระล่วงหน้าเพื่ออัตราค่าบริการที่ดีที่สุด",
      full_description: "เมื่อจองและชำระเงินตอนทำการจอง คุณจะได้ส่วนลด 10% จากอัตราฐาน ใช้ได้ทุกประเภทรถ ไม่ต้องใช้คูปอง—เลือกชำระทันทีที่เช็คเอาท์",
      badge_label: "ลด 10%",
    },
    "po-002": {
      title: "โปรเช่าสัปดาห์",
      short_description: "เช่า 7 วันขึ้นไป ลดสูงสุด 15% เหมาะสำหรับเที่ยวยาว",
      full_description: "วางแผนเที่ยวสัปดาห์? เช่า 7 วันขึ้นไป ลดสูงสุด 15% ใช้กับรถเศรษฐกิจ คอมแพ็กต์ กลาง",
      badge_label: "ลดสูงสุด 15%",
    },
    "po-003": {
      title: "Gold Plus อัปเกรดฟรี",
      short_description: "สมาชิก Gold Plus ได้อัปเกรดระดับรถฟรีหนึ่งขั้น",
      full_description: "สมาชิก Gold Plus Rewards ได้รับการอัปเกรดหนึ่งระดับฟรีที่สาขาที่ร่วมรายการ ตามความพร้อมที่รับรถ สมัคร Gold Plus ฟรี",
      badge_label: "เฉพาะสมาชิก",
    },
    "po-004": {
      title: "จองล่วงหน้า รับส่วนลดเพิ่ม 5%",
      short_description: "จองก่อนรับรถ 30 วัน รับส่วนลดเพิ่ม 5%",
      full_description: "จองล่วงหน้าอย่างน้อย 30 วันก่อนรับรถ รับส่วนลด 5% เพิ่มจากอัตราฐาน ใช้ร่วมกับโปรชำระล่วงหน้าได้",
      badge_label: "จองล่วงหน้า",
    },
    "po-005": {
      title: "โปร EV ลด 12%",
      short_description: "ลด 12% เมื่อเช่ารถไฟฟ้า",
      full_description: "ขับรถ EV เช่น BYD Atto 3, MG4 ลด 12% มีสายชาร์จให้ ใช้ได้ที่สนามบินและในเมือง",
      badge_label: "ลด 12% EV",
    },
    "po-006": {
      title: "โปรรับที่สนามบิน",
      short_description: "อัตราพิเศษเมื่อรับรถที่สนามบินในประเทศไทย",
      full_description: "รับรถที่สุวรรณภูมิ ดอนเมือง ภูเก็ต เชียงใหม่ หรือสนามบินอื่น รับอัตราพิเศษ คืนรถที่สาขาใดก็ได้ในวันเดียวกันไม่คิดค่าเพิ่ม",
      badge_label: "โปรสนามบิน",
    },
    "po-007": {
      title: "เที่ยวสุดสัปดาห์",
      short_description: "อัตราพิเศษเช่าศุกร์–อาทิตย์",
      full_description: "เช่า 2–3 วันศุกร์–อาทิตย์ ลด 8% รับรถศุกร์ คืนอาทิตย์ ใช้ได้ทุกสาขา",
      badge_label: "สุดสัปดาห์ 8%",
    },
    "po-008": {
      title: "สมาชิกได้คะแนน x2",
      short_description: "รับคะแนน Gold Plus x2 ในการเช่าครั้งถัดไป",
      full_description: "สมาชิก Gold Plus รับคะแนนสองเท่าในการเช่าที่เข้าร่วม ต้องล็อกอินและเป็นสมาชิก Gold Plus ตอนจอง",
      badge_label: "เฉพาะสมาชิก",
    },
    "po-009": {
      title: "โปร SUV ครอบครัว",
      short_description: "เช่า SUV 5 วันขึ้นไป ลด 10%",
      full_description: "เที่ยวกับครอบครัว? เช่า SUV 5 วันขึ้นไป ลด 10% Toyota Fortuner, Honda CR-V ฯลฯ",
      badge_label: "10% SUV",
    },
    "po-010": {
      title: "ไฮบริด ลด 15%",
      short_description: "ลด 15% รถไฮบริด ประหยัดน้ำมัน ลดการปล่อยมลพิษ",
      full_description: "ขับ Toyota Camry Hybrid หรือ Corolla Cross Hybrid ลด 15% รถไฮบริดประหยัดน้ำมัน ใช้ได้ที่สาขาหลักทั่วไทย",
      badge_label: "15% ไฮบริด",
    },
    "po-011": {
      title: "โปรภูเก็ต สนามบิน",
      short_description: "ลด 10% เมื่อรับรถที่สนามบินภูเก็ต",
      full_description: "ลงภูเก็ตแล้วขับต่อด้วยส่วนลด 10% เมื่อรับรถที่สนามบินภูเก็ต เหมาะสำหรับเที่ยวทะเล",
      badge_label: "ภูเก็ต 10%",
    },
    "po-012": {
      title: "อัตรารายเดือน เช่านาน",
      short_description: "เช่าขยายระยะ? อัตรารายเดือน ลดสูงสุด 20%",
      full_description: "ต้องการรถเป็นเดือนหรือมากกว่า? โปรเช่าขยายระยะลดสูงสุด 20% สำหรับเช่า 28 วันขึ้นไป เหมาะกับชาวต่างชาติ หรือเที่ยวยาว",
      badge_label: "20% รายเดือน",
    },
    "po-013": {
      title: "แฟลชเซลล์ จำกัดเวลา",
      short_description: "ชำระทันที ลด 15% รถเศรษฐกิจและคอมแพ็กต์",
      full_description: "แฟลชเซลล์: ลด 15% เมื่อชำระตอนจอง ใช้กับเศรษฐกิจและคอมแพ็กต์เท่านั้น มีจำนวนจำกัด จองเลยเพื่อล็อคราคา",
      badge_label: "จำกัดเวลา",
    },
  },
  zh: {
    "po-001": {
      title: "立即支付省 10%",
      short_description: "提前预订并支付，享受最优惠租金。",
      full_description: "在预订时支付，可享基础租金 10% 折扣。适用于所有车型，无需优惠码——结账时选择立即支付即可。",
      badge_label: "省 10%",
    },
    "po-002": {
      title: "周租优惠",
      short_description: "租 7 天及以上省最多 15%，适合长途旅行。",
      full_description: "计划一周行程？租 7 天及以上可省最多 15%。适用于经济型、紧凑型、中型车。至少连续租 7 天。",
      badge_label: "省最多 15%",
    },
    "po-003": {
      title: "Gold Plus 免费升级",
      short_description: "Gold Plus 会员可享免费车型升级一档。",
      full_description: "Gold Plus Rewards 会员在参与门店可享免费一档车型升级，视取车时供应情况而定。免费加入 Gold Plus。",
      badge_label: "仅会员",
    },
    "po-004": {
      title: "提前预订额外省 5%",
      short_description: "提前 30 天预订，额外省 5%。",
      full_description: "至少提前 30 天取车预订，可在基础费率上再享 5% 折扣。可与立即支付折扣叠加。",
      badge_label: "提前预订",
    },
    "po-005": {
      title: "电动车专享省 12%",
      short_description: "电动车租赁省 12%。",
      full_description: "租 BYD Atto 3、MG4 等电动车省 12%。含充电线。主要机场及市区门店可用。",
      badge_label: "省 12% 电动车",
    },
    "po-006": {
      title: "机场取车专享",
      short_description: "在泰国任一机场取车享专属价格。",
      full_description: "乘机抵达？在素万那普、廊曼、普吉、清迈等机场取车享专属价格。同日还至任意 Hertz 门店无额外费用。",
      badge_label: "机场专享",
    },
    "po-007": {
      title: "周末短途",
      short_description: "周五至周日租赁特价。",
      full_description: "周五至周日 2–3 天租赁省 8%。周五取车、周日还车。所有市区及机场门店可用。",
      badge_label: "周末 8%",
    },
    "po-008": {
      title: "会员双倍积分",
      short_description: "下次租赁赚取双倍 Gold Plus 积分。",
      full_description: "Gold Plus 会员本月符合条件租赁可获双倍积分。积分可兑换免租日。须在预订时登录并为 Gold Plus 会员。",
      badge_label: "仅会员",
    },
    "po-009": {
      title: "SUV 家庭套餐",
      short_description: "SUV 租 5 天及以上省 10%。",
      full_description: "家庭出游？租 SUV 5 天及以上省 10%。Toyota Fortuner、Honda CR-V 等。适合清迈、普吉或山区自驾。",
      badge_label: "10% SUV",
    },
    "po-010": {
      title: "混动省 15%",
      short_description: "混动车省 15%，省油减排。",
      full_description: "租 Toyota Camry Hybrid 或 Corolla Cross Hybrid 省 15%。混动车城郊均省油。泰国主要门店可用。",
      badge_label: "15% 混动",
    },
    "po-011": {
      title: "普吉机场欢迎礼",
      short_description: "普吉国际机场取车省 10%。",
      full_description: "抵达普吉即享省 10%。在普吉国际机场取车可享 10% 折扣。适合海滩与海岛游。",
      badge_label: "普吉 10%",
    },
    "po-012": {
      title: "长租月付价",
      short_description: "长租？享受最优月租价，省最多 20%。",
      full_description: "需要租一个月或更久？长租计划 28 天及以上省最多 20%。适合外派、项目或长假。",
      badge_label: "20% 月租",
    },
    "po-013": {
      title: "限时闪购",
      short_description: "立即支付，精选经济型/紧凑型省 15%。",
      full_description: "闪购：预订时支付省 15%。仅限经济型与紧凑型。数量有限，立即预订锁定价格。",
      badge_label: "限时",
    },
  },
};

export function getSpecialOffers(locale?: MockLocale): SpecialOffer[] {
  const effectiveLocale = locale && (locale === "en" || locale === "th" || locale === "zh") ? locale : "en";
  const t = OFFER_TRANSLATIONS[effectiveLocale];
  if (!t || Object.keys(t).length === 0) return [...SPECIAL_OFFERS];
  return SPECIAL_OFFERS.map((offer) => {
    const over = t[offer.id];
    if (!over) return { ...offer };
    return {
      ...offer,
      title: over.title,
      short_description: over.short_description,
      full_description: over.full_description,
      badge_label: over.badge_label,
    };
  });
}
