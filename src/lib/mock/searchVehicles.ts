import type { SearchResultVehicleGroup, VehicleDetail } from "@/types";

/** Locale code for API mock responses (en | th | zh). */
export type MockLocale = "en" | "th" | "zh";

/** Category display name by locale (key = English category from seed). */
const CATEGORY_BY_LOCALE: Record<MockLocale, Record<string, string>> = {
  en: {
    Economy: "Economy",
    Compact: "Compact",
    "Mid-size": "Mid-size",
    SUV: "SUV",
    Premium: "Premium",
    Luxury: "Luxury",
    Van: "Van",
    Hybrid: "Hybrid",
    EV: "EV",
    Pickup: "Pickup",
  },
  th: {
    Economy: "เศรษฐกิจ",
    Compact: "คอมแพ็กต์",
    "Mid-size": "กลาง",
    SUV: "SUV",
    Premium: "พรีเมียม",
    Luxury: "ลักชัวรี",
    Van: "แวน",
    Hybrid: "ไฮบริด",
    EV: "EV",
    Pickup: "ปิกอัพ",
  },
  zh: {
    Economy: "经济型",
    Compact: "紧凑型",
    "Mid-size": "中型",
    SUV: "SUV",
    Premium: "高端",
    Luxury: "豪华",
    Van: "厢型",
    Hybrid: "混合动力",
    EV: "电动车",
    Pickup: "皮卡",
  },
};

const INCLUSIONS_BY_LOCALE: Record<MockLocale, string[]> = {
  en: [
    "Unlimited mileage",
    "Third party insurance",
    "Free cancellation up to 24h before pickup",
  ],
  th: [
    "ไมล์จำกัดไม่จำกัด",
    "ประกันภาคบังคับ",
    "ยกเลิกฟรีก่อนรับรถ 24 ชม.",
  ],
  zh: [
    "不限里程",
    "第三方责任险",
    "取车前24小时免费取消",
  ],
};

export interface SearchVehicleSeed {
  id: string;
  groupCode: string;
  name: string;
  category: string;
  transmission: "A" | "M";
  seats: number;
  luggage: string;
  fuelType: string;
  imageUrl: string;
  dailyPayNow: number;
  dailyPayLater: number;
}

