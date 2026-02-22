export type DiscountType = "percentage" | "fixed_amount";
export type PromotionType =
  | "Pay Now Discount"
  | "Long Rental Deal"
  | "Member Exclusive"
  | "Airport Special"
  | "Early Bird"
  | "EV Promotion";

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
