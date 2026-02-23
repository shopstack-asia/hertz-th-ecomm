import type {
  Location,
  SearchResultVehicleGroup,
  VehicleDetail,
  Reservation,
  PricingBreakdown,
} from "@/types";
import { getBasePrices as getSearchVehicleBasePrices } from "./searchVehicles";

/** Unsplash placeholder URLs for vehicle images (economy, compact, sedan, suv, luxury) */
const IMAGES = {
  economy:
    "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=600&q=80",
  compact:
    "https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=600&q=80",
  sedan:
    "https://images.unsplash.com/photo-1553440569-bcc63803a83d?w=600&q=80",
  suv:
    "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=600&q=80",
  luxury:
    "https://images.unsplash.com/photo-1619767886558-efdc259cde1a?w=600&q=80",
  van:
    "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600&q=80",
  hybrid:
    "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=600&q=80",
  ev:
    "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=600&q=80",
  pickup:
    "https://images.unsplash.com/photo-1527786356703-4b100091cd2c?w=600&q=80",
};

export const mockLocations: Location[] = [
  {
    code: "BKK",
    name: "Bangkok Suvarnabhumi Airport",
    city: "Bangkok",
    address: "999 Moo 1, Nong Prue, Bang Phli, Samut Prakan 10540",
  },
  {
    code: "DMK",
    name: "Bangkok Don Mueang Airport",
    city: "Bangkok",
    address: "222 Don Mueang, Bangkok 10210",
  },
  {
    code: "CNX",
    name: "Chiang Mai International Airport",
    city: "Chiang Mai",
    address: "60 Mahidol Rd, Suthep, Mueang Chiang Mai 50200",
  },
  {
    code: "HKT",
    name: "Phuket International Airport",
    city: "Phuket",
    address: "222 Moo 6, Mai Khao, Thalang, Phuket 83110",
  },
  {
    code: "UTP",
    name: "Pattaya (U-Tapao)",
    city: "Pattaya",
    address: "Na Kluea, Bang Lamung, Chonburi 20150",
  },
  {
    code: "HDY",
    name: "Hat Yai International Airport",
    city: "Hat Yai",
    address: "99 Sanambin Nam, Khlong Hoi Khong, Songkhla 90115",
  },
  {
    code: "KKC",
    name: "Khon Kaen Airport",
    city: "Khon Kaen",
    address: "Ban Ped, Mueang Khon Kaen, Khon Kaen 40000",
  },
  {
    code: "UTH",
    name: "Udon Thani International Airport",
    city: "Udon Thani",
    address: "Ban Mai, Mueang Udon Thani, Udon Thani 41000",
  },
];

