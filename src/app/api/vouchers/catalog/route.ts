import { NextRequest } from "next/server";
import { getLocaleFromRequest } from "@/lib/request-locale";
import type { ApiLocale } from "@/lib/request-locale";

export type VoucherCatalogType = "FIXED" | "PERCENT" | "BENEFIT";
export type VoucherCatalogCategory = "gift" | "travel" | "corporate";

/** Badge shown on card: DISCOUNT | GIFT VALUE | FREE ADD-ON | SERVICE WAIVER | INSURANCE */
export type ProductCategoryBadge =
  | "DISCOUNT"
  | "GIFT VALUE"
  | "FREE ADD-ON"
  | "SERVICE WAIVER"
  | "INSURANCE";

/** Visual tile style — each has its own SVG/CSS design, no car photos */
export type CardStyle =
  | "fixed_value"
  | "percent"
  | "child_seat"
  | "gps"
  | "easy_pass"
  | "additional_driver"
  | "insurance"
  | "drop_fee"
  | "upgrade";

export interface VoucherCatalogItem {
  id: string;
  title: string;
  description: string;
  /** For FIXED/PERCENT; for BENEFIT may be 0 or omitted */
  value: number;
  selling_price: number;
  type: VoucherCatalogType;
  validity_days: number;
  transferable: boolean;
  category: VoucherCatalogCategory;
  product_category: ProductCategoryBadge;
  card_style: CardStyle;
  terms?: string;
  usage_rules?: string;
  featured?: boolean;
}

const MOCK_CATALOG: VoucherCatalogItem[] = [
  {
    id: "gv2000",
    title: "฿2,000 Travel Voucher",
    description:
      "Use towards any car rental at Hertz Thailand. Valid at all airport and downtown locations.",
    value: 2000,
    selling_price: 1800,
    type: "FIXED",
    validity_days: 365,
    transferable: true,
    category: "travel",
    product_category: "GIFT VALUE",
    card_style: "fixed_value",
    terms: "Valid for one year from purchase. Non-refundable.",
    usage_rules: "Present at time of rental. One voucher per rental.",
    featured: true,
  },
  {
    id: "gv5000",
    title: "฿5,000 Gift Voucher",
    description:
      "Premium gift voucher for car rental. Perfect for corporate rewards or special occasions.",
    value: 5000,
    selling_price: 4500,
    type: "FIXED",
    validity_days: 365,
    transferable: true,
    category: "gift",
    product_category: "GIFT VALUE",
    card_style: "fixed_value",
    featured: true,
  },
  {
    id: "discount15",
    title: "15% Rental Discount Voucher",
    description: "15% off your next rental. Applicable to base rate only. Minimum 2-day rental.",
    value: 15,
    selling_price: 499,
    type: "PERCENT",
    validity_days: 180,
    transferable: false,
    category: "gift",
    product_category: "DISCOUNT",
    card_style: "percent",
    featured: true,
  },
  {
    id: "gv1000",
    title: "฿1,000 Travel Voucher",
    description: "฿1,000 value towards rental. Ideal for short trips and city rentals.",
    value: 1000,
    selling_price: 950,
    type: "FIXED",
    validity_days: 365,
    transferable: true,
    category: "travel",
    product_category: "GIFT VALUE",
    card_style: "fixed_value",
    featured: true,
  },
  {
    id: "discount20",
    title: "20% Rental Discount Voucher",
    description: "Save 20% on your next rental. Valid for rentals of 3 days or more.",
    value: 20,
    selling_price: 699,
    type: "PERCENT",
    validity_days: 180,
    transferable: false,
    category: "corporate",
    product_category: "DISCOUNT",
    card_style: "percent",
  },
  {
    id: "corp3000",
    title: "฿3,000 Corporate Voucher",
    description: "For business travel and fleet. Bulk redemption available.",
    value: 3000,
    selling_price: 2700,
    type: "FIXED",
    validity_days: 365,
    transferable: true,
    category: "corporate",
    product_category: "GIFT VALUE",
    card_style: "fixed_value",
  },
  // Benefit products — sellable vouchers with own card designs
  {
    id: "free-child-seat",
    title: "Free Child Seat Voucher",
    description: "Redeem for one free child seat for the duration of your rental.",
    value: 0,
    selling_price: 199,
    type: "BENEFIT",
    validity_days: 365,
    transferable: false,
    category: "gift",
    product_category: "FREE ADD-ON",
    card_style: "child_seat",
    featured: true,
  },
  {
    id: "free-gps",
    title: "Free GPS Voucher",
    description: "Redeem for free GPS navigation unit with your rental.",
    value: 0,
    selling_price: 149,
    type: "BENEFIT",
    validity_days: 365,
    transferable: false,
    category: "gift",
    product_category: "FREE ADD-ON",
    card_style: "gps",
    featured: true,
  },
  {
    id: "free-easy-pass",
    title: "Free Easy Pass Voucher",
    description: "Redeem for free Easy Pass (toll box) with your rental.",
    value: 0,
    selling_price: 99,
    type: "BENEFIT",
    validity_days: 365,
    transferable: false,
    category: "gift",
    product_category: "FREE ADD-ON",
    card_style: "easy_pass",
  },
  {
    id: "free-additional-driver",
    title: "Free Additional Driver Voucher",
    description: "Add one additional driver at no extra cost.",
    value: 0,
    selling_price: 299,
    type: "BENEFIT",
    validity_days: 365,
    transferable: false,
    category: "gift",
    product_category: "FREE ADD-ON",
    card_style: "additional_driver",
  },
  {
    id: "free-premium-insurance",
    title: "Free Premium Insurance Upgrade",
    description: "Upgrade to premium insurance coverage at no extra cost.",
    value: 0,
    selling_price: 499,
    type: "BENEFIT",
    validity_days: 365,
    transferable: false,
    category: "gift",
    product_category: "INSURANCE",
    card_style: "insurance",
    featured: true,
  },
  {
    id: "free-drop-fee",
    title: "Free One-way Drop Fee",
    description: "Waive one-way drop fee. Return your car to a different location.",
    value: 0,
    selling_price: 399,
    type: "BENEFIT",
    validity_days: 365,
    transferable: false,
    category: "travel",
    product_category: "SERVICE WAIVER",
    card_style: "drop_fee",
  },
  {
    id: "free-vehicle-upgrade",
    title: "Free Vehicle Class Upgrade",
    description: "Complimentary upgrade to the next vehicle class.",
    value: 0,
    selling_price: 699,
    type: "BENEFIT",
    validity_days: 365,
    transferable: false,
    category: "gift",
    product_category: "SERVICE WAIVER",
    card_style: "upgrade",
    featured: true,
  },
];

