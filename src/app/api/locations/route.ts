import { NextRequest } from "next/server";
import {
  LOCATIONS_BRANCHES,
  type LocationBranch,
} from "@/lib/mock/locationsBranches";

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
    const p = params.province.toLowerCase();
    result = result.filter((b) => b.province.toLowerCase() === p);
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
  return {
    id: b.id,
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
  };
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") ?? searchParams.get("keyword") ?? undefined;
  const province = searchParams.get("province") ?? undefined;
  const branch_type = searchParams.get("branch_type") ?? undefined;
  const keyword = searchParams.get("keyword") ?? undefined;

  const filtered = filterBranches(LOCATIONS_BRANCHES, {
    province,
    branch_type,
    keyword: keyword ?? q,
  });

  // Legacy format for LocationSelect (booking dropdown): no Locations page params
  const isLocationsPage =
    province || branch_type || searchParams.has("page") || searchParams.has("page_size");
  if (!isLocationsPage) {
    return Response.json(toLegacyFormat(filtered));
  }

  return Response.json({
    total: filtered.length,
    data: filtered.map(toApiBranch),
  });
}
