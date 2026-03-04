import { NextRequest } from "next/server";
import { getLocaleFromRequest } from "@/lib/request-locale";
import {
  getLocationsBranches,
  type LocationBranch,
  type ProvinceCode,
} from "@/lib/mock/locationsBranches";
import { generateLocationImages } from "@/lib/locationImages";

/** Normalize frontend province (e.g. "Bangkok", "Chiang Mai") to province_code for filtering. */
function provinceParamToCode(province: string): ProvinceCode | null {
  const normalized = province
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "_") as ProvinceCode;
  const allowed: ProvinceCode[] = [
    "bangkok",
    "chiang_mai",
    "phuket",
    "khon_kaen",
    "udon_thani",
    "songkhla",
    "surat_thani",
    "chonburi",
    "phitsanulok",
    "krabi",
    "samut_prakan",
  ];
  return allowed.includes(normalized) ? normalized : null;
}

/** Legacy format for LocationSelect (booking dropdown) */
function toLegacyFormat(branches: LocationBranch[]) {
  return branches.map((b) => ({
    code: b.code,
    name: b.name,
    city: b.province,
    address: b.address,
  }));
}

function filterBranches(
  branches: LocationBranch[],
  params: { province?: string; branch_type?: string; keyword?: string }
): LocationBranch[] {
  let result = [...branches];

  if (params.province) {
    const code = provinceParamToCode(params.province);
    if (code) {
      result = result.filter((b) => b.province_code === code);
    } else {
      const p = params.province.toLowerCase();
      result = result.filter((b) => b.province.toLowerCase() === p);
    }
  }

  if (params.branch_type) {
    const t = params.branch_type;
    result = result.filter((b) => b.branch_type === t);
  }

  if (params.keyword) {
    const k = params.keyword.toLowerCase().trim();
    result = result.filter(
      (b) =>
        b.name.toLowerCase().includes(k) ||
        b.address.toLowerCase().includes(k) ||
        b.district.toLowerCase().includes(k) ||
        b.province.toLowerCase().includes(k)
    );
  }

  return result;
}

function toApiBranch(b: LocationBranch) {
  const images = generateLocationImages(b.id, b.name, b.branch_type, b.province);
  return {
    id: b.id,
    code: b.code,
    name: b.name,
    branch_type: b.branch_type,
    province: b.province,
    district: b.district,
    address: b.address,
    phone: b.phone,
    opening_hours: b.opening_hours,
    latitude: b.latitude,
    longitude: b.longitude,
    is_24_hours: b.is_24_hours,
    images,
  };
}

export async function GET(request: NextRequest) {
  const locale = getLocaleFromRequest(request);
  const branches = getLocationsBranches(locale);
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") ?? searchParams.get("keyword") ?? undefined;
  const province = searchParams.get("province") ?? undefined;
  const branch_type = searchParams.get("branch_type") ?? undefined;
  const keyword = searchParams.get("keyword") ?? undefined;

  const filtered = filterBranches(branches, {
    province,
    branch_type,
    keyword: keyword ?? q,
  });

  // Legacy format for LocationSelect (booking dropdown). Locations page sends list=1 to get { total, data }.
  const isLocationsPage =
    searchParams.get("list") === "1" ||
    province ||
    branch_type ||
    keyword != null ||
    q != null ||
    searchParams.has("page") ||
    searchParams.has("page_size");
  if (!isLocationsPage) {
    return Response.json(toLegacyFormat(filtered));
  }

  return Response.json({
    total: filtered.length,
    data: filtered.map(toApiBranch),
  });
}
