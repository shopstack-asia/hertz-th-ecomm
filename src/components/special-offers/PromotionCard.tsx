"use client";

import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";

interface PromotionCardProps {
  offer: {
    id: string;
    title: string;
    short_description: string;
    badge_label: string;
    valid_to: string;
    is_member_only: boolean;
    thumbnail_image_url: string;
    hero_image_url: string;
  };
}

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function PromotionCard({ offer }: PromotionCardProps) {
  const { t } = useLanguage();
  const validDate = formatDate(offer.valid_to);
  return (
    <article className="group flex flex-col overflow-hidden border border-hertz-border bg-white transition-all duration-200 ease-out hover:border-[#FFCC00]/60 hover:shadow-card">
      <Link href={`/search?promo=${offer.id}`} className="flex flex-1 flex-col">
        <div className="relative aspect-[16/10] bg-hertz-gray">
          <img
            src={offer.hero_image_url}
            alt=""
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-[1.02]"
          />
          <span className="absolute right-3 top-3 bg-[#FFCC00] px-2 py-1 text-xs font-bold text-black">
            {offer.badge_label}
          </span>
          {offer.is_member_only && (
            <span className="absolute left-3 top-3 border border-white bg-black/70 px-2 py-1 text-xs font-medium text-white">
              {t("specialOffers.member_only_badge")}
            </span>
          )}
        </div>
        <div className="flex flex-1 flex-col p-4 lg:p-5">
          <h2 className="text-lg font-bold text-black">{offer.title}</h2>
          <p className="mt-2 flex-1 text-sm text-[#434244]">
            {offer.short_description}
          </p>
          <p className="mt-3 text-xs text-hertz-black-60">
            {t("specialOffers.valid_until", { date: validDate })}
          </p>
          <span className="mt-4 inline-block font-bold text-black transition-transform group-hover:translate-x-1">
            {t("specialOffers.view_offer")} →
          </span>
        </div>
      </Link>
      <div className="border-t border-hertz-border p-4 pt-0 lg:p-5 lg:pt-0">
        <Link
          href={`/search?promo=${offer.id}`}
          className="flex min-h-tap w-full items-center justify-center bg-[#FFCC00] font-bold text-black transition-colors hover:bg-[#FFCC00]/90"
        >
          {t("specialOffers.search_vehicles")}
        </Link>
      </div>
    </article>
  );
}
