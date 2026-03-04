import type { SearchResultVehicleGroup, VehicleDetail } from "@/types";
import { getCarImageUrl, CAR_MODELS_FOR_MOCK } from "@/lib/locationImages";

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

/** Category + groupCode + extra fields per seed (keep original groupCodes for API compatibility). */
const SEED_META: Pick<
  SearchVehicleSeed,
  "groupCode" | "category" | "transmission" | "seats" | "luggage" | "fuelType" | "dailyPayNow" | "dailyPayLater"
>[] = [
  { groupCode: "ECAR1", category: "Economy", transmission: "A", seats: 5, luggage: "2 large suitcases", fuelType: "Gasoline", dailyPayNow: 990, dailyPayLater: 1100 },
  { groupCode: "CCAR1", category: "Compact", transmission: "A", seats: 5, luggage: "2 medium + 1 small", fuelType: "Gasoline", dailyPayNow: 1350, dailyPayLater: 1500 },
  { groupCode: "CCAR2", category: "Compact", transmission: "A", seats: 5, luggage: "2 large suitcases", fuelType: "Gasoline", dailyPayNow: 1260, dailyPayLater: 1400 },
  { groupCode: "SUV1", category: "SUV", transmission: "A", seats: 7, luggage: "5 large suitcases", fuelType: "Diesel", dailyPayNow: 3150, dailyPayLater: 3500 },
  { groupCode: "VAN1", category: "Van", transmission: "A", seats: 7, luggage: "5 large suitcases", fuelType: "Diesel", dailyPayNow: 2700, dailyPayLater: 3000 },
  { groupCode: "PT1", category: "Pickup", transmission: "A", seats: 5, luggage: "4 large + cargo bed", fuelType: "Diesel", dailyPayNow: 2880, dailyPayLater: 3200 },
  { groupCode: "CCAR3", category: "Compact", transmission: "A", seats: 5, luggage: "2 medium + 1 small", fuelType: "Gasoline", dailyPayNow: 1530, dailyPayLater: 1700 },
  { groupCode: "SUV2", category: "SUV", transmission: "A", seats: 5, luggage: "4 large suitcases", fuelType: "Gasoline", dailyPayNow: 2700, dailyPayLater: 3000 },
  { groupCode: "SUV3", category: "SUV", transmission: "A", seats: 5, luggage: "4 large suitcases", fuelType: "Gasoline", dailyPayNow: 2880, dailyPayLater: 3200 },
  { groupCode: "CCAR4", category: "Compact", transmission: "A", seats: 5, luggage: "2 medium + 1 small", fuelType: "Gasoline", dailyPayNow: 1080, dailyPayLater: 1200 },
  { groupCode: "LCAR1", category: "Luxury", transmission: "A", seats: 5, luggage: "3 large suitcases", fuelType: "Gasoline", dailyPayNow: 7200, dailyPayLater: 8000 },
  { groupCode: "ECAR2", category: "Economy", transmission: "A", seats: 5, luggage: "2 large suitcases", fuelType: "Gasoline", dailyPayNow: 1080, dailyPayLater: 1200 },
  { groupCode: "MCAR1", category: "Mid-size", transmission: "A", seats: 5, luggage: "3 large suitcases", fuelType: "Gasoline", dailyPayNow: 1980, dailyPayLater: 2200 },
  { groupCode: "MCAR2", category: "Mid-size", transmission: "A", seats: 5, luggage: "3 large suitcases", fuelType: "Gasoline", dailyPayNow: 2160, dailyPayLater: 2400 },
  { groupCode: "SUV4", category: "SUV", transmission: "A", seats: 7, luggage: "5 large suitcases", fuelType: "Diesel", dailyPayNow: 3240, dailyPayLater: 3600 },
  { groupCode: "PCAR1", category: "Premium", transmission: "A", seats: 5, luggage: "3 large suitcases", fuelType: "Hybrid", dailyPayNow: 3780, dailyPayLater: 4200 },
  { groupCode: "PCAR2", category: "Premium", transmission: "A", seats: 5, luggage: "3 large suitcases", fuelType: "Gasoline", dailyPayNow: 4500, dailyPayLater: 5000 },
  { groupCode: "PCAR3", category: "Premium", transmission: "A", seats: 5, luggage: "3 large suitcases", fuelType: "Gasoline", dailyPayNow: 5400, dailyPayLater: 6000 },
  { groupCode: "LCAR2", category: "Luxury", transmission: "A", seats: 5, luggage: "3 large suitcases", fuelType: "Gasoline", dailyPayNow: 6750, dailyPayLater: 7500 },
  { groupCode: "VAN2", category: "Van", transmission: "M", seats: 9, luggage: "6 large suitcases", fuelType: "Diesel", dailyPayNow: 3600, dailyPayLater: 4000 },
  { groupCode: "HCAR1", category: "Hybrid", transmission: "A", seats: 5, luggage: "3 large suitcases", fuelType: "Hybrid", dailyPayNow: 2700, dailyPayLater: 3000 },
  { groupCode: "HCAR2", category: "Hybrid", transmission: "A", seats: 5, luggage: "4 large suitcases", fuelType: "Hybrid", dailyPayNow: 2880, dailyPayLater: 3200 },
  { groupCode: "EV1", category: "EV", transmission: "A", seats: 5, luggage: "3 large suitcases", fuelType: "Electric", dailyPayNow: 4050, dailyPayLater: 4500 },
  { groupCode: "EV2", category: "EV", transmission: "A", seats: 5, luggage: "3 large suitcases", fuelType: "Electric", dailyPayNow: 3600, dailyPayLater: 4000 },
  { groupCode: "PT2", category: "Pickup", transmission: "A", seats: 5, luggage: "4 large + cargo bed", fuelType: "Diesel", dailyPayNow: 2700, dailyPayLater: 3000 },
  { groupCode: "PT3", category: "Pickup", transmission: "M", seats: 5, luggage: "4 large + cargo bed", fuelType: "Diesel", dailyPayNow: 2520, dailyPayLater: 2800 },
  { groupCode: "ECAR3", category: "Economy", transmission: "M", seats: 5, luggage: "2 large suitcases", fuelType: "Gasoline", dailyPayNow: 900, dailyPayLater: 1000 },
  { groupCode: "ECAR4", category: "Economy", transmission: "A", seats: 5, luggage: "2 medium + 1 small", fuelType: "Gasoline", dailyPayNow: 1170, dailyPayLater: 1300 },
  { groupCode: "MCAR3", category: "Mid-size", transmission: "A", seats: 5, luggage: "3 large suitcases", fuelType: "Gasoline", dailyPayNow: 2250, dailyPayLater: 2500 },
  { groupCode: "MCAR4", category: "Mid-size", transmission: "A", seats: 5, luggage: "3 large suitcases", fuelType: "Gasoline", dailyPayNow: 1800, dailyPayLater: 2000 },
];

/** Seed data for search – aligned with image files in public/car; all imageUrl from /car/ */
const VEHICLE_SEEDS: SearchVehicleSeed[] = SEED_META.map((meta, i) => {
  const model = CAR_MODELS_FOR_MOCK[i % CAR_MODELS_FOR_MOCK.length];
  return {
    id: `v${i + 1}`,
    groupCode: meta.groupCode,
    name: model.name,
    imageUrl: getCarImageUrl(model.filename),
    category: meta.category,
    transmission: meta.transmission,
    seats: meta.seats,
    luggage: meta.luggage,
    fuelType: meta.fuelType,
    dailyPayNow: meta.dailyPayNow,
    dailyPayLater: meta.dailyPayLater,
  };
});

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