export const mockVehicleGroups: Record<string, VehicleDetail> = {
  ECAR: {
    groupCode: "ECAR",
    name: "Toyota Yaris or similar",
    category: "Economy",
    seats: 5,
    transmission: "A",
    luggage: "2 large suitcases",
    description:
      "Fuel-efficient economy car ideal for city driving and short trips. Compact yet comfortable with modern amenities.",
    images: [
      { url: IMAGES.economy, alt: "Toyota Yaris Economy Car" },
      { url: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&q=80", alt: "Interior" },
      { url: "https://images.unsplash.com/photo-1542362567-b07e54358753?w=600&q=80", alt: "Rear view" },
    ],
    inclusions: [
      "Unlimited mileage",
      "Third party insurance",
      "Free cancellation up to 24h before pickup",
    ],
    features: ["Air conditioning", "Power steering", "USB port", "ABS"],
    availabilityStatus: "AVAILABLE",
  },
  CARS: {
    groupCode: "CARS",
    name: "Honda City or similar",
    category: "Compact",
    seats: 5,
    transmission: "A",
    luggage: "2 medium + 1 small",
    description:
      "Compact sedan offering excellent fuel economy and maneuverability. Perfect for couples or small families.",
    images: [
      { url: IMAGES.compact, alt: "Honda City Compact Car" },
      { url: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=600&q=80", alt: "Side view" },
      { url: "https://images.unsplash.com/photo-1553440569-bcc63803a83d?w=600&q=80", alt: "Front view" },
    ],
    inclusions: [
      "Unlimited mileage",
      "Collision Damage Waiver (CDW)",
      "Third party insurance",
    ],
    features: ["Air conditioning", "Bluetooth", "Rear camera", "Cruise control"],
    availabilityStatus: "AVAILABLE",
  },
  CDAR: {
    groupCode: "CDAR",
    name: "Toyota Camry or similar",
    category: "Mid-size",
    seats: 5,
    transmission: "A",
    luggage: "3 large suitcases",
    description:
      "Spacious mid-size sedan with premium comfort. Ideal for longer journeys and business travel.",
    images: [
      { url: IMAGES.sedan, alt: "Toyota Camry Mid-size" },
      { url: "https://images.unsplash.com/photo-1502877338535-766e1452684a?w=600&q=80", alt: "Interior" },
      { url: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=600&q=80", alt: "Dashboard" },
    ],
    inclusions: [
      "Unlimited mileage",
      "CDW",
      "Personal Accident Insurance (PAI)",
      "Free cancellation",
    ],
    features: [
      "Dual-zone AC",
      "Leather seats",
      "Bluetooth",
      "Cruise control",
      "Push-button start",
    ],
    availabilityStatus: "AVAILABLE",
  },
  SFAR: {
    groupCode: "SFAR",
    name: "Toyota Fortuner or similar",
    category: "SUV",
    seats: 7,
    transmission: "A",
    luggage: "5 large suitcases",
    description:
      "Rugged SUV with seven seats. Perfect for family adventures and road trips across Thailand.",
    images: [
      { url: IMAGES.suv, alt: "Toyota Fortuner SUV" },
      { url: "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=600&q=80", alt: "Side view" },
      { url: "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=600&q=80", alt: "Interior" },
    ],
    inclusions: [
      "Unlimited mileage",
      "CDW",
      "PAI",
      "Free cancellation",
    ],
    features: [
      "4WD",
      "Air conditioning",
      "Bluetooth",
      "Cruise control",
      "Third-row seats",
    ],
    availabilityStatus: "AVAILABLE",
  },
  PCAR: {
    groupCode: "PCAR",
    name: "Toyota Camry Hybrid or similar",
    category: "Premium",
    seats: 5,
    transmission: "A",
    luggage: "3 large suitcases",
    description:
      "Premium sedan with hybrid efficiency. Executive comfort with reduced fuel consumption.",
    images: [
      { url: IMAGES.luxury, alt: "Toyota Camry Hybrid Premium" },
      { url: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=600&q=80", alt: "Interior" },
      { url: "https://images.unsplash.com/photo-1619767886558-efdc259cde1a?w=600&q=80", alt: "Exterior" },
    ],
    inclusions: [
      "Unlimited mileage",
      "CDW",
      "PAI",
      "Free cancellation",
      "Priority service",
    ],
    features: [
      "Hybrid engine",
      "Leather interior",
      "Sunroof",
      "Navigation",
      "Premium sound system",
    ],
    availabilityStatus: "AVAILABLE",
  },
  LCAR: {
    groupCode: "LCAR",
    name: "BMW 5 Series or similar",
    category: "Luxury",
    seats: 5,
    transmission: "A",
    luggage: "3 large suitcases",
    description:
      "Executive luxury sedan. Premium materials, advanced technology, and exceptional driving experience.",
    images: [
      { url: IMAGES.luxury, alt: "BMW 5 Series Luxury" },
      { url: "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=600&q=80", alt: "Interior" },
      { url: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=600&q=80", alt: "Dashboard" },
    ],
    inclusions: [
      "Unlimited mileage",
      "Full coverage insurance",
      "PAI",
      "Free cancellation",
      "Concierge service",
    ],
    features: [
      "Leather upholstery",
      "Heated seats",
      "Adaptive cruise control",
      "Head-up display",
      "Wireless charging",
    ],
    availabilityStatus: "AVAILABLE",
  },
  MVAR: {
    groupCode: "MVAR",
    name: "Toyota Commuter or similar",
    category: "Van",
    seats: 11,
    transmission: "A",
    luggage: "8 large suitcases",
    description:
      "Spacious van for group travel. Ideal for airport transfers, corporate events, and family excursions.",
    images: [
      { url: IMAGES.van, alt: "Toyota Commuter Van" },
      { url: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600&q=80", alt: "Side view" },
      { url: "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=600&q=80", alt: "Interior" },
    ],
    inclusions: [
      "Unlimited mileage",
      "CDW",
      "PAI",
      "Driver optional",
    ],
    features: [
      "Air conditioning",
      "Multiple USB ports",
      "Spacious cabin",
      "Rear cargo space",
    ],
    availabilityStatus: "LIMITED",
  },
  HCAR: {
    groupCode: "HCAR",
    name: "Toyota Corolla Cross Hybrid",
    category: "Hybrid",
    seats: 5,
    transmission: "A",
    luggage: "3 large suitcases",
    description:
      "Eco-friendly hybrid crossover. Lower emissions and fuel costs without compromising comfort.",
    images: [
      { url: IMAGES.hybrid, alt: "Toyota Corolla Cross Hybrid" },
      { url: "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=600&q=80", alt: "Side view" },
      { url: "https://images.unsplash.com/photo-1619767886558-efdc259cde1a?w=600&q=80", alt: "Interior" },
    ],
    inclusions: [
      "Unlimited mileage",
      "CDW",
      "PAI",
      "Free cancellation",
    ],
    features: [
      "Hybrid powertrain",
      "Regenerative braking",
      "Eco mode",
      "Bluetooth",
      "Rear camera",
    ],
    availabilityStatus: "AVAILABLE",
  },
  EVAR: {
    groupCode: "EVAR",
    name: "BYD Atto 3 or similar",
    category: "EV",
    seats: 5,
    transmission: "A",
    luggage: "3 large suitcases",
    description:
      "Full electric vehicle. Zero emissions with ample range for city and regional travel.",
    images: [
      { url: IMAGES.ev, alt: "BYD Atto 3 Electric Vehicle" },
      { url: "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=600&q=80", alt: "Charging" },
      { url: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=600&q=80", alt: "Dashboard" },
    ],
    inclusions: [
      "Unlimited mileage",
      "CDW",
      "PAI",
      "Free cancellation",
      "Charging cable included",
    ],
    features: [
      "Electric motor",
      "~400km range",
      "Fast charging compatible",
      "Touchscreen infotainment",
      "Regen braking",
    ],
    availabilityStatus: "LIMITED",
  },
  PTAR: {
    groupCode: "PTAR",
    name: "Toyota Hilux Revo or similar",
    category: "Pickup",
    seats: 5,
    transmission: "A",
    luggage: "4 large suitcases + cargo bed",
    description:
      "Rugged pickup truck. Ideal for construction, agriculture, or adventure trips with cargo.",
    images: [
      { url: IMAGES.pickup, alt: "Toyota Hilux Pickup" },
      { url: "https://images.unsplash.com/photo-1527786356703-4b100091cd2c?w=600&q=80", alt: "Cargo bed" },
      { url: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=600&q=80", alt: "Exterior" },
    ],
    inclusions: [
      "Unlimited mileage",
      "CDW",
      "PAI",
      "Free cancellation",
    ],
    features: [
      "4WD available",
      "Air conditioning",
      "Bluetooth",
      "Cruise control",
      "Towing capacity",
    ],
    availabilityStatus: "AVAILABLE",
  },
};

const basePrices: Record<string, { payLater: number; payNow: number }> = {
  ECAR: { payLater: 1200, payNow: 1080 },
  CARS: { payLater: 1500, payNow: 1350 },
  CDAR: { payLater: 2000, payNow: 1800 },
  SFAR: { payLater: 3500, payNow: 3150 },
  PCAR: { payLater: 4200, payNow: 3780 },
  LCAR: { payLater: 8500, payNow: 7650 },
  MVAR: { payLater: 5500, payNow: 4950 },
  HCAR: { payLater: 2800, payNow: 2520 },
  EVAR: { payLater: 4500, payNow: 4050 },
  PTAR: { payLater: 3200, payNow: 2880 },
};

export function getSearchResults(
  pickup: string,
  dropoff: string,
  pickupAt: string,
  dropoffAt: string
): SearchResultVehicleGroup[] {
  const days = Math.max(
    1,
    Math.ceil(
      (new Date(dropoffAt).getTime() - new Date(pickupAt).getTime()) /
        (24 * 60 * 60 * 1000)
    )
  );
  return Object.values(mockVehicleGroups).map((v) => {
    const base = basePrices[v.groupCode] ?? { payLater: 1500, payNow: 1350 };
    return {
      ...v,
      payLaterPrice: base.payLater * days,
      payNowPrice: base.payNow * days,
      currency: "THB",
      availabilityStatus: v.availabilityStatus ?? "AVAILABLE",
    };
  });
}

function generateReservationNo(): string {
  const seq = Math.floor(1000 + Math.random() * 9000);
  return `HZT2026${seq}`;
}

export const mockReservations: Record<string, Reservation> = {
  HZT20261234: {
    reservationNo: "HZT20261234",
    status: "CONFIRMED",
    bookingType: "PAY_LATER",
    paymentStatus: undefined,
    pickupLocation: "Bangkok Suvarnabhumi Airport",
    pickupAt: new Date(Date.now() + 7 * 86400000).toISOString(),
    dropoffLocation: "Bangkok Suvarnabhumi Airport",
    dropoffAt: new Date(Date.now() + 10 * 86400000).toISOString(),
    vehicleGroupCode: "CDAR",
    vehicleName: "Toyota Camry or similar",
    renterName: "Somchai Srisuk",
    driverName: "Somchai Srisuk",
    contactEmail: "somchai@example.com",
    contactPhone: "+66812345678",
    pricing: {
      lineItems: [{ description: "Rental (3 days)", amount: 6000 }],
      subtotal: 6000,
      vatRate: 0.07,
      vatAmount: 420,
      total: 6420,
      currency: "THB",
    },
  },
  HZT20265678: {
    reservationNo: "HZT20265678",
    status: "CONFIRMED",
    bookingType: "PAY_NOW",
    paymentStatus: "PAID",
    pickupLocation: "Phuket International Airport",
    pickupAt: new Date(Date.now() - 14 * 86400000).toISOString(),
    dropoffLocation: "Phuket International Airport",
    dropoffAt: new Date(Date.now() - 10 * 86400000).toISOString(),
    vehicleGroupCode: "SFAR",
    vehicleName: "Toyota Fortuner or similar",
    renterName: "John Smith",
    contactEmail: "john.smith@example.com",
    contactPhone: "+66898765432",
    pricing: {
      lineItems: [{ description: "Rental (4 days)", amount: 14000 }],
      subtotal: 14000,
      vatRate: 0.07,
      vatAmount: 980,
      total: 14980,
      currency: "THB",
    },
  },
};

export function createMockPricingBreakdown(
  vehicleGroupCode: string,
  days: number,
  voucherCode?: string,
  bookingType?: "PAY_LATER" | "PAY_NOW"
): PricingBreakdown {
  const base =
    basePrices[vehicleGroupCode] ??
    getSearchVehicleBasePrices(vehicleGroupCode) ??
    { payLater: 1500, payNow: 1350 };
  const rate = bookingType === "PAY_NOW" ? base.payNow : base.payLater;
  const subtotal = rate * days;
  const discount = voucherCode === "HERTZ10" ? Math.round(subtotal * 0.1) : 0;
  const afterDiscount = subtotal - discount;
  const vatRate = 0.07;
  const vatAmount = Math.round(afterDiscount * vatRate);
  const total = afterDiscount + vatAmount;

  const lineItems = [
    { description: `Rental (${days} day${days > 1 ? "s" : ""})`, amount: subtotal },
  ];
  if (discount > 0) {
    lineItems.push({
      description: `Voucher ${voucherCode} (10% off)`,
      amount: -discount,
    });
  }

  return {
    lineItems,
    subtotal,
    vatRate,
    vatAmount,
    total,
    currency: "THB",
    discount: discount || undefined,
    voucherCode,
  };
}

export { generateReservationNo };
export { basePrices };

/** Maps booking_ref (e.g. HZT123456) to reservationNo for thank-you lookup */
export const bookingRefToReservationNo: Record<string, string> = {};
