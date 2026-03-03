import { NextRequest } from "next/server";
import { getLocaleFromRequest } from "@/lib/request-locale";
import { runSearch } from "@/lib/mock/searchVehicles";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const locale = getLocaleFromRequest(request);

  const params = {
    pickup: searchParams.get("pickup") ?? undefined,
    dropoff: searchParams.get("dropoff") ?? undefined,
    pickupAt: searchParams.get("pickupAt") ?? undefined,
    dropoffAt: searchParams.get("dropoffAt") ?? undefined,
    category: searchParams.get("category") ?? undefined,
    transmission: searchParams.get("transmission") ?? undefined,
    min_price: searchParams.get("min_price") ?? undefined,
    max_price: searchParams.get("max_price") ?? undefined,
    sort: searchParams.get("sort") ?? undefined,
    page: searchParams.get("page") ?? undefined,
    page_size: searchParams.get("page_size") ?? undefined,
  };

  const results = runSearch(params, locale);
  return Response.json(results);
}
