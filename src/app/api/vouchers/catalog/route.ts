import { NextRequest } from "next/server";

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

export async function GET(_request: NextRequest) {
  return Response.json({ vouchers: MOCK_CATALOG });
}
