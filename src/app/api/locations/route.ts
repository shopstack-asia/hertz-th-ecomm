import { NextRequest } from "next/server";
import { getLocaleFromRequest } from "@/lib/request-locale";
import {
  getLocationsBranches,
  type LocationBranch,
  type ProvinceCode,
} from "@/lib/mock/locationsBranches";

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

/** Pool of location-themed placeholder images (buildings, airports, cars). 3–4 per branch. */
const LOCATION_IMAGE_POOL = [
  "https://images.unsplash.com/photo-1569163138752-3d4e1d2f872e?w=800&q=80",
  "https://images.unsplash.com/photo-1587293852726-70cdb56c3206?w=800&q=80",
  "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&q=80",
  "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80",
] as const;

/** Ensure array has 3–4 images; pad from pool if needed. */
function ensureLocationImages(arr: string[]): string[] {
  const want = 4;
  if (arr.length >= want) return arr.slice(0, want);
  const out = [...arr];
  for (let i = out.length; i < want; i++) {
    out.push(LOCATION_IMAGE_POOL[i % LOCATION_IMAGE_POOL.length]);
  }
  return out;
}

/** Placeholder images per branch (3–4 per location). Use branch id as key. */
const BRANCH_IMAGES: Record<string, string[]> = {
  "bkk-suv": ensureLocationImages([
    "https://images.unsplash.com/photo-1569163138752-3d4e1d2f872e?w=800&q=80",
    "https://images.unsplash.com/photo-1587293852726-70cdb56c3206?w=800&q=80",
    "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&q=80",
    "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80",
  ]),
  "bkk-dmk": ensureLocationImages([
    "https://images.unsplash.com/photo-1569163138752-3d4e1d2f872e?w=800&q=80",
    "https://images.unsplash.com/photo-1587293852726-70cdb56c3206?w=800&q=80",
    "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&q=80",
    "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80",
  ]),
  "bkk-sathorn": ensureLocationImages([
    "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&q=80",
    "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80",
    "https://images.unsplash.com/photo-1569163138752-3d4e1d2f872e?w=800&q=80",
    "https://images.unsplash.com/photo-1587293852726-70cdb56c3206?w=800&q=80",
  ]),
  "bkk-siam": ensureLocationImages([
    "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&q=80",
    "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80",
    "https://images.unsplash.com/photo-1569163138752-3d4e1d2f872e?w=800&q=80",
    "https://images.unsplash.com/photo-1587293852726-70cdb56c3206?w=800&q=80",
  ]),
  "bkk-sukhumvit": ensureLocationImages([
    "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&q=80",
    "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80",
    "https://images.unsplash.com/photo-1569163138752-3d4e1d2f872e?w=800&q=80",
    "https://images.unsplash.com/photo-1587293852726-70cdb56c3206?w=800&q=80",
  ]),
  "cnx-airport": ensureLocationImages([
    "https://images.unsplash.com/photo-1569163138752-3d4e1d2f872e?w=800&q=80",
    "https://images.unsplash.com/photo-1587293852726-70cdb56c3206?w=800&q=80",
    "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&q=80",
    "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80",
  ]),
  "cnx-nimman": ensureLocationImages([
    "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&q=80",
    "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80",
    "https://images.unsplash.com/photo-1569163138752-3d4e1d2f872e?w=800&q=80",
    "https://images.unsplash.com/photo-1587293852726-70cdb56c3206?w=800&q=80",
  ]),
  "hkt-airport": ensureLocationImages([
    "https://images.unsplash.com/photo-1569163138752-3d4e1d2f872e?w=800&q=80",
    "https://images.unsplash.com/photo-1587293852726-70cdb56c3206?w=800&q=80",
    "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&q=80",
    "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80",
  ]),
  "hkt-patong": ensureLocationImages([
    "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&q=80",
    "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80",
    "https://images.unsplash.com/photo-1569163138752-3d4e1d2f872e?w=800&q=80",
    "https://images.unsplash.com/photo-1587293852726-70cdb56c3206?w=800&q=80",
  ]),
  "hkt-kata": ensureLocationImages([
    "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&q=80",
    "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80",
    "https://images.unsplash.com/photo-1569163138752-3d4e1d2f872e?w=800&q=80",
    "https://images.unsplash.com/photo-1587293852726-70cdb56c3206?w=800&q=80",
  ]),
  "kkc-airport": ensureLocationImages([
    "https://images.unsplash.com/photo-1569163138752-3d4e1d2f872e?w=800&q=80",
    "https://images.unsplash.com/photo-1587293852726-70cdb56c3206?w=800&q=80",
    "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&q=80",
    "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80",
  ]),
  "kkc-downtown": ensureLocationImages([
    "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&q=80",
    "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80",
    "https://images.unsplash.com/photo-1569163138752-3d4e1d2f872e?w=800&q=80",
    "https://images.unsplash.com/photo-1587293852726-70cdb56c3206?w=800&q=80",
  ]),
  "uth-airport": ensureLocationImages([
    "https://images.unsplash.com/photo-1569163138752-3d4e1d2f872e?w=800&q=80",
    "https://images.unsplash.com/photo-1587293852726-70cdb56c3206?w=800&q=80",
    "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&q=80",
    "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80",
  ]),
  "uth-downtown": ensureLocationImages([
    "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&q=80",
    "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80",
    "https://images.unsplash.com/photo-1569163138752-3d4e1d2f872e?w=800&q=80",
    "https://images.unsplash.com/photo-1587293852726-70cdb56c3206?w=800&q=80",
  ]),
  "hdy-airport": ensureLocationImages([
    "https://images.unsplash.com/photo-1569163138752-3d4e1d2f872e?w=800&q=80",
    "https://images.unsplash.com/photo-1587293852726-70cdb56c3206?w=800&q=80",
    "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&q=80",
    "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80",
  ]),
  "hdy-downtown": ensureLocationImages([
    "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&q=80",
    "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80",
    "https://images.unsplash.com/photo-1569163138752-3d4e1d2f872e?w=800&q=80",
    "https://images.unsplash.com/photo-1587293852726-70cdb56c3206?w=800&q=80",
  ]),
  "usm-airport": ensureLocationImages([
    "https://images.unsplash.com/photo-1569163138752-3d4e1d2f872e?w=800&q=80",
    "https://images.unsplash.com/photo-1587293852726-70cdb56c3206?w=800&q=80",
    "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&q=80",
    "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80",
  ]),
  "usm-chaweng": ensureLocationImages([
    "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&q=80",
    "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80",
    "https://images.unsplash.com/photo-1569163138752-3d4e1d2f872e?w=800&q=80",
    "https://images.unsplash.com/photo-1587293852726-70cdb56c3206?w=800&q=80",
  ]),
  "utp-airport": ensureLocationImages([
    "https://images.unsplash.com/photo-1569163138752-3d4e1d2f872e?w=800&q=80",
    "https://images.unsplash.com/photo-1587293852726-70cdb56c3206?w=800&q=80",
    "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&q=80",
    "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80",
  ]),
  "pattaya-beach": ensureLocationImages([
    "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&q=80",
    "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80",
    "https://images.unsplash.com/photo-1569163138752-3d4e1d2f872e?w=800&q=80",
    "https://images.unsplash.com/photo-1587293852726-70cdb56c3206?w=800&q=80",
  ]),
  "pattaya-central": ensureLocationImages([
    "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80",
    "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&q=80",
    "https://images.unsplash.com/photo-1569163138752-3d4e1d2f872e?w=800&q=80",
    "https://images.unsplash.com/photo-1587293852726-70cdb56c3206?w=800&q=80",
  ]),
  "pits-airport": ensureLocationImages([
    "https://images.unsplash.com/photo-1569163138752-3d4e1d2f872e?w=800&q=80",
    "https://images.unsplash.com/photo-1587293852726-70cdb56c3206?w=800&q=80",
    "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&q=80",
    "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80",
  ]),
  "urt-surat": ensureLocationImages([
    "https://images.unsplash.com/photo-1569163138752-3d4e1d2f872e?w=800&q=80",
    "https://images.unsplash.com/photo-1587293852726-70cdb56c3206?w=800&q=80",
    "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&q=80",
    "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80",
  ]),
  "kbit-airport": ensureLocationImages([
    "https://images.unsplash.com/photo-1569163138752-3d4e1d2f872e?w=800&q=80",
    "https://images.unsplash.com/photo-1587293852726-70cdb56c3206?w=800&q=80",
    "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&q=80",
    "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80",
  ]),
  "kbit-ao-nang": ensureLocationImages([
    "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&q=80",
    "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80",
    "https://images.unsplash.com/photo-1569163138752-3d4e1d2f872e?w=800&q=80",
    "https://images.unsplash.com/photo-1587293852726-70cdb56c3206?w=800&q=80",
  ]),
  "bkk-mega": ensureLocationImages([
    "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80",
    "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&q=80",
    "https://images.unsplash.com/photo-1569163138752-3d4e1d2f872e?w=800&q=80",
    "https://images.unsplash.com/photo-1587293852726-70cdb56c3206?w=800&q=80",
  ]),
  "cnx-central": ensureLocationImages([
    "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80",
    "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&q=80",
    "https://images.unsplash.com/photo-1569163138752-3d4e1d2f872e?w=800&q=80",
    "https://images.unsplash.com/photo-1587293852726-70cdb56c3206?w=800&q=80",
  ]),
  "hkt-central": ensureLocationImages([
    "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80",
    "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&q=80",
    "https://images.unsplash.com/photo-1569163138752-3d4e1d2f872e?w=800&q=80",
    "https://images.unsplash.com/photo-1587293852726-70cdb56c3206?w=800&q=80",
  ]),
};

function toApiBranch(b: LocationBranch) {
  const images = BRANCH_IMAGES[b.id] ?? [...LOCATION_IMAGE_POOL];
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
