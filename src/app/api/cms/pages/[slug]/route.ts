import { NextRequest } from "next/server";
import { getLocaleFromRequest } from "@/lib/request-locale";
import { getCmsPageBySlug } from "@/lib/mock/cmsPages";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const locale = getLocaleFromRequest(request);
  const { slug } = await params;
  const page = getCmsPageBySlug(slug, locale);

  if (!page) {
    return Response.json({ error: "Page not found" }, { status: 404 });
  }

  if (!page.is_published) {
    return Response.json({ error: "Page not published" }, { status: 404 });
  }

  return Response.json(page);
}
