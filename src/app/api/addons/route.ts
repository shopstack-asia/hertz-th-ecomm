import { NextRequest } from "next/server";
import { getLocaleFromRequest, type ApiLocale } from "@/lib/request-locale";

export type AddOnPricingType = "daily" | "flat";

export interface AddOnItem {
  id: string;
  type: AddOnPricingType;
  price: number;
  name: string;
  description: string;
  disclaimer?: string;
  min_seats?: number;
  insurance_type?: "premium" | "zero_excess";
  seasonal?: boolean;
}

const ALL_ADDONS: AddOnItem[] = [
  { id: "child_seat", type: "daily", price: 200, name: "Child Seat", description: "Safety seat for children under 4 years old. Fits most vehicles.", min_seats: 4 },
  { id: "gps", type: "daily", price: 150, name: "GPS Navigation", description: "Portable GPS unit with Thailand maps and traffic updates." },
  { id: "easy_pass", type: "flat", price: 100, name: "Easy Pass (Toll Box)", description: "Electronic toll collection device for expressways.", disclaimer: "Toll fees not included." },
  { id: "additional_driver", type: "flat", price: 300, name: "Additional Driver", description: "Add one additional authorised driver to your rental at no extra daily charge." },
  { id: "premium_insurance", type: "daily", price: 400, name: "Premium Insurance Upgrade", description: "Enhanced coverage with reduced excess. Replaces standard insurance.", insurance_type: "premium" },
  { id: "zero_excess", type: "daily", price: 600, name: "Zero Excess Insurance", description: "No excess payable in case of damage. Cannot be combined with Premium Insurance.", insurance_type: "zero_excess" },
  { id: "wifi_router", type: "daily", price: 250, name: "WiFi Router", description: "Portable WiFi hotspot for internet on the go." },
  { id: "snow_chains", type: "daily", price: 350, name: "Snow Chains", description: "For winter conditions in eligible regions. Seasonal availability.", seasonal: true },
  { id: "drop_fee", type: "flat", price: 500, name: "One-way Drop Fee", description: "Return your vehicle to a different location. Only shown when one-way rental." },
];

const ADDON_TRANSLATIONS: Record<ApiLocale, Record<string, { name: string; description: string; disclaimer?: string }>> = {
  en: {},
  th: {
    child_seat: { name: "ที่นั่งเด็ก", description: "ที่นั่งนิรภัยสำหรับเด็กต่ำกว่า 4 ปี ใช้ได้กับรถส่วนใหญ่" },
    gps: { name: "GPS นำทาง", description: "เครื่องนำทางพกพาพร้อมแผนที่ไทยและจราจร" },
    easy_pass: { name: "Easy Pass (กล่องเก็บค่าทางด่วน)", description: "อุปกรณ์เก็บค่าทางด่วนอัตโนมัติ", disclaimer: "ไม่รวมค่าทางด่วน" },
    additional_driver: { name: "คนขับเพิ่ม", description: "เพิ่มคนขับที่อนุญาตอีกหนึ่งคนโดยไม่คิดค่าต่อวัน" },
    premium_insurance: { name: "ประกันพรีเมียม", description: "ความคุ้มครองเพิ่ม ลดค่าเสียหายส่วนแรก" },
    zero_excess: { name: "ประกันไม่เสียส่วนแรก", description: "ไม่ต้องจ่ายส่วนแรกในกรณีเสียหาย" },
    wifi_router: { name: "เราเตอร์ WiFi", description: "จุดเชื่อมต่อ WiFi พกพา" },
    snow_chains: { name: "โซ่หิมะ", description: "สำหรับสภาพฤดูหนาว" },
    drop_fee: { name: "ค่าคืนคนละจุด", description: "คืนรถที่สาขาอื่น" },
  },
  zh: {
    child_seat: { name: "儿童座椅", description: "4岁以下儿童安全座椅，适用于大多数车型。" },
    gps: { name: "GPS导航", description: "便携式GPS，含泰国地图与交通信息。" },
    easy_pass: { name: "Easy Pass（电子收费）", description: "高速公路电子收费设备。", disclaimer: "不含过路费。" },
    additional_driver: { name: "增驾员", description: "增加一名授权驾驶员，不另收日费。" },
    premium_insurance: { name: "升级保险", description: "更高保额、更低自负额。" },
    zero_excess: { name: "零自负额保险", description: "出险时无需支付自负额。" },
    wifi_router: { name: "WiFi热点", description: "便携式WiFi热点。" },
    snow_chains: { name: "防滑链", description: "适用于冬季路况。" },
    drop_fee: { name: "异地还车费", description: "在其它门店还车。" },
  },
};

function localizeAddons(addons: AddOnItem[], locale: ApiLocale): AddOnItem[] {
  const t = ADDON_TRANSLATIONS[locale];
  if (!t || Object.keys(t).length === 0) return addons;
  return addons.map((a) => {
    const over = t[a.id];
    if (!over) return a;
    return { ...a, name: over.name, description: over.description, disclaimer: over.disclaimer ?? a.disclaimer };
  });
}

export async function GET(request: NextRequest) {
  const locale = getLocaleFromRequest(request);
  const seatsParam = request.nextUrl.searchParams.get("seats");
  const seats = seatsParam ? Math.max(0, parseInt(seatsParam, 10) || 0) : undefined;
  const oneWay = request.nextUrl.searchParams.get("oneWay") === "true";

  let list = [...ALL_ADDONS];
  if (seats != null && seats > 0) {
    list = list.filter((a) => a.min_seats == null || seats >= a.min_seats);
  }
  if (!oneWay) {
    list = list.filter((a) => a.id !== "drop_fee");
  }
  const addons = localizeAddons(list, locale);
  return Response.json({ addons });
}