/** Seed data for search – 30 unique vehicles across categories */
const VEHICLE_SEEDS: SearchVehicleSeed[] = [
  { id: "v1", groupCode: "ECAR1", name: "Toyota Yaris or similar", category: "Economy", transmission: "A", seats: 5, luggage: "2 large suitcases", fuelType: "Gasoline", imageUrl: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=600&q=80", dailyPayNow: 990, dailyPayLater: 1100 },
  { id: "v2", groupCode: "ECAR2", name: "Honda Brio or similar", category: "Economy", transmission: "A", seats: 5, luggage: "2 medium bags", fuelType: "Gasoline", imageUrl: "https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=600&q=80", dailyPayNow: 1080, dailyPayLater: 1200 },
  { id: "v3", groupCode: "ECAR3", name: "Nissan Almera or similar", category: "Economy", transmission: "M", seats: 5, luggage: "2 large suitcases", fuelType: "Gasoline", imageUrl: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&q=80", dailyPayNow: 900, dailyPayLater: 1000 },
  { id: "v4", groupCode: "ECAR4", name: "Suzuki Ciaz or similar", category: "Economy", transmission: "A", seats: 5, luggage: "2 medium + 1 small", fuelType: "Gasoline", imageUrl: "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=600&q=80", dailyPayNow: 1170, dailyPayLater: 1300 },
  { id: "v5", groupCode: "CCAR1", name: "Honda City or similar", category: "Compact", transmission: "A", seats: 5, luggage: "2 medium + 1 small", fuelType: "Gasoline", imageUrl: "https://images.unsplash.com/photo-1553440569-bcc63803a83d?w=600&q=80", dailyPayNow: 1350, dailyPayLater: 1500 },
  { id: "v6", groupCode: "CCAR2", name: "Toyota Vios or similar", category: "Compact", transmission: "A", seats: 5, luggage: "2 large suitcases", fuelType: "Gasoline", imageUrl: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=600&q=80", dailyPayNow: 1260, dailyPayLater: 1400 },
  { id: "v7", groupCode: "CCAR3", name: "Mazda 2 or similar", category: "Compact", transmission: "A", seats: 5, luggage: "2 large suitcases", fuelType: "Gasoline", imageUrl: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=600&q=80", dailyPayNow: 1530, dailyPayLater: 1700 },
  { id: "v8", groupCode: "CCAR4", name: "Hyundai Accent or similar", category: "Compact", transmission: "M", seats: 5, luggage: "2 medium bags", fuelType: "Gasoline", imageUrl: "https://images.unsplash.com/photo-1502877338535-766e1452684a?w=600&q=80", dailyPayNow: 1080, dailyPayLater: 1200 },
  { id: "v9", groupCode: "MCAR1", name: "Toyota Camry or similar", category: "Mid-size", transmission: "A", seats: 5, luggage: "3 large suitcases", fuelType: "Gasoline", imageUrl: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=600&q=80", dailyPayNow: 1980, dailyPayLater: 2200 },
  { id: "v10", groupCode: "MCAR2", name: "Honda Accord or similar", category: "Mid-size", transmission: "A", seats: 5, luggage: "3 large suitcases", fuelType: "Gasoline", imageUrl: "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=600&q=80", dailyPayNow: 2160, dailyPayLater: 2400 },
  { id: "v11", groupCode: "MCAR3", name: "Mazda 6 or similar", category: "Mid-size", transmission: "A", seats: 5, luggage: "3 large suitcases", fuelType: "Gasoline", imageUrl: "https://images.unsplash.com/photo-1553440569-bcc63803a83d?w=600&q=80", dailyPayNow: 2250, dailyPayLater: 2500 },
  { id: "v12", groupCode: "SUV1", name: "Toyota Fortuner or similar", category: "SUV", transmission: "A", seats: 7, luggage: "5 large suitcases", fuelType: "Diesel", imageUrl: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=600&q=80", dailyPayNow: 3150, dailyPayLater: 3500 },
  { id: "v13", groupCode: "SUV2", name: "Honda CR-V or similar", category: "SUV", transmission: "A", seats: 5, luggage: "4 large suitcases", fuelType: "Gasoline", imageUrl: "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=600&q=80", dailyPayNow: 2700, dailyPayLater: 3000 },
  { id: "v14", groupCode: "SUV3", name: "Mazda CX-5 or similar", category: "SUV", transmission: "A", seats: 5, luggage: "4 large suitcases", fuelType: "Gasoline", imageUrl: "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=600&q=80", dailyPayNow: 2880, dailyPayLater: 3200 },
  { id: "v15", groupCode: "SUV4", name: "Isuzu MU-X or similar", category: "SUV", transmission: "A", seats: 7, luggage: "5 large suitcases", fuelType: "Diesel", imageUrl: "https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=600&q=80", dailyPayNow: 3240, dailyPayLater: 3600 },
  { id: "v16", groupCode: "PCAR1", name: "Toyota Camry Hybrid or similar", category: "Premium", transmission: "A", seats: 5, luggage: "3 large suitcases", fuelType: "Hybrid", imageUrl: "https://images.unsplash.com/photo-1619767886558-efdc259cde1a?w=600&q=80", dailyPayNow: 3780, dailyPayLater: 4200 },
  { id: "v17", groupCode: "PCAR2", name: "Lexus ES or similar", category: "Premium", transmission: "A", seats: 5, luggage: "3 large suitcases", fuelType: "Gasoline", imageUrl: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=600&q=80", dailyPayNow: 4500, dailyPayLater: 5000 },
  { id: "v18", groupCode: "PCAR3", name: "BMW 3 Series or similar", category: "Premium", transmission: "A", seats: 5, luggage: "3 large suitcases", fuelType: "Gasoline", imageUrl: "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=600&q=80", dailyPayNow: 5400, dailyPayLater: 6000 },
  { id: "v19", groupCode: "LCAR1", name: "BMW 5 Series or similar", category: "Luxury", transmission: "A", seats: 5, luggage: "3 large suitcases", fuelType: "Gasoline", imageUrl: "https://images.unsplash.com/photo-1619767886558-efdc259cde1a?w=600&q=80", dailyPayNow: 6750, dailyPayLater: 7500 },
  { id: "v20", groupCode: "LCAR2", name: "Mercedes-Benz E-Class or similar", category: "Luxury", transmission: "A", seats: 5, luggage: "3 large suitcases", fuelType: "Gasoline", imageUrl: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=600&q=80", dailyPayNow: 7200, dailyPayLater: 8000 },
  { id: "v21", groupCode: "VAN1", name: "Toyota Commuter or similar", category: "Van", transmission: "A", seats: 11, luggage: "8 large suitcases", fuelType: "Diesel", imageUrl: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600&q=80", dailyPayNow: 4950, dailyPayLater: 5500 },
  { id: "v22", groupCode: "VAN2", name: "Toyota Hiace or similar", category: "Van", transmission: "M", seats: 9, luggage: "6 large suitcases", fuelType: "Diesel", imageUrl: "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=600&q=80", dailyPayNow: 3600, dailyPayLater: 4000 },
  { id: "v23", groupCode: "HCAR1", name: "Toyota Corolla Cross Hybrid", category: "Hybrid", transmission: "A", seats: 5, luggage: "3 large suitcases", fuelType: "Hybrid", imageUrl: "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=600&q=80", dailyPayNow: 2700, dailyPayLater: 3000 },
  { id: "v24", groupCode: "HCAR2", name: "Honda HR-V Hybrid or similar", category: "Hybrid", transmission: "A", seats: 5, luggage: "4 large suitcases", fuelType: "Hybrid", imageUrl: "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=600&q=80", dailyPayNow: 2880, dailyPayLater: 3200 },
  { id: "v25", groupCode: "EV1", name: "BYD Atto 3 or similar", category: "EV", transmission: "A", seats: 5, luggage: "3 large suitcases", fuelType: "Electric", imageUrl: "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=600&q=80", dailyPayNow: 4050, dailyPayLater: 4500 },
  { id: "v26", groupCode: "EV2", name: "MG4 Electric or similar", category: "EV", transmission: "A", seats: 5, luggage: "3 large suitcases", fuelType: "Electric", imageUrl: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=600&q=80", dailyPayNow: 3600, dailyPayLater: 4000 },
  { id: "v27", groupCode: "PT1", name: "Toyota Hilux Revo or similar", category: "Pickup", transmission: "A", seats: 5, luggage: "4 large + cargo bed", fuelType: "Diesel", imageUrl: "https://images.unsplash.com/photo-1527786356703-4b100091cd2c?w=600&q=80", dailyPayNow: 2880, dailyPayLater: 3200 },
  { id: "v28", groupCode: "PT2", name: "Isuzu D-Max or similar", category: "Pickup", transmission: "A", seats: 5, luggage: "4 large + cargo bed", fuelType: "Diesel", imageUrl: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=600&q=80", dailyPayNow: 2700, dailyPayLater: 3000 },
  { id: "v29", groupCode: "PT3", name: "Ford Ranger or similar", category: "Pickup", transmission: "M", seats: 5, luggage: "4 large + cargo bed", fuelType: "Diesel", imageUrl: "https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=600&q=80", dailyPayNow: 2520, dailyPayLater: 2800 },
  { id: "v30", groupCode: "MCAR4", name: "Nissan Teana or similar", category: "Mid-size", transmission: "A", seats: 5, luggage: "3 large suitcases", fuelType: "Gasoline", imageUrl: "https://images.unsplash.com/photo-1502877338535-766e1452684a?w=600&q=80", dailyPayNow: 1800, dailyPayLater: 2000 },
];

function seedToSearchResult(
  seed: SearchVehicleSeed,
  days: number,
  locale?: MockLocale
): SearchResultVehicleGroup {
  const payLaterPrice = seed.dailyPayLater * days;
  const payNowPrice = seed.dailyPayNow * days;
  const category =
    locale && CATEGORY_BY_LOCALE[locale]?.[seed.category]
      ? CATEGORY_BY_LOCALE[locale][seed.category]
      : seed.category;
  return {
    groupCode: seed.groupCode,
    name: seed.name,
    category,
    seats: seed.seats,
    transmission: seed.transmission,
    luggage: seed.luggage,
    images: [{ url: seed.imageUrl, alt: seed.name }],
    payLaterPrice,
    payNowPrice,
    currency: "THB",
    availabilityStatus: "AVAILABLE",
  };
}

export interface SearchApiParams {
  pickup?: string;
  dropoff?: string;
  pickupAt?: string;
  dropoffAt?: string;
  category?: string;
  transmission?: string;
  min_price?: string;
  max_price?: string;
  sort?: string;
  page?: string;
  page_size?: string;
}

export interface SearchApiResponse {
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
  data: SearchResultVehicleGroup[];
}

export function runSearch(
  params: SearchApiParams,
  locale?: MockLocale
): SearchApiResponse {
  const pickupAt = params.pickupAt ?? new Date(Date.now()).toISOString().slice(0, 16);
  const dropoffAt = params.dropoffAt ?? new Date(Date.now() + 86400000).toISOString().slice(0, 16);
  const days = Math.max(
    1,
    Math.ceil(
      (new Date(dropoffAt).getTime() - new Date(pickupAt).getTime()) /
        (24 * 60 * 60 * 1000)
    )
  );

  const effectiveLocale =
    locale && (locale === "en" || locale === "th" || locale === "zh") ? locale : undefined;

  let seeds = [...VEHICLE_SEEDS];
  if (params.category) {
    const cat = params.category.toLowerCase();
    seeds = seeds.filter((s) => s.category.toLowerCase() === cat);
  }
  if (params.transmission) {
    const t = params.transmission.toUpperCase();
    if (t === "A" || t === "M") {
      seeds = seeds.filter((s) => s.transmission === t);
    }
  }

  let list = seeds.map((s) => seedToSearchResult(s, days, effectiveLocale));

  const minPrice = params.min_price ? parseInt(params.min_price, 10) : undefined;
  const maxPrice = params.max_price ? parseInt(params.max_price, 10) : undefined;
  if (minPrice != null && !Number.isNaN(minPrice)) {
    list = list.filter((v) => v.payNowPrice >= minPrice);
  }
  if (maxPrice != null && !Number.isNaN(maxPrice)) {
    list = list.filter((v) => v.payNowPrice <= maxPrice);
  }

  const sort = params.sort ?? "";
  if (sort === "price_asc") {
    list = [...list].sort((a, b) => a.payNowPrice - b.payNowPrice);
  } else if (sort === "price_desc") {
    list = [...list].sort((a, b) => b.payNowPrice - a.payNowPrice);
  } else if (sort === "name_asc") {
    list = [...list].sort((a, b) => a.name.localeCompare(b.name));
  }

  const total = list.length;
  const pageSize = Math.min(24, Math.max(1, parseInt(params.page_size ?? "9", 10) || 9));
  const page = Math.max(1, parseInt(params.page ?? "1", 10) || 1);
  const totalPages = Math.ceil(total / pageSize);
  const start = (page - 1) * pageSize;
  const data = list.slice(start, start + pageSize);

  return {
    total,
    page,
    page_size: pageSize,
    total_pages: totalPages,
    data,
  };
}

export function getBasePrices(groupCode: string): { payLater: number; payNow: number } | null {
  const seed = VEHICLE_SEEDS.find((s) => s.groupCode === groupCode);
  if (!seed) return null;
  return { payLater: seed.dailyPayLater, payNow: seed.dailyPayNow };
}

/** Build VehicleDetail for vehicle detail page when not in mockVehicleGroups */
export function getVehicleDetailByGroupCode(
  groupCode: string,
  locale?: MockLocale
): (VehicleDetail & { dailyPayNow?: number; dailyPayLater?: number }) | null {
  const seed = VEHICLE_SEEDS.find((s) => s.groupCode === groupCode);
  if (!seed) return null;
  const effectiveLocale =
    locale && (locale === "en" || locale === "th" || locale === "zh") ? locale : "en";
  const category =
    CATEGORY_BY_LOCALE[effectiveLocale]?.[seed.category] ?? seed.category;
  const inclusions = INCLUSIONS_BY_LOCALE[effectiveLocale] ?? INCLUSIONS_BY_LOCALE.en;
  const descriptionByLocale: Record<MockLocale, string> = {
    en: `${seed.category} vehicle. ${seed.fuelType} fuel.`,
    th: `รถระดับ${category} เชื้อเพลิง${seed.fuelType}`,
    zh: `${category}车型，${seed.fuelType}。`,
  };
  const description = descriptionByLocale[effectiveLocale] ?? descriptionByLocale.en;
  return {
    groupCode: seed.groupCode,
    name: seed.name,
    category,
    seats: seed.seats,
    transmission: seed.transmission,
    luggage: seed.luggage,
    description,
    images: [{ url: seed.imageUrl, alt: seed.name }],
    inclusions,
    availabilityStatus: "AVAILABLE",
    dailyPayNow: seed.dailyPayNow,
    dailyPayLater: seed.dailyPayLater,
  };
}
