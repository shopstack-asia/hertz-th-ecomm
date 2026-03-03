import { NextRequest } from "next/server";
import { getLocaleFromRequest } from "@/lib/request-locale";
import {
  getSpecialOffers,
  type SpecialOffer,
} from "@/lib/mock/specialOffers";

function isExpired(offer: SpecialOffer): boolean {
  const today = new Date().toISOString().slice(0, 10);
  return offer.valid_to < today;
}

function filterOffers(
  offers: SpecialOffer[],
  params: {
    promotion_type?: string;
    is_member_only?: string;
    is_active?: string;
  }
): SpecialOffer[] {
  let result = [...offers];

  if (params.is_active !== "false") {
    result = result.filter((o) => o.is_active && !isExpired(o));
  }

  if (params.promotion_type) {
    result = result.filter((o) => o.promotion_type === params.promotion_type);
  }

  if (params.is_member_only === "true") {
    result = result.filter((o) => o.is_member_only);
  }

  return result;
}

export async function GET(request: NextRequest) {
  const locale = getLocaleFromRequest(request);
  const offers = getSpecialOffers(locale);
  const { searchParams } = new URL(request.url);
  const promotion_type = searchParams.get("promotion_type") ?? undefined;
  const is_member_only = searchParams.get("is_member_only") ?? undefined;
  const is_active = searchParams.get("is_active") ?? undefined;
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10) || 1);
  const page_size = Math.min(24, Math.max(1, parseInt(searchParams.get("page_size") ?? "6", 10) || 6));

  const filtered = filterOffers(offers, {
    promotion_type,
    is_member_only,
    is_active,
  });

  const total = filtered.length;
  const total_pages = Math.ceil(total / page_size);
  const start = (page - 1) * page_size;
  const data = filtered.slice(start, start + page_size);

  return Response.json({
    total,
    page,
    page_size,
    total_pages,
    data,
  });
}