/** Localized title, description, terms, usage_rules by voucher id. */
const CATALOG_TRANSLATIONS: Record<
  ApiLocale,
  Record<string, { title?: string; description?: string; terms?: string; usage_rules?: string }>
> = {
  en: {},
  th: {
    gv2000: {
      title: "บัตรท่องเที่ยว ฿2,000",
      description: "ใช้เป็นส่วนลดค่าเช่ารถที่ Hertz Thailand ได้ทุกสาขาสนามบินและในเมือง",
      terms: "ใช้ได้ 1 ปี นับจากวันซื้อ ไม่สามารถขอคืนเงินได้",
      usage_rules: "แสดงบัตรตอนเช่า ใช้ได้ 1 บัตรต่อ 1 การเช่า",
    },
    gv5000: {
      title: "บัตรของขวัญ ฿5,000",
      description: "บัตรของขวัญพรีเมียมสำหรับเช่ารถ เหมาะเป็นของขวัญองค์กรหรือโอกาสพิเศษ",
    },
    discount15: {
      title: "บัตรส่วนลด 15%",
      description: "ส่วนลด 15% สำหรับการเช่าครั้งถัดไป ใช้กับอัตราฐานเท่านั้น ขั้นต่ำ 2 วัน",
    },
    gv1000: {
      title: "บัตรท่องเที่ยว ฿1,000",
      description: "มูลค่า ฿1,000 สำหรับค่าเช่า เหมาะสำหรับเที่ยวสั้นและเช่าในเมือง",
    },
    discount20: {
      title: "บัตรส่วนลด 20%",
      description: "ประหยัด 20% ในการเช่าครั้งถัดไป ใช้ได้กับการเช่า 3 วันขึ้นไป",
    },
    corp3000: {
      title: "บัตรองค์กร ฿3,000",
      description: "สำหรับการเดินทางธุรกิจและพ fleet ใช้ Redeem แบบจำนวนมากได้",
    },
    "free-child-seat": {
      title: "บัตรที่นั่งเด็กฟรี",
      description: "แลกที่นั่งเด็กฟรี 1 ตัว ตลอดระยะเวลาการเช่า",
    },
    "free-gps": {
      title: "บัตร GPS ฟรี",
      description: "แลกเครื่องนำทาง GPS ฟรีในการเช่าของคุณ",
    },
    "free-easy-pass": {
      title: "บัตร Easy Pass ฟรี",
      description: "แลก Easy Pass (กล่องเก็บค่าทางด่วน) ฟรีในการเช่าของคุณ",
    },
    "free-additional-driver": {
      title: "บัตรคนขับเพิ่มฟรี",
      description: "เพิ่มคนขับเพิ่ม 1 คนโดยไม่คิดค่าใช้จ่าย",
    },
    "free-premium-insurance": {
      title: "บัตรประกันพรีเมียมฟรี",
      description: "อัปเกรดเป็นประกันพรีเมียมโดยไม่คิดค่าใช้จ่ายเพิ่ม",
    },
    "free-drop-fee": {
      title: "บัตรค่าคืนคนละจุดฟรี",
      description: "ยกเว้นค่าคืนคนละจุด 1 ครั้ง คืนรถที่สาขาอื่นได้",
    },
    "free-vehicle-upgrade": {
      title: "บัตรอัปเกรดระดับรถฟรี",
      description: "อัปเกรดระดับรถฟรีหนึ่งขั้น",
    },
  },
  zh: {
    gv2000: {
      title: "฿2,000 旅行礼券",
      description: "可在 Hertz Thailand 任意门店使用，适用于机场及市区。",
      terms: "自购买日起一年内有效，不可退款。",
      usage_rules: "取车时出示，每次租赁限用一张。",
    },
    gv5000: {
      title: "฿5,000 礼品券",
      description: "高端租车礼品券，适合企业礼品或特殊场合。",
    },
    discount15: {
      title: "15% 租车折扣券",
      description: "下次租车享 15% 折扣，仅限基础费率，最少租 2 天。",
    },
    gv1000: {
      title: "฿1,000 旅行礼券",
      description: "价值 ฿1,000 可用于租金，适合短途及市内租车。",
    },
    discount20: {
      title: "20% 租车折扣券",
      description: "下次租车省 20%，适用于 3 天及以上租赁。",
    },
    corp3000: {
      title: "฿3,000 企业券",
      description: "适用于商务出行及车队，可批量兑换。",
    },
    "free-child-seat": {
      title: "免费儿童座椅券",
      description: "可兑换一个免费儿童座椅，租期内有效。",
    },
    "free-gps": {
      title: "免费 GPS 券",
      description: "可兑换免费 GPS 导航设备。",
    },
    "free-easy-pass": {
      title: "免费 Easy Pass 券",
      description: "可兑换免费 Easy Pass（电子收费盒）。",
    },
    "free-additional-driver": {
      title: "免费增驾员券",
      description: "免费增加一名驾驶员。",
    },
    "free-premium-insurance": {
      title: "免费升级保险券",
      description: "免费升级至高端保险。",
    },
    "free-drop-fee": {
      title: "免异地还车费券",
      description: "免一次异地还车费，可还至其他门店。",
    },
    "free-vehicle-upgrade": {
      title: "免费车型升级券",
      description: "免费升级至上一级车型。",
    },
  },
};

function getLocalizedCatalog(locale: ApiLocale): VoucherCatalogItem[] {
  const t = CATALOG_TRANSLATIONS[locale] ?? CATALOG_TRANSLATIONS.en;
  return MOCK_CATALOG.map((item) => {
    const overrides = t[item.id];
    if (!overrides) return item;
    return {
      ...item,
      title: overrides.title ?? item.title,
      description: overrides.description ?? item.description,
      terms: overrides.terms !== undefined ? overrides.terms : item.terms,
      usage_rules: overrides.usage_rules !== undefined ? overrides.usage_rules : item.usage_rules,
    };
  });
}

export async function GET(request: NextRequest) {
  const locale = getLocaleFromRequest(request);
  const vouchers = getLocalizedCatalog(locale);
  return Response.json({ vouchers });
}
