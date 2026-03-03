"use client";

import { useEffect, useState, useCallback } from "react";
import { PageTemplate } from "@/components/layout/PageTemplate";
import { PromotionCard } from "@/components/special-offers/PromotionCard";
import { useLanguage } from "@/contexts/LanguageContext";

interface ApiOffer {
  id: string;
  title: string;
  short_description: string;
  badge_label: string;
  valid_to: string;
  is_member_only: boolean;
  thumbnail_image_url: string;
  hero_image_url: string;
}

interface ApiResponse {
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
  data: ApiOffer[];
}

const PROMOTION_TYPES: { value: string; key: string }[] = [
  { value: "", key: "specialOffers.type_all" },
  { value: "Pay Now Discount", key: "specialOffers.type_pay_now" },
  { value: "Long Rental Deal", key: "specialOffers.type_long_rental" },
  { value: "Member Exclusive", key: "specialOffers.type_member_exclusive" },
  { value: "Airport Special", key: "specialOffers.type_airport" },
  { value: "Early Bird", key: "specialOffers.type_early_bird" },
  { value: "EV Promotion", key: "specialOffers.type_ev" },
];

const PAGE_SIZE = 6;

function SpecialOffersContent() {
  const { t } = useLanguage();
  const [response, setResponse] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [promotionType, setPromotionType] = useState("");
  const [memberOnly, setMemberOnly] = useState("");
  const [page, setPage] = useState(1);

  const fetchOffers = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (promotionType) params.set("promotion_type", promotionType);
    if (memberOnly === "true") params.set("is_member_only", "true");
    params.set("page", String(page));
    params.set("page_size", String(PAGE_SIZE));

    const res = await fetch(`/api/special-offers?${params}`);
    const data = await res.json();
    setResponse(data);
    setLoading(false);
  }, [promotionType, memberOnly, page]);

  useEffect(() => {
    fetchOffers();
  }, [fetchOffers]);

  const updateFilter = (updates: {
    promotionType?: string;
    memberOnly?: string;
    page?: number;
  }) => {
    if (updates.promotionType !== undefined) setPromotionType(updates.promotionType);
    if (updates.memberOnly !== undefined) setMemberOnly(updates.memberOnly);
    if (updates.page !== undefined) setPage(updates.page);
    if (
      updates.promotionType !== undefined ||
      updates.memberOnly !== undefined
    ) {
      setPage(1);
    }
  };

  const total = response?.total ?? 0;
  const totalPages = response?.total_pages ?? 0;
  const currentPage = response?.page ?? 1;
  const offers = response?.data ?? [];

  return (
    <PageTemplate
      title={t("specialOffers.page_title")}
      breadcrumb={[{ label: t("common.home"), href: "/" }, { label: t("specialOffers.breadcrumb") }]}
    >
      <p className="text-[#434244]">
        {t("specialOffers.intro")}
      </p>

      <div className="mt-8 flex flex-col gap-6">
        <div className="flex flex-wrap items-center gap-4">
          <select
            value={promotionType}
            onChange={(e) => updateFilter({ promotionType: e.target.value })}
            className="min-h-tap border border-hertz-border bg-white px-4 py-3 text-sm font-medium text-[#434244] focus:border-[#FFCC00] focus:ring-2 focus:ring-[#FFCC00]/30"
            aria-label={t("specialOffers.filter_by_type")}
          >
            {PROMOTION_TYPES.map((typeOpt) => (
              <option key={typeOpt.value || "all"} value={typeOpt.value}>
                {t(typeOpt.key)}
              </option>
            ))}
          </select>
          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              checked={memberOnly === "true"}
              onChange={(e) =>
                updateFilter({ memberOnly: e.target.checked ? "true" : "" })
              }
              className="h-4 w-4 border-hertz-border"
            />
            <span className="text-sm text-[#434244]">{t("specialOffers.member_only")}</span>
          </label>
          <p className="ml-auto text-sm text-hertz-black-80">
            {loading ? t("specialOffers.loading") : total === 1 ? t("specialOffers.offer_found_one") : t("specialOffers.offers_found", { count: total })}
          </p>
        </div>

        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-80 animate-pulse bg-hertz-gray" />
            ))}
          </div>
        ) : offers.length === 0 ? (
          <div className="rounded border border-hertz-border bg-white p-12 text-center">
            <p className="text-hertz-black-80">
              {t("specialOffers.no_match")}
            </p>
            <button
              type="button"
              onClick={() =>
                updateFilter({
                  promotionType: "",
                  memberOnly: "",
                  page: 1,
                })
              }
              className="mt-4 font-bold text-black underline hover:no-underline"
            >
              {t("specialOffers.clear_filters")}
            </button>
          </div>
        ) : (
          <>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {offers.map((offer) => (
                <PromotionCard key={offer.id} offer={offer} />
              ))}
            </div>

            {totalPages > 1 && (
              <nav
                className="flex flex-wrap items-center justify-center gap-2"
                aria-label={t("common.pagination")}
              >
                <button
                  type="button"
                  onClick={() => updateFilter({ page: currentPage - 1 })}
                  disabled={currentPage <= 1}
                  className="min-h-tap min-w-tap border border-hertz-border px-3 text-sm font-medium text-hertz-black-80 transition-colors hover:border-black hover:text-black disabled:opacity-50 disabled:pointer-events-none"
                  aria-label={t("common.previous")}
                >
                  ← {t("specialOffers.previous")}
                </button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => updateFilter({ page: p })}
                        className={`min-h-tap min-w-tap border px-3 text-sm font-medium transition-colors ${
                          p === currentPage
                            ? "border-black bg-black text-white"
                            : "border-hertz-border text-hertz-black-80 hover:border-black hover:text-black"
                        }`}
                        aria-current={
                          p === currentPage ? "page" : undefined
                        }
                        aria-label={`Page ${p}`}
                      >
                        {p}
                      </button>
                    )
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => updateFilter({ page: currentPage + 1 })}
                  disabled={currentPage >= totalPages}
                  className="min-h-tap min-w-tap border border-hertz-border px-3 text-sm font-medium text-hertz-black-80 transition-colors hover:border-black hover:text-black disabled:opacity-50 disabled:pointer-events-none"
                  aria-label={t("common.next")}
                >
                  {t("specialOffers.next")} →
                </button>
              </nav>
            )}
          </>
        )}
      </div>
    </PageTemplate>
  );
}

export default function SpecialOffersPage() {
  return <SpecialOffersContent />;
}
